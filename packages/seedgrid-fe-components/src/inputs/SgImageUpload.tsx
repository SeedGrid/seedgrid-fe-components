"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { ImagePlus, Trash2 } from "lucide-react";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import {
  DEFAULT_ACCEPT,
  formatAspect,
  formatBytes,
  validateImage,
  type ImageErrorCode
} from "./imageUploadLogic";

export type SgImageUploadProps = RhfFieldProps & {
  id: string;
  label?: string;
  labelText?: string;
  /** Imagem controlada: `File` escolhido, URL (`string`) de uma imagem ja salva, ou `null`. */
  value?: File | string | null;
  /** Imagem inicial (campo nao controlado). */
  defaultValue?: File | string | null;
  /** Disparado ao escolher (arquivo valido) ou remover (`null`). O envio ao servidor e do host. */
  onChange?: (file: File | null) => void;
  /** Disparado quando o arquivo escolhido e recusado. `message` ja vem traduzida. */
  onError?: (code: ImageErrorCode, message: string) => void;
  /** Tipos aceitos: `image/*` (padrao), `image/png`, `.png`, separados por virgula. */
  accept?: string;
  /** Tamanho maximo em bytes. */
  maxSizeBytes?: number;
  /** Largura minima em px. */
  minWidth?: number;
  /** Altura minima em px. */
  minHeight?: number;
  /** Proporcao largura/altura exigida (1 = quadrada, 16 / 9). */
  aspect?: number;
  /** Altura da area de pre-visualizacao em px (padrao 160). */
  previewHeight?: number;
  hintText?: string;
  required?: boolean;
  requiredMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onEnter?: () => void;
  onExit?: () => void;
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

function SgImageUploadBase(props: SgImageUploadProps) {
  const i18n = useComponentsI18n();
  const {
    id,
    label,
    labelText,
    value,
    defaultValue,
    onChange,
    onError,
    accept = DEFAULT_ACCEPT,
    maxSizeBytes,
    minWidth,
    minHeight,
    aspect,
    previewHeight = 160,
    hintText,
    required,
    requiredMessage,
    disabled,
    readOnly,
    className,
    onEnter,
    onExit,
    error
  } = props;
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<File | string | null>(defaultValue ?? null);
  const current = controlled ? value : inner;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const locked = Boolean(disabled || readOnly);
  const text = label ?? labelText ?? "";

  // Pre-visualizacao: URL de objeto para File (liberada ao trocar/desmontar); string e usada como esta.
  React.useEffect(() => {
    if (current instanceof File) {
      const url = URL.createObjectURL(current);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(typeof current === "string" && current ? current : null);
    return undefined;
  }, [current]);

  const messageFor = React.useCallback(
    (code: ImageErrorCode) => {
      switch (code) {
        case "type":
          return t(i18n, "components.inputs.imageupload.type", { accept });
        case "size":
          return t(i18n, "components.inputs.imageupload.size", { max: formatBytes(maxSizeBytes ?? 0, i18n.locale) });
        case "dimension":
          return t(i18n, "components.inputs.imageupload.dimension", {
            minWidth: String(minWidth ?? 0),
            minHeight: String(minHeight ?? 0)
          });
        default:
          return t(i18n, "components.inputs.imageupload.aspect", { aspect: formatAspect(aspect ?? 1) });
      }
    },
    [accept, aspect, i18n, maxSizeBytes, minHeight, minWidth]
  );

  const commit = (file: File | null) => {
    setInternalError(null);
    if (!controlled) setInner(file);
    onChange?.(file);
  };

  const handleFile = async (file: File) => {
    const needsDimensions = minWidth !== undefined || minHeight !== undefined || aspect !== undefined;
    let dims: { width: number; height: number } | null = null;
    if (needsDimensions) {
      setLoading(true);
      dims = await readDimensions(file);
      setLoading(false);
    }
    const code = validateImage(
      { name: file.name, type: file.type, size: file.size, width: dims?.width, height: dims?.height },
      { accept, maxSizeBytes, minWidth, minHeight, aspect }
    );
    if (code) {
      const message = messageFor(code);
      setInternalError(message);
      onError?.(code, message);
      return;
    }
    commit(file);
  };

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = ""; // permite escolher o mesmo arquivo de novo
    if (file) void handleFile(file);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (locked) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const shownError = resolveFieldError(error, internalError ?? undefined);
  const hasError = Boolean(shownError);
  const fileName = current instanceof File ? current.name : null;
  const sizeText = current instanceof File ? formatBytes(current.size, i18n.locale) : null;
  const open = () => {
    if (!locked) inputRef.current?.click();
  };

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      {text ? (
        <label htmlFor={id} className="mb-1 block text-xs font-medium text-foreground/70">
          {text}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={locked}
        required={required && !current}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : hintText ? `${id}-hint` : undefined}
        onChange={onPick}
        onFocus={() => onEnter?.()}
        onBlur={() => onExit?.()}
      />
      <div
        role="button"
        tabIndex={locked ? -1 : 0}
        aria-disabled={locked || undefined}
        aria-label={text || t(i18n, "components.inputs.imageupload.drop")}
        data-dragging={dragging || undefined}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!locked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{ minHeight: previewHeight }}
        className={[
          "relative flex w-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-[var(--sg-input-bg,hsl(var(--background)))] text-sm shadow-sm outline-none transition-colors",
          hasError ? "border-[hsl(var(--destructive))]" : dragging ? "border-[hsl(var(--primary))] bg-muted/40" : "border-border",
          locked ? "cursor-not-allowed opacity-60" : "cursor-pointer focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.4)]"
        ].join(" ")}
      >
        {loading ? (
          <span className="text-muted-foreground">{t(i18n, "components.inputs.imageupload.loading")}</span>
        ) : previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={fileName ?? text}
            style={{ maxHeight: previewHeight }}
            className="max-w-full object-contain"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 py-6 text-center text-muted-foreground">
            <ImagePlus className="size-6" aria-hidden="true" />
            {t(i18n, "components.inputs.imageupload.drop")}
          </span>
        )}
      </div>
      {current && !loading ? (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{fileName ? `${fileName} (${sizeText})` : ""}</span>
          {!locked ? (
            <button
              type="button"
              onClick={() => commit(null)}
              aria-label={t(i18n, "components.inputs.imageupload.remove")}
              className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 hover:bg-muted/40"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              {t(i18n, "components.inputs.imageupload.remove")}
            </button>
          ) : null}
        </div>
      ) : null}
      {hasError ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-[hsl(var(--destructive))]">
          {shownError}
        </p>
      ) : hintText ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hintText}
        </p>
      ) : null}
    </div>
  );
}

export function SgImageUpload(props: SgImageUploadProps) {
  const { control, name, rules, required, requiredMessage, onChange, error } = props;
  const i18n = useComponentsI18n();
  if (control && name) {
    const resolvedRules = {
      ...(required ? { required: requiredMessage ?? t(i18n, "components.inputs.required") } : {}),
      ...rules
    };
    return (
      <Controller
        name={name}
        control={control}
        rules={resolvedRules}
        render={({ field, fieldState }) => (
          <SgImageUploadBase
            {...props}
            control={undefined}
            value={(field.value as File | string | null | undefined) ?? null}
            onChange={(file) => {
              field.onChange(file);
              onChange?.(file);
            }}
            error={resolveFieldError(error, fieldState.error?.message)}
          />
        )}
      />
    );
  }
  return <SgImageUploadBase {...props} />;
}
