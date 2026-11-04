// Logica pura do SgCameraCapture (P134): resolucao, guia de enquadramento, classificacao de erro e troca de camera.
// Sem DOM: os vetores de paridade com o Flutter (`seedgrid_components/test/widgets/camera_vectors`) sao gerados
// DESTE modulo. O contrato das props e o mesmo nas duas plataformas.

export type CameraFacing = "user" | "environment";
export type CameraGuide = "none" | "oval" | "rect";
export type CameraResolution = "low" | "medium" | "high";
export type CameraErrorCode = "permission" | "noCamera" | "failed";

export type GuideBox = { x: number; y: number; width: number; height: number };

/** Resolucao pedida ao dispositivo (largura x altura, paisagem). */
export function resolutionSize(resolution: CameraResolution): { width: number; height: number } {
  switch (resolution) {
    case "low":
      return { width: 640, height: 480 };
    case "high":
      return { width: 1920, height: 1080 };
    default:
      return { width: 1280, height: 720 };
  }
}

/**
 * Caixa do guia de enquadramento, centralizada na area de pre-visualizacao `viewW` x `viewH` (px).
 * `oval`: elipse em pe (largura/altura = 3/4), ate 70% da largura e 70% da altura.
 * `rect`: retangulo deitado (largura/altura = 4/3), ate 90% da largura e 70% da altura.
 * `none` => null. Valores arredondados ao pixel.
 */
export function guideBox(guide: CameraGuide, viewW: number, viewH: number): GuideBox | null {
  if (guide === "none" || viewW <= 0 || viewH <= 0) return null;
  const ratio = guide === "oval" ? 3 / 4 : 4 / 3;
  const maxW = viewW * (guide === "oval" ? 0.7 : 0.9);
  const maxH = viewH * 0.7;
  const width = Math.min(maxW, maxH * ratio);
  const height = width / ratio;
  return {
    x: Math.round((viewW - width) / 2),
    y: Math.round((viewH - height) / 2),
    width: Math.round(width),
    height: Math.round(height)
  };
}

const PERMISSION_NAMES = new Set([
  "notallowederror",
  "permissiondeniederror",
  "securityerror",
  "cameraaccessdenied",
  "cameraaccessdeniedwithoutprompt",
  "cameraaccessrestricted"
]);
const NO_CAMERA_NAMES = new Set(["notfounderror", "devicesnotfounderror", "nocamera", "notreadableerror_nocamera"]);

/** Nome do erro da plataforma (`NotAllowedError`, `CameraAccessDenied`...) => codigo do componente. */
export function classifyCameraError(name: string): CameraErrorCode {
  const key = name.trim().toLowerCase();
  if (PERMISSION_NAMES.has(key)) return "permission";
  if (NO_CAMERA_NAMES.has(key)) return "noCamera";
  return "failed";
}

/** Alterna entre frontal (`user`) e traseira (`environment`). */
export function nextFacing(facing: CameraFacing): CameraFacing {
  return facing === "user" ? "environment" : "user";
}
