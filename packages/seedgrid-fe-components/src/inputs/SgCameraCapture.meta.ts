import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.camera-capture",
  package: "@seedgrid/fe-components",
  exportName: "SgCameraCapture",
  slug: "sg-camera-capture",
  displayName: "SgCameraCapture",
  category: "input",
  subcategory: "camera",
  description:
    "Pre-visualizacao da camera com guia de enquadramento (oval ou retangulo), alternancia entre frontal e traseira e captura que devolve a imagem ao pai. Mostra os estados sem permissao e sem camera. Nao envia nada ao servidor.",
  tags: ["camera", "photo", "capture", "selfie", "getUserMedia", "input"],
  capabilities: ["camera", "preview", "guide-overlay", "switch-camera", "capture"],
  fieldSemantics: ["photo", "selfie", "picture", "documentPhoto", "avatar"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido acima da pre-visualizacao.", semanticRole: "label", bindable: true },
    { name: "facing", type: '"user" | "environment"', default: "user", description: "Camera inicial: frontal (user) ou traseira (environment).", semanticRole: "appearance", bindable: true },
    { name: "guide", type: '"none" | "oval" | "rect"', default: "none", description: "Guia de enquadramento sobre a pre-visualizacao.", semanticRole: "appearance", bindable: true },
    { name: "resolution", type: '"low" | "medium" | "high"', default: "medium", description: "Resolucao pedida (640x480, 1280x720, 1920x1080).", semanticRole: "appearance", bindable: true },
    { name: "allowSwitch", type: "boolean", default: true, description: "Mostra o botao de alternar entre frontal e traseira.", semanticRole: "appearance", bindable: true },
    { name: "previewHeight", type: "number", default: 320, description: "Altura da pre-visualizacao em px.", semanticRole: "appearance", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Nao abre a camera nem permite capturar.", semanticRole: "appearance", bindable: true },
    { name: "onCapture", type: "(image: Blob) => void", description: "Imagem JPEG capturada.", semanticRole: "event", bindable: false },
    { name: "onError", type: "(code, message) => void", description: "Camera indisponivel (permission, noCamera, failed).", semanticRole: "event", bindable: false }
  ],
  states: ["default", "starting", "ready", "permission", "noCamera", "failed", "disabled"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-camera-capture/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-camera-capture/sg-camera-capture.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: { route: "/components/sg-camera-capture", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "field.camera", acceptsDataBinding: false, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Tirar foto na hora (selfie, foto de documento, portaria) com guia de enquadramento.",
    "Fluxos que precisam da camera do dispositivo e de tratamento de permissao negada.",
    "Capturar uma imagem para entregar ao host enviar."
  ],
  avoidUseCases: [
    "Escolher uma imagem ja existente; para isso use SgImageUpload.",
    "Gravar video ou audio; o componente captura apenas fotos.",
    "Analise de qualidade ou reconhecimento facial; isso e do host."
  ],
  synonyms: ["camera", "tirar foto", "captura de foto", "selfie", "webcam", "take photo"],
  relatedEntityFields: ["photo", "selfie", "documentPhoto", "avatar", "picture"],
  compositionHints: [
    "Combine com SgImageUpload: camera para tirar na hora, upload para escolher da galeria.",
    "Envie o Blob recebido em onCapture pelo servico de arquivos do host."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.3 }
};
