"use client";

import React from "react";
import { Camera, RefreshCw, SwitchCamera } from "lucide-react";
import { t, useComponentsI18n } from "../i18n";
import {
  classifyCameraError,
  guideBox,
  nextFacing,
  resolutionSize,
  type CameraErrorCode,
  type CameraFacing,
  type CameraGuide,
  type CameraResolution
} from "./cameraLogic";

export type SgCameraCaptureProps = {
  id: string;
  label?: string;
  labelText?: string;
  /** Camera inicial: `user` (frontal) ou `environment` (traseira). Padrao `user`. */
  facing?: CameraFacing;
  /** Guia de enquadramento sobre a pre-visualizacao: `none` (padrao), `oval` ou `rect`. */
  guide?: CameraGuide;
  /** Resolucao pedida: `low` (640x480), `medium` (1280x720, padrao) ou `high` (1920x1080). */
  resolution?: CameraResolution;
  /** Disparado ao capturar, com a imagem JPEG. O envio ao servidor e do host. */
  onCapture?: (image: Blob) => void;
  /** Disparado quando a camera nao abre: `permission`, `noCamera` ou `failed`. `message` ja vem traduzida. */
  onError?: (code: CameraErrorCode, message: string) => void;
  /** Mostra o botao de alternar entre frontal e traseira (padrao `true`). */
  allowSwitch?: boolean;
  /** Altura da pre-visualizacao em px (padrao 320). */
  previewHeight?: number;
  hintText?: string;
  disabled?: boolean;
  className?: string;
};

type Status = "starting" | "ready" | CameraErrorCode;

export function SgCameraCapture(props: SgCameraCaptureProps) {
  const i18n = useComponentsI18n();
  const {
    id,
    label,
    labelText,
    facing: initialFacing = "user",
    guide = "none",
    resolution = "medium",
    onCapture,
    onError,
    allowSwitch = true,
    previewHeight = 320,
    hintText,
    disabled,
    className
  } = props;
  const [facing, setFacing] = React.useState<CameraFacing>(initialFacing);
  const [status, setStatus] = React.useState<Status>("starting");
  const [attempt, setAttempt] = React.useState(0);
  const [box, setBox] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const onErrorRef = React.useRef(onError);
  onErrorRef.current = onError;
  // `useComponentsI18n()` devolve um objeto NOVO a cada render quando ha i18n em tempo de execucao: como dependencia do
  // efeito de abrir a camera, ela fechava e reabria a cada render (a camera "piscava"). Por isso vai por referencia.
  const i18nRef = React.useRef(i18n);
  i18nRef.current = i18n;
  const text = label ?? labelText ?? "";

  React.useEffect(() => setFacing(initialFacing), [initialFacing]);

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Abre a camera e libera a trilha ao trocar de camera/resolucao ou desmontar.
  React.useEffect(() => {
    if (disabled) return undefined;
    let cancelled = false;
    let stream: MediaStream | null = null;
    setStatus("starting");
    const fail = (name: string) => {
      if (cancelled) return;
      const code = classifyCameraError(name);
      setStatus(code);
      onErrorRef.current?.(code, t(i18nRef.current, `components.inputs.camera.${code}`));
    };
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      fail("NotFoundError");
      return undefined;
    }
    const size = resolutionSize(resolution);
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: { ideal: facing }, width: { ideal: size.width }, height: { ideal: size.height } }
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = s;
        const video = videoRef.current;
        if (video) {
          video.srcObject = s;
          void video.play?.().catch(() => undefined);
        }
        setStatus("ready");
      })
      .catch((error: unknown) => fail(error instanceof Error ? error.name : String(error)));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [disabled, facing, resolution, attempt]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || status !== "ready") return;
    const width = video.videoWidth || resolutionSize(resolution).width;
    const height = video.videoHeight || resolutionSize(resolution).height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (blob) onCapture?.(blob);
    }, "image/jpeg", 0.92);
  };

  const g = guideBox(guide, box.w, box.h);
  const failed = status === "permission" || status === "noCamera" || status === "failed";

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      {text ? <p className="mb-1 text-xs font-medium text-foreground/70">{text}</p> : null}
      <div
        ref={frameRef}
        id={id}
        role="group"
        aria-label={text || t(i18n, "components.inputs.camera.capture")}
        style={{ height: previewHeight }}
        className="relative w-full overflow-hidden rounded-md border border-border bg-black"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          className={["h-full w-full object-cover", facing === "user" ? "-scale-x-100" : "", status === "ready" ? "" : "invisible"].join(" ")}
        />
        {status === "ready" && g ? (
          <div
            data-guide={guide}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: g.x,
              top: g.y,
              width: g.width,
              height: g.height,
              borderRadius: guide === "oval" ? "50%" : 8,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
              border: "2px solid rgba(255,255,255,0.85)",
              pointerEvents: "none"
            }}
          />
        ) : null}
        {status === "starting" && !disabled ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
            {t(i18n, "components.inputs.camera.starting")}
          </div>
        ) : null}
        {failed ? (
          <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-sm text-white">
            <span>{t(i18n, `components.inputs.camera.${status}`)}</span>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="inline-flex items-center gap-1 rounded border border-white/60 px-2 py-1 text-xs hover:bg-white/10"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              {t(i18n, "components.inputs.camera.retry")}
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={capture}
          disabled={disabled || status !== "ready"}
          aria-label={t(i18n, "components.inputs.camera.capture")}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-[hsl(var(--primary))] px-3 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera className="size-4" aria-hidden="true" />
          {t(i18n, "components.inputs.camera.capture")}
        </button>
        {allowSwitch ? (
          <button
            type="button"
            onClick={() => setFacing((f) => nextFacing(f))}
            disabled={disabled}
            aria-label={t(i18n, "components.inputs.camera.switch")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SwitchCamera className="size-4" aria-hidden="true" />
            {t(i18n, "components.inputs.camera.switch")}
          </button>
        ) : null}
      </div>
      {hintText ? <p className="mt-1 text-xs text-muted-foreground">{hintText}</p> : null}
    </div>
  );
}
