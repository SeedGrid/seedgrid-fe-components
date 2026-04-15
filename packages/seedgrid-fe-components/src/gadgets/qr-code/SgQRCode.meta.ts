import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.qr-code",
  package: "@seedgrid/fe-components",
  exportName: "SgQRCode",
  slug: "sg-qr-code",
  displayName: "SgQRCode",
  category: "gadget",
  subcategory: "qr-code",
  description:
    "Gerador visual de QR Code com configuracao de valor, logo central, tamanho, margem e cores.",
  tags: ["gadget", "qr-code", "barcode", "pix", "share"],
  capabilities: ["qr-generation", "logo-overlay", "size-control", "color-customization", "empty-fallback"],
  fieldSemantics: ["qrCode", "shareCode", "pixCode", "encodedLink", "machineReadableCode"],
  props: [
    { name: "value", type: "string", required: true, description: "Valor textual codificado no QR Code.", semanticRole: "value", bindable: true },
    { name: "size", type: "number", default: 220, description: "Tamanho do QR em pixels.", semanticRole: "appearance", bindable: true },
    { name: "logoSrc", type: "string", description: "URL da logo exibida no centro do QR.", semanticRole: "appearance", bindable: true },
    { name: "fgColor", type: "string", default: "#000000", description: "Cor principal do QR Code.", semanticRole: "appearance", bindable: true },
    { name: "bgColor", type: "string", default: "#FFFFFF", description: "Cor de fundo do QR Code.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "empty", "rendered"],
  examples: [
    { id: "interactive", title: "Interativo", file: "apps/showcase/src/app/components/gadgets/sg-qr-code/samples/interativo.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-qr-code/sg-qr-code.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-qr-code", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.qr-code", acceptsDataBinding: true, defaultProps: { size: 220, fgColor: "#000000", bgColor: "#FFFFFF" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir links, payloads PIX e codigos escaneaveis em telas e comprovantes.",
    "Compartilhar acesso rapido a URLs, apps e recursos externos.",
    "Representar codigos maquina-legiveis em cards, dialogos e comprovantes."
  ],
  avoidUseCases: [
    "Entrada de texto ou edicao de dados.",
    "Valores numericos simples sem necessidade de codificacao visual.",
    "Blocos de conteudo textual longo."
  ],
  synonyms: ["qr code", "code generator", "pix qr", "scan code"],
  relatedEntityFields: ["qrCode", "pixPayload", "shareUrl", "encodedValue", "paymentCode"],
  compositionHints: [
    "Usar com SgCard, SgDialog e SgPanel para areas de compartilhamento ou pagamento.",
    "Combinar com SgBadge e SgButton para acoes de copiar e compartilhar."
  ],
  rankingSignals: { freeText: 0.08, structuredChoice: 0, date: 0, number: 0.1, denseLayout: 0.42 }
};
