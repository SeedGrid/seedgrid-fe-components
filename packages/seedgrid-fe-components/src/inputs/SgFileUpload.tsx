"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { File as FileIcon, FileArchive, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo, Presentation, Upload, X } from "lucide-react";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import {
  MEDIA_TYPES,
  formatFileSize,
  matchesMedia,
  parseSize,
  planAdd,
  resolveMime,
  type FileErrorCode,
  type MediaType,
  type SizeLimit
} from "./fileUploadLogic";

/** Arquivo ja salvo no servidor (sem bytes): entra na lista como valor inicial ou controlado. */
export type SgSavedFile = { name: string; url: string; size?: number; type?: string };

/** Item da lista de arquivos: um `File` escolhido agora ou um arquivo ja salvo (`url`). */
export type SgFileValue = File | SgSavedFile;

/** Recusa de um arquivo por uma regra de quem usa o componente (ex.: dimensao de imagem). */
export type SgFileRejection = { code: FileErrorCode; message: string };

export type SgFileUploadProps = RhfFieldProps & {
  id: string;
  label?: string;
  labelText?: string;
  /** Arquivos controlados (sempre lista; um arquivo = lista de um). */
  value?: SgFileValue[] | null;
  /** Arquivos iniciais (campo nao controlado). */
  defaultValue?: SgFileValue[];
  /** Lista de arquivos validos apos escolher ou remover. O envio ao servidor e do host. */
  onChange?: (files: SgFileValue[]) => void;
  /** Arquivo recusado: codigo, mensagem ja traduzida e nome do arquivo. Os demais seguem validos. */
  onError?: (code: FileErrorCode, message: string, fileName: string) => void;
  /** Tipos aceitos (`image`, `pdf`, `xlsx`...). O tipo e conferido pelo conteudo do arquivo. */
  mediaType?: MediaType[];
  /** Tipos extras em texto livre (`.pdf`, `image/png`, `image/*`), separados por virgula; soma-se ao mediaType. */
  accept?: string;
  /** Quantos arquivos o campo guarda (padrao 1). Com 1, escolher outro substitui; maior que 1 liga a selecao multipla. */
  maxFiles?: number;
  /** Tamanho maximo de cada arquivo: bytes (numero) ou texto com unidade ("500KB", "1.5MB", "1GB"). */
  maxSizePerFile?: SizeLimit;
  /** Tamanho maximo da soma dos arquivos (mesmo formato). */
  maxSizeTotal?: SizeLimit;
  hintText?: string;
  required?: boolean;
  requiredMessage?: string;
  enabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onEnter?: () => void;
  onExit?: () => void;
  /** Regra extra, assincrona, por arquivo (depois da conferencia de tipo). E como o SgImageUpload confere dimensao. */
  extraCheck?: (file: File, info: { mime: string }) => Promise<SgFileRejection | null>;
  /** Miniatura de cada arquivo (sem ela, a lista usa o icone do tipo). */
  thumbnailBuilder?: (file: SgFileValue, size: number) => React.ReactNode;
  /** Lado da miniatura em px (padrao 96). */
  thumbnailSize?: number;
  /** Chaves de i18n do texto da area vazia (um arquivo / varios). */
  dropTextKey?: string;
  dropManyTextKey?: string;
  /** Texto dos tipos aceitos na mensagem de tipo recusado (padrao: mediaType/accept). */
  typeNames?: string;
  /** Valor do atributo `accept` do seletor do navegador (padrao: derivado de mediaType/accept). */
  pickerAccept?: string;
  /** Prefixo do `data-sg` dos elementos internos (`sg-file`, `sg-image`). */
  keyPrefix?: string;
};

const HEAD_BYTES = 256;

function isNative(file: SgFileValue): file is File {
  return typeof File !== "undefined" && file instanceof File;
}

function sizeOf(file: SgFileValue): number {
  return isNative(file) ? file.size : file.size ?? 0;
}

function typeOf(file: SgFileValue): string {
  return file.type ?? "";
}

async function readHead(file: File): Promise<Uint8Array> {
  try {
    const slice = file.slice(0, HEAD_BYTES);
    if (typeof slice.arrayBuffer === "function") return new Uint8Array(await slice.arrayBuffer());
    // Ambientes sem Blob.arrayBuffer (testes em jsdom, navegadores antigos).
    return await new Promise<Uint8Array>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => resolve(new Uint8Array(0));
      reader.readAsArrayBuffer(slice);
    });
  } catch {
    return new Uint8Array(0);
  }
}

/** Atributo `accept` do seletor: grupos viram `image/*`, formatos viram MIME + extensoes; `all` libera tudo. */
export function pickerAcceptFor(mediaType?: MediaType[], accept?: string): string | undefined {
  const tokens = new Set<string>();
  for (const m of mediaType ?? []) {
    if (m === "all") return undefined;
    const info = MEDIA_TYPES[m];
    if (!info) continue;
    if (info.group) tokens.add(`${info.group}*`);
    if (info.mime) tokens.add(info.mime);
    for (const ext of info.extensions) tokens.add(`.${ext}`);
  }
  for (const token of (accept ?? "").split(",")) {
    const trimmed = token.trim();
    if (trimmed) tokens.add(trimmed);
  }
  return tokens.size === 0 ? undefined : Array.from(tokens).join(",");
}

function iconFor(mime: string): React.ReactNode {
  const cls = "size-5 shrink-0";
  if (mime.startsWith("image/")) return <FileImage className={cls} aria-hidden="true" />;
  if (mime.startsWith("video/")) return <FileVideo className={cls} aria-hidden="true" />;
  if (mime.startsWith("audio/")) return <FileAudio className={cls} aria-hidden="true" />;
  if (mime === "application/pdf") return <FileText className={cls} aria-hidden="true" />;
  if (mime.includes("spreadsheet") || mime === "application/vnd.ms-excel" || mime === "text/csv") {
    return <FileSpreadsheet className={cls} aria-hidden="true" />;
  }
  if (mime.includes("presentation") || mime === "application/vnd.ms-powerpoint") {
    return <Presentation className={cls} aria-hidden="true" />;
  }
  if (mime.includes("zip")) return <FileArchive className={cls} aria-hidden="true" />;
  if (mime.startsWith("text/") || mime.includes("word") || mime === "application/msword") {
    return <FileText className={cls} aria-hidden="true" />;
  }
  return <FileIcon className={cls} aria-hidden="true" />;
}

function SgFileUploadBase(props: SgFileUploadProps) {
  const i18n = useComponentsI18n();
  const {
    id,
    label,
    labelText,
    value,
    defaultValue,
    onChange,
    onError,
    mediaType,
    accept,
    maxFiles,
    maxSizePerFile,
    maxSizeTotal,
    hintText,
    required,
    enabled = true,
    readOnly,
    className,
    onEnter,
    onExit,
    extraCheck,
    thumbnailBuilder,
    thumbnailSize = 96,
    dropTextKey,
    dropManyTextKey,
    typeNames,
    pickerAccept,
    keyPrefix = "sg-file",
    error
  } = props;
  const max = Math.max(1, Math.floor(maxFiles ?? 1));
  const multi = max > 1;
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState<SgFileValue[]>(defaultValue ?? []);
  const current: SgFileValue[] = controlled ? value ?? [] : inner;
  const currentRef = React.useRef(current);
  currentRef.current = current;
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const locked = Boolean(!enabled || readOnly);
  const text = label ?? labelText ?? "";

  const typesText = () => {
    if (typeNames) return typeNames;
    const names = [...(mediaType ?? []), ...((accept ?? "").trim() ? [(accept ?? "").trim()] : [])];
    return names.length === 0 ? "all" : names.join(", ");
  };

  const messageFor = (code: FileErrorCode): string => {
    switch (code) {
      case "type":
        return t(i18n, "components.inputs.fileupload.type", { types: typesText() });
      case "size":
        return t(i18n, "components.inputs.fileupload.size", { max: formatFileSize(parseSize(maxSizePerFile) ?? 0, i18n.locale) });
      case "total":
        return t(i18n, "components.inputs.fileupload.total", { max: formatFileSize(parseSize(maxSizeTotal) ?? 0, i18n.locale) });
      case "count":
        return t(i18n, "components.inputs.fileupload.count", { max: String(max) });
      default:
        return ""; // dimension e aspect so chegam por extraCheck, que traz a propria mensagem.
    }
  };

  const commit = (files: SgFileValue[], errorText: string | null = null) => {
    setInternalError(errorText);
    if (!controlled) setInner(files);
    onChange?.(files);
  };

  const addFiles = async (picked: File[]) => {
    const rejected: Array<{ file: File; code: FileErrorCode; message: string }> = [];
    const survivors: Array<{ file: File; head: Uint8Array }> = [];
    if (extraCheck) setLoading(true);
    for (const file of picked) {
      const head = await readHead(file);
      const mime = resolveMime(file.name, file.type, head);
      if (matchesMedia(file.name, mime, mediaType, accept) && extraCheck) {
        const rejection = await extraCheck(file, { mime });
        if (rejection) {
          rejected.push({ file, code: rejection.code, message: rejection.message });
          continue;
        }
      }
      survivors.push({ file, head });
    }
    if (extraCheck) setLoading(false);
    const existing = currentRef.current;
    const plan = planAdd(
      existing.map(sizeOf),
      survivors.map(({ file, head }) => ({ name: file.name, type: file.type, size: file.size, head })),
      { mediaType, accept, maxFiles: max, maxSizePerFile, maxSizeTotal }
    );
    for (const r of plan.rejected) {
      const survivor = survivors[r.index];
      if (survivor) rejected.push({ file: survivor.file, code: r.code, message: messageFor(r.code) });
    }
    const lines = rejected.map((r) => t(i18n, "components.inputs.fileupload.file", { name: r.file.name, message: r.message }));
    const errorText = lines.length === 0 ? null : lines.join("\n");
    for (const r of rejected) onError?.(r.code, r.message, r.file.name);
    if (plan.accepted.length === 0) {
      setInternalError(errorText);
      return;
    }
    const added = plan.accepted.map((index) => survivors[index]?.file).filter((f): f is File => Boolean(f));
    commit(plan.replace ? added : [...existing, ...added], errorText);
  };

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = ""; // permite escolher o mesmo arquivo de novo
    if (files.length > 0) void addFiles(files);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (locked) return;
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) void addFiles(multi ? files : files.slice(0, 1));
  };

  const open = () => {
    if (locked || loading) return;
    onEnter?.();
    inputRef.current?.click();
  };

  const remove = (index: number) => {
    commit(current.filter((_, i) => i !== index));
  };

  const shownError = resolveFieldError(error, internalError ?? undefined);
  const hasError = Boolean(shownError);
  const full = current.length >= max;
  // Um arquivo so: a area some quando ha arquivo (tocar em "Trocar" escolhe outro). Varios: itens + area enquanto couber.
  const showZone = multi ? !full : current.length === 0;
  const dropText = multi
    ? t(i18n, dropManyTextKey ?? "components.inputs.fileupload.dropMany", { max: String(max) })
    : t(i18n, dropTextKey ?? "components.inputs.fileupload.drop");
  const removeLabel = t(i18n, "components.inputs.fileupload.remove");
  const acceptAttr = pickerAccept ?? pickerAcceptFor(mediaType, accept);

  const renderItem = (file: SgFileValue, index: number) => {
    const sizeText = formatFileSize(sizeOf(file), i18n.locale);
    const removeButton = locked ? null : (
      <button
        type="button"
        onClick={() => remove(index)}
        aria-label={removeLabel}
        data-sg={`${keyPrefix}-remove-${id}-${index}`}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-muted/60"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    );
    if (thumbnailBuilder) {
      return (
        <div key={`${file.name}-${index}`} data-sg={`${keyPrefix}-item-${id}-${index}`} style={{ width: thumbnailSize }}>
          <div className="relative overflow-hidden rounded-md" style={{ width: thumbnailSize, height: thumbnailSize }}>
            {thumbnailBuilder(file, thumbnailSize)}
            {removeButton ? <span className="absolute right-0 top-0 rounded-full bg-background/85">{removeButton}</span> : null}
          </div>
          <div className="mt-1 truncate text-xs">{file.name}</div>
          <div className="text-[10px] text-muted-foreground">{sizeText}</div>
        </div>
      );
    }
    const mime = resolveMime(file.name, typeOf(file), new Uint8Array(0));
    return (
      <div
        key={`${file.name}-${index}`}
        data-sg={`${keyPrefix}-item-${id}-${index}`}
        className="flex items-center gap-2 rounded-md border border-border px-2 py-1"
      >
        {iconFor(mime)}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm">{file.name}</div>
          <div className="text-[10px] text-muted-foreground">{sizeText}</div>
        </div>
        {removeButton}
      </div>
    );
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
        multiple={multi}
        accept={acceptAttr}
        className="sr-only"
        disabled={locked}
        required={required && current.length === 0}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : hintText ? `${id}-hint` : undefined}
        onChange={onPick}
        onFocus={() => onEnter?.()}
        onBlur={() => onExit?.()}
      />
      {current.length > 0 ? (
        <div
          className={["mb-2", thumbnailBuilder ? "flex flex-wrap gap-2" : "flex flex-col gap-1.5"].join(" ")}
          data-sg={`${keyPrefix}-list-${id}`}
        >
          {current.map(renderItem)}
        </div>
      ) : null}
      {showZone || loading ? (
        <div
          role="button"
          tabIndex={locked ? -1 : 0}
          aria-disabled={locked || undefined}
          aria-label={text || dropText}
          data-sg={`${keyPrefix}-open-${id}`}
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
          className={[
            "relative flex min-h-24 w-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-[var(--sg-input-bg,hsl(var(--background)))] text-sm shadow-sm outline-none transition-colors",
            hasError ? "border-[hsl(var(--destructive))]" : dragging ? "border-[hsl(var(--primary))] bg-muted/40" : "border-border",
            locked ? "cursor-not-allowed opacity-60" : "cursor-pointer focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.4)]"
          ].join(" ")}
        >
          {loading ? (
            <span className="text-muted-foreground">{t(i18n, "components.inputs.fileupload.loading")}</span>
          ) : (
            <span className="flex flex-col items-center gap-2 px-4 py-4 text-center text-muted-foreground">
              <Upload className="size-6" aria-hidden="true" />
              {dropText}
            </span>
          )}
        </div>
      ) : null}
      {!multi && current.length > 0 && !locked && !loading ? (
        <button
          type="button"
          onClick={open}
          data-sg={`${keyPrefix}-change-${id}`}
          className="mt-1 inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-primary hover:bg-muted/40"
        >
          {t(i18n, "components.inputs.imageupload.change")}
        </button>
      ) : null}
      {hasError ? (
        <p id={`${id}-error`} role="alert" className="mt-1 whitespace-pre-line text-xs text-[hsl(var(--destructive))]">
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

export function SgFileUpload(props: SgFileUploadProps) {
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
          <SgFileUploadBase
            {...props}
            control={undefined}
            value={Array.isArray(field.value) ? (field.value as SgFileValue[]) : []}
            onChange={(files) => {
              // Lista vazia vira null no formulario, para o "obrigatorio" acusar o campo sem arquivo.
              field.onChange(files.length === 0 ? null : files);
              onChange?.(files);
            }}
            error={resolveFieldError(error, fieldState.error?.message)}
          />
        )}
      />
    );
  }
  return <SgFileUploadBase {...props} />;
}
