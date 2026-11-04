"use client";

import React from "react";
import { ImageOff } from "lucide-react";
import { t, useComponentsI18n } from "../i18n";
import { formatAspect, validateImage } from "./imageUploadLogic";
import { matchesMedia } from "./fileUploadLogic";
import { SgFileUpload, type SgFileRejection, type SgFileUploadProps, type SgFileValue } from "./SgFileUpload";

/**
 * SgImageUpload (P133, refeito no P141 como COMPOSICAO do SgFileUpload): so imagens (`mediaType: ["image"]`, tipo
 * conferido pelo conteudo), miniaturas no lugar do icone e as regras que so existem para imagem: largura/altura
 * minimas e proporcao. Valor = lista (uma imagem = lista de uma); `maxFiles` maior que 1 mostra a grade.
 */
export type SgImageUploadProps = Omit<
  SgFileUploadProps,
  "mediaType" | "extraCheck" | "renderThumbnail" | "thumbnailSize" | "dropTextKey" | "dropManyTextKey" | "typeNames" | "pickerAccept" | "keyPrefix"
> & {
  /** Restringe os formatos de imagem em texto livre (`.png`, `image/jpeg`), separados por virgula. */
  accept?: string;
  /** Largura minima em px. */
  minWidth?: number;
  /** Altura minima em px. */
  minHeight?: number;
  /** Proporcao largura/altura exigida (1 = quadrada, 16 / 9). */
  aspect?: number;
  /** Altura da miniatura em px (padrao 160; na grade, no maximo 120). */
  previewHeight?: number;
};

function readDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function Thumbnail(props: { file: SgFileValue; id: string; side: number }) {
  const { file, id, side } = props;
  const [url, setUrl] = React.useState<string | null>(null);
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => {
    setBroken(false);
    if (typeof File !== "undefined" && file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setUrl("url" in file && file.url ? file.url : null);
    return undefined;
  }, [file]);
  if (!url || broken) {
    return (
      <span className="flex size-full items-center justify-center bg-muted/40 text-muted-foreground">
        <ImageOff className="size-5" aria-hidden="true" />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={file.name}
      data-sg={`sg-image-preview-${id}-${file.name}`}
      width={side}
      height={side}
      onError={() => setBroken(true)}
      className="size-full object-cover"
    />
  );
}

export function SgImageUpload(props: SgImageUploadProps) {
  const i18n = useComponentsI18n();
  const { accept, minWidth, minHeight, aspect, previewHeight = 160, maxFiles, id, ...rest } = props;
  const multi = (maxFiles ?? 1) > 1;
  const side = multi && previewHeight > 120 ? 120 : previewHeight;

  const check = async (file: File, info: { mime: string }): Promise<SgFileRejection | null> => {
    if ((accept ?? "").trim() && !matchesMedia(file.name, info.mime, undefined, accept)) {
      return { code: "type", message: t(i18n, "components.inputs.fileupload.type", { types: (accept ?? "").trim() }) };
    }
    const needsDimensions = minWidth !== undefined || minHeight !== undefined || aspect !== undefined;
    if (!needsDimensions) return null;
    const dims = await readDimensions(file);
    const code = validateImage(
      { name: "", type: "", size: file.size, width: dims?.width, height: dims?.height },
      { accept: "", minWidth, minHeight, aspect }
    );
    if (code === "dimension") {
      return {
        code,
        message: t(i18n, "components.inputs.imageupload.dimension", {
          minWidth: String(minWidth ?? 0),
          minHeight: String(minHeight ?? 0)
        })
      };
    }
    if (code === "aspect") {
      return { code, message: t(i18n, "components.inputs.imageupload.aspect", { aspect: formatAspect(aspect ?? 1) }) };
    }
    return null;
  };

  return (
    <SgFileUpload
      {...rest}
      id={id}
      maxFiles={maxFiles}
      keyPrefix="sg-image"
      mediaType={["image"]}
      typeNames={(accept ?? "").trim() ? (accept ?? "").trim() : "image"}
      dropTextKey="components.inputs.imageupload.drop"
      dropManyTextKey="components.inputs.imageupload.dropMany"
      pickerAccept={(accept ?? "").trim() ? (accept ?? "").trim() : "image/*"}
      extraCheck={check}
      renderThumbnail={(file, size) => <Thumbnail file={file} id={id} side={size} />}
      thumbnailSize={side}
    />
  );
}
