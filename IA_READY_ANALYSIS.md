# IA-Ready Analysis for SeedGrid

## 1. Executive Summary

O projeto ja tem uma base muito favoravel para evoluir para um modelo IA-ready:

- o monorepo separa `fe-components`, `fe-playground` e `apps/showcase`
- o showcase ja funciona como catalogo navegavel por componente
- os exemplos ja estao externalizados em arquivos `.sample` e `.playground`
- existe um `manifest.ts`, mas hoje ele atende o registro de modulo/i18n, nao a semantica dos componentes

O principal gap atual nao e falta de exemplos. E falta de uma camada formal de semantica reutilizavel por:

- showcase
- tooling
- agentes de IA
- build pipeline
- SDUI

Recomendacao central: **nao embutir inteligencia diretamente no JSX das paginas do showcase nem espalhar metadata dentro de todos os componentes agora**. O caminho de menor risco e:

1. definir `sgMeta` e `aiHints` v0
2. aplicar primeiro em 3 a 5 componentes piloto
3. gerar um manifesto JSON consolidado no build
4. fazer o showcase consumir esse manifesto em pontos especificos
5. depois conectar isso ao registry/SDUI

---

## 2. Estado Atual do Codigo

### 2.1 Estrutura atual

Monorepo identificado:

- `apps/showcase`
- `packages/seedgrid-fe-components`
- `packages/seedgrid-fe-playground`

Arquivos-chave observados:

- `apps/showcase/src/app/ShowcaseShell.tsx`
- `apps/showcase/src/app/page.tsx`
- `apps/showcase/src/app/components/**/page.tsx`
- `apps/showcase/src/app/components/**/samples/*.sample`
- `apps/showcase/src/app/components/**/*.playground`
- `apps/showcase/src/app/components/ShowcasePropsReference.tsx`
- `apps/showcase/src/app/components/ShowcaseStickyHeader.tsx`
- `apps/showcase/src/app/components/useShowcaseAnchors.ts`
- `apps/showcase/scripts/validate-showcase-snippets.mjs`
- `packages/seedgrid-fe-components/src/index.ts`
- `packages/seedgrid-fe-components/src/manifest.ts`
- `packages/seedgrid-fe-components/src/integration/module.ts`

### 2.2 Como o showcase esta estruturado hoje

O showcase segue um modelo **page-per-component**.

Exemplos:

- `apps/showcase/src/app/components/sg-input-text/page.tsx`
- `apps/showcase/src/app/components/sg-button/page.tsx`
- `apps/showcase/src/app/components/sg-panel/page.tsx`

Cada pagina tende a combinar:

- header com ancora/sticky navigation
- exemplos visuais renderizados
- blocos de codigo com `SgCodeBlockBase`
- playground com `SgPlayground`
- tabela de props com `ShowcasePropsReference`

Isso e bom para IA porque ja existe um eixo claro:

- rota
- componente
- exemplos
- props
- playground

### 2.3 Onde os exemplos estao definidos

Hoje os exemplos vivem em tres lugares:

1. **JSX da pagina do showcase**
   - os demos renderizados estao diretamente em `page.tsx`
2. **arquivos `.sample`**
   - usados por `SgCodeBlockBase`
   - ex.: `apps/showcase/src/app/components/sg-input-text/samples/*.tsx.sample`
3. **arquivos `.playground`**
   - usados por `SgPlayground`
   - ex.: `apps/showcase/src/app/components/sg-input-text/sg-input-text.tsx.playground`

Isso ja forma um acervo valioso, mas ele ainda nao esta modelado como conhecimento estruturado.

### 2.4 Estruturas reutilizaveis ja existentes para docs

Sim, existem estruturas reutilizaveis importantes:

- `ShowcaseStickyHeader.tsx`
- `useShowcaseAnchors.ts`
- `ShowcasePropsReference.tsx`
- `sgCodeBlockBase.tsx`
- API `apps/showcase/src/app/api/showcase-code/route.ts`
- validacao de snippets em `apps/showcase/scripts/validate-showcase-snippets.mjs`
- testes de contrato em `apps/showcase/tests/*.test.mjs`

Conclusao: o showcase **ja tem um mini framework de documentacao**. O passo seguinte nao e reinventar a docs layer, e sim alimenta-la com dados semanticos.

### 2.5 Como os componentes sao apresentados hoje

Os componentes sao apresentados principalmente por:

- nome
- categoria/navegacao
- descricao curta manual
- exemplos enumerados
- props tables manuais
- playground interativo

Pontos fortes:

- muita cobertura funcional
- exemplos praticos
- boa demonstracao visual

Pontos fracos:

- ha **duplicacao de catalogo** entre `apps/showcase/src/app/page.tsx` e `apps/showcase/src/app/ShowcaseShell.tsx`
- props tables sao majoritariamente manuais
- descricoes estao presas em JSX e strings locais
- nao existe um identificador semantico unico por componente alem do nome/slug
- nao existe mapa formal de "este componente serve para este tipo de campo/entidade/cenario"

### 2.6 Onde faz sentido enriquecer com dados estruturados

Faz sentido enriquecer:

- catalogo global de componentes
- pagina individual de componente
- tabela de props
- lista de exemplos
- playground contract
- relacao componente <-> categoria <-> capacidades

Campos estruturados mais valiosos:

- `componentId`
- `slug`
- `category`
- `displayName`
- `description`
- `props`
- `states`
- `events`
- `a11y`
- `formSupport`
- `layoutRole`
- `exampleRefs`
- `aiHints`
- `sdui`

### 2.7 JSON-LD: onde faz sentido e onde nao faz

Como voce sinalizou, JSON-LD nao deve ser prioridade agora.

Faria sentido somente em paginas publicas e canonicas:

- home do showcase
- pagina publica de componente, se a intencao for indexacao externa
- paginas institucionais ou artigos tecnicos

Tipos possiveis no futuro:

- `TechArticle`
- `SoftwareSourceCode`
- `BreadcrumbList`

Nao faz sentido priorizar JSON-LD em:

- playgrounds interativos
- secoes de exemplo internas
- paginas utilitarias
- camadas internas de registry/SDUI

Conclusao: **JSON-LD e opcional e periferico**. O nucleo IA-ready deve ser manifesto semantico interno.

---

## 3. Analise dos Componentes

### 3.1 Padrões atuais

No pacote `fe-components`, ha padrao razoavelmente consistente de:

- agrupamento por pasta (`inputs`, `buttons`, `layout`, `commons`, etc.)
- export central em `src/index.ts`
- tipos de props exportados por componente
- showcases com props reference manual

Exemplos claros:

- `SgInputTextProps`
- `SgButtonProps`
- `SgPanelProps`

Isso ajuda muito porque o projeto ja tem:

- fronteira publica clara
- nomes estaveis
- categorias naturais

### 3.2 Melhores candidatos para piloto

Recomendo estes 5, nesta ordem:

1. `SgInputText`
   - excelente componente base para semantic field mapping
   - forte relacao com forms, validacao, RHF e entidades
2. `SgButton`
   - simples, transversal e muito usado
   - bom para modelar intent/action
3. `SgPanel`
   - ideal para semantica de layout/container
   - conecta bem com SDUI
4. `SgInputSelect` ou `SgAutocomplete`
   - cobre escolha assistida e dados relacionais
5. `SgInputDate`
   - cobre tipagem temporal e regras de dominio

Esses cinco formam um piloto equilibrado:

- entrada textual
- acao
- container/layout
- selecao
- data

### 3.3 Onde encaixar metadados sem poluir o codigo

Melhor ponto de encaixe inicial:

- **sidecar por componente**

Exemplo:

- `src/inputs/SgInputText.meta.ts`
- `src/buttons/SgButton.meta.ts`
- `src/layout/SgPanel.meta.ts`

Vantagens:

- nao polui a implementacao React
- evita aumentar bundle runtime sem necessidade
- facilita geracao de manifesto no build
- permite evolucao independente da implementacao visual

### 3.4 Metadata embutida no componente, manifesto gerado, ou ambos?

Recomendacao: **ambos, mas com fonte primaria fora do componente**.

Modelo sugerido:

- fonte primaria: `*.meta.ts`
- artefato consolidado: `dist/ai/seedgrid-components.manifest.json`
- opcional futuro: expor metadata leve via export runtime

Nao recomendo neste momento:

- anexar `Component.sgMeta = ...` em todos os componentes

Motivos:

- acopla runtime e docs/tooling cedo demais
- piora tree-shaking e responsabilidade do componente
- torna refactor mais sensivel

---

## 4. Proposta de Arquitetura IA-Ready

### 4.1 Objetivo arquitetural

Tratar o design system como:

> um catalogo de componentes consumivel por IA, tooling, showcase e SDUI

### 4.2 `sgMeta` spec v0

```ts
export type SgMetaV0 = {
  version: "0.1";
  componentId: string;          // ex: "form.input.text"
  package: "@seedgrid/fe-components";
  exportName: string;           // ex: "SgInputText"
  slug: string;                 // ex: "sg-input-text"
  displayName: string;
  category: "input" | "action" | "layout" | "feedback" | "navigation" | "data" | "provider" | "hook" | "gadget";
  subcategory?: string;         // ex: "text", "date", "container"
  description: string;
  status?: "stable" | "beta" | "experimental";
  tags?: string[];
  capabilities?: string[];      // ex: ["rhf", "validation", "clearable", "prefix-suffix"]
  layoutRole?: "field" | "trigger" | "container" | "overlay" | "navigation" | "display";
  formSupport?: {
    mode: "native" | "rhf" | "controlled" | "hybrid";
    valueType?: "string" | "number" | "boolean" | "date" | "array" | "object";
  };
  props: Array<{
    name: string;
    type: string;
    required?: boolean;
    default?: string;
    description?: string;
    enumValues?: string[];
    semanticRole?: "value" | "label" | "validation" | "appearance" | "layout" | "event" | "dataSource";
  }>;
  events?: Array<{
    name: string;
    payloadType?: string;
    description?: string;
  }>;
  states?: string[];            // ex: ["default", "disabled", "readOnly", "error"]
  a11y?: {
    ariaRole?: string;
    keyboardNotes?: string[];
  };
  examples?: Array<{
    id: string;
    title: string;
    file: string;
    kind: "sample" | "playground";
  }>;
  showcase?: {
    route: string;
    hasPlayground: boolean;
    hasPropsTable: boolean;
  };
  sdui?: {
    rendererType: string;       // ex: "field.text"
    allowedChildren?: string[];
    acceptsDataBinding?: boolean;
  };
};
```

### 4.3 `aiHints` spec v0

`aiHints` deve responder menos "como o componente e implementado" e mais "quando um agente deveria escolhê-lo".

```ts
export type SgAiHintsV0 = {
  version: "0.1";
  preferredUseCases: string[];
  avoidUseCases?: string[];
  synonyms?: string[];          // ex: ["text field", "input", "campo texto"]
  relatedEntityFields?: string[]; // ex: ["name", "title", "description"]
  replaceableBy?: string[];     // componentId
  preferredOver?: string[];     // componentId
  compositionHints?: string[];  // ex: ["use inside SgGroupBox", "pair with SgButton submit"]
  promptHints?: string[];       // frases curtas para retrieval/agents
  rankingSignals?: {
    whenLabelNeeded?: number;
    whenFreeText?: number;
    whenStructuredChoice?: number;
    whenDenseLayout?: number;
  };
};
```

### 4.4 Formato de manifesto JSON consolidado

```json
{
  "schemaVersion": "0.1",
  "generatedAt": "2026-04-13T00:00:00Z",
  "package": "@seedgrid/fe-components",
  "packageVersion": "0.2.10",
  "components": [
    {
      "componentId": "form.input.text",
      "exportName": "SgInputText",
      "slug": "sg-input-text",
      "category": "input",
      "sgMeta": {},
      "aiHints": {}
    }
  ]
}
```

Sugestao importante: manter no manifesto apenas dados necessarios para consumo externo. Nada de serializar funcoes, ReactNodes ou estruturas dificeis de estabilizar.

### 4.5 Como gerar isso no build

Pipeline incremental sugerido:

1. criar pasta `src/ai-meta`
2. adicionar `*.meta.ts` por componente piloto
3. criar script `scripts/build-ai-manifest.mjs` ou `.ts`
4. o script importa apenas sidecars metadata
5. o script valida campos minimos
6. o script escreve JSON em `dist/ai/seedgrid-components.manifest.json`

Etapa opcional v1:

- cruzar metadata com AST/TypeScript para detectar drift entre props publicas e props documentadas

### 4.6 Como o showcase pode consumir isso

Consumo recomendado em camadas:

1. **home/catalogo**
   - usar manifesto para gerar lista de componentes
   - elimina duplicacao entre `page.tsx` e `ShowcaseShell.tsx`
2. **pagina do componente**
   - usar manifesto para badge de categoria, tags, capabilities e resumo
3. **props reference**
   - iniciar consumindo `sgMeta.props` para o piloto
4. **playground**
   - usar manifesto para listar props editaveis e defaults seguros
5. **busca futura**
   - query por tags, categoria, use case, tipo de campo

### 4.7 Como isso se conecta com SDUI

O projeto ja tem um embrião de registry em `src/integration/module.ts` e `src/manifest.ts`.

O passo natural e separar duas camadas:

- **module manifest**
  - providers, nav, i18n, routes
- **component semantic manifest**
  - capacidades, props, hints, mapping para renderer SDUI

Conexao sugerida:

```ts
type SduiNode = {
  type: string;                 // ex: "field.text"
  bind?: string;                // ex: "customer.name"
  props?: Record<string, unknown>;
  children?: SduiNode[];
};
```

Exemplo de relacao:

- `field.text` -> `SgInputText`
- `action.button` -> `SgButton`
- `layout.panel` -> `SgPanel`
- `field.select` -> `SgInputSelect`
- `field.date` -> `SgInputDate`

O manifesto passa a ser a base para:

- validar nodes SDUI
- sugerir renderer correto
- inferir props minimas por tipo de node
- mapear entidades para UI

---

## 5. Piloto Recomendado

### 5.1 Componentes do piloto

- `SgInputText`
- `SgButton`
- `SgPanel`
- `SgInputSelect` ou `SgAutocomplete`
- `SgInputDate`

### 5.2 Metadata minima por componente

Minimo obrigatorio do piloto:

- `componentId`
- `exportName`
- `slug`
- `category`
- `description`
- `capabilities`
- `props` principais
- `states`
- `examples`
- `showcase.route`
- `sdui.rendererType`

### 5.3 `aiHints` minimos por componente

Minimo obrigatorio:

- `preferredUseCases`
- `avoidUseCases`
- `synonyms`
- `relatedEntityFields`
- `compositionHints`

### 5.4 Exemplo serializado: `SgInputText`

```json
{
  "componentId": "form.input.text",
  "exportName": "SgInputText",
  "slug": "sg-input-text",
  "category": "input",
  "subcategory": "text",
  "description": "Campo textual de uso geral com suporte a RHF, validacao, rotulo, prefixo/sufixo e estados visuais.",
  "capabilities": ["rhf", "controlled", "validation", "clearable", "prefix-suffix", "char-counter"],
  "layoutRole": "field",
  "formSupport": {
    "mode": "hybrid",
    "valueType": "string"
  },
  "props": [
    { "name": "id", "type": "string", "required": true, "semanticRole": "label" },
    { "name": "name", "type": "string", "semanticRole": "value" },
    { "name": "label", "type": "string", "semanticRole": "label" },
    { "name": "placeholder", "type": "string", "semanticRole": "label" },
    { "name": "required", "type": "boolean", "default": "false", "semanticRole": "validation" },
    { "name": "disabled", "type": "boolean", "default": "false", "semanticRole": "appearance" },
    { "name": "readOnly", "type": "boolean", "default": "false", "semanticRole": "appearance" },
    { "name": "maxLength", "type": "number", "semanticRole": "validation" },
    { "name": "minLength", "type": "number", "semanticRole": "validation" },
    { "name": "onChange", "type": "(value: string) => void", "semanticRole": "event" }
  ],
  "states": ["default", "focused", "disabled", "readOnly", "error"],
  "examples": [
    {
      "id": "basic-rhf",
      "title": "Basico com react-hook-form",
      "file": "apps/showcase/src/app/components/sg-input-text/samples/basico-rhf.tsx.sample",
      "kind": "sample"
    },
    {
      "id": "playground",
      "title": "Playground",
      "file": "apps/showcase/src/app/components/sg-input-text/sg-input-text.tsx.playground",
      "kind": "playground"
    }
  ],
  "showcase": {
    "route": "/components/sg-input-text",
    "hasPlayground": true,
    "hasPropsTable": true
  },
  "sdui": {
    "rendererType": "field.text",
    "acceptsDataBinding": true
  },
  "aiHints": {
    "preferredUseCases": [
      "captura de nome, titulo, codigo curto, identificador textual",
      "formularios CRUD",
      "campos livres de texto curto"
    ],
    "avoidUseCases": [
      "texto multi-linha",
      "escolha estruturada",
      "datas",
      "numeros com mascara forte"
    ],
    "synonyms": ["text field", "input text", "campo texto", "campo livre"],
    "relatedEntityFields": ["name", "title", "nickname", "code", "shortDescription"],
    "compositionHints": [
      "combinar com SgButton em formularios",
      "agrupar com SgPanel ou SgGroupBox em secoes"
    ]
  }
}
```

### 5.5 Como o showcase exibiria isso

Na pagina do piloto, o manifesto poderia alimentar:

- badge de categoria: `input / text`
- lista de capabilities
- tabela de props basicas
- bloco "AI Hints"
- bloco "SDUI mapping"
- secoes "recommended for" e "avoid for"

Sem reescrever a pagina inteira.

---

## 6. Exemplo Completo de 1 Componente IA-Ready

Exemplo de sidecar recomendado:

```ts
// src/inputs/SgInputText.meta.ts
import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.text",
  package: "@seedgrid/fe-components",
  exportName: "SgInputText",
  slug: "sg-input-text",
  displayName: "SgInputText",
  category: "input",
  subcategory: "text",
  description: "Campo textual de uso geral com suporte a RHF, validacao e estados visuais.",
  status: "stable",
  tags: ["form", "text", "field", "rhf"],
  capabilities: ["rhf", "controlled", "validation", "clearable", "prefix-suffix"],
  layoutRole: "field",
  formSupport: {
    mode: "hybrid",
    valueType: "string"
  },
  props: [
    { name: "id", type: "string", required: true, semanticRole: "label" },
    { name: "label", type: "string", semanticRole: "label" },
    { name: "name", type: "string", semanticRole: "value" },
    { name: "required", type: "boolean", default: "false", semanticRole: "validation" },
    { name: "maxLength", type: "number", semanticRole: "validation" },
    { name: "onChange", type: "(value: string) => void", semanticRole: "event" }
  ],
  states: ["default", "disabled", "readOnly", "error"],
  examples: [
    {
      id: "basic-rhf",
      title: "Basico com RHF",
      file: "apps/showcase/src/app/components/sg-input-text/samples/basico-rhf.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-input-text/sg-input-text.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-input-text",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.text",
    acceptsDataBinding: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "campos textuais curtos",
    "formularios CRUD",
    "captura de nome e titulo"
  ],
  avoidUseCases: [
    "texto longo",
    "datas",
    "selecao fechada",
    "valores monetarios"
  ],
  synonyms: ["text field", "text input", "campo texto"],
  relatedEntityFields: ["name", "title", "code"],
  compositionHints: [
    "usar com SgButton para submit",
    "usar com SgPanel ou SgGroupBox para agrupamento"
  ],
  promptHints: [
    "Use when the user needs free text input",
    "Prefer for short textual values"
  ]
};
```

Esse modelo preserva:

- compatibilidade com o componente atual
- baixo acoplamento
- geracao simples de manifesto

---

## 7. Estrutura de Pastas Sugerida

```text
packages/
  seedgrid-fe-components/
    src/
      ai-meta/
        types.ts
        registry.ts
      buttons/
        SgButton.tsx
        SgButton.meta.ts
      inputs/
        SgInputText.tsx
        SgInputText.meta.ts
        SgInputDate.tsx
        SgInputDate.meta.ts
        SgInputSelect.tsx
        SgInputSelect.meta.ts
      layout/
        SgPanel.tsx
        SgPanel.meta.ts
    scripts/
      build-ai-manifest.ts
    dist/
      ai/
        seedgrid-components.manifest.json

apps/
  showcase/
    src/
      app/
        components/
          ai/
            AiHintsCard.tsx
            ComponentSemanticSummary.tsx
        lib/
          ai-manifest.ts
```

Observacao importante:

- se preferir risco ainda menor, `scripts/build-ai-manifest.ts` pode ficar em `apps/showcase/scripts` no inicio
- quando estabilizar, mover para o pacote `fe-components`

---

## 8. Roadmap Incremental

### Fase 0 - descoberta

- inventariar 3 a 5 componentes piloto
- mapear props realmente publicas e estaveis
- definir ids semanticos (`form.input.text`, `action.button`, etc.)
- decidir naming e fronteira do manifesto

### Fase 1 - spec (`sgMeta` + `aiHints`)

- criar `types.ts` de `sgMeta` e `aiHints`
- criar 1 sidecar completo como referencia
- validar se o shape atende showcase, IA e SDUI

### Fase 2 - piloto

- aplicar sidecars aos 3 a 5 componentes escolhidos
- gerar manifesto consolidado no build
- adicionar validacao minima de schema

### Fase 3 - integracao com showcase

- usar manifesto no catalogo/home
- exibir bloco semantico nas paginas piloto
- usar manifesto para parte da props table
- manter fallback para paginas legadas

### Fase 4 - evolucao (SDUI / geracao automatica)

- criar mapping `rendererType -> componente`
- permitir validacao de nodes SDUI com base no manifesto
- introduzir mapeamento entidade -> componente via `aiHints.relatedEntityFields`
- habilitar sugestao automatica em tooling/agentes

---

## 9. Riscos e Trade-offs

### 9.1 Complexidade

Risco:

- tentar tipar tudo de uma vez e transformar o manifesto num mini compilador

Mitigacao:

- manter spec v0 pequena
- piloto em 3 a 5 componentes

### 9.2 Manutencao

Risco:

- metadata divergir do componente real

Mitigacao:

- sidecar pequeno
- validacao de schema
- mais tarde, checks de AST/TS para drift

### 9.3 Impacto no codigo atual

Risco:

- refactor transversal desnecessario no showcase

Mitigacao:

- consumir manifesto primeiro em pontos nao invasivos
- nao remover as paginas atuais

### 9.4 Acoplamento

Risco:

- acoplar metadata demais ao runtime React

Mitigacao:

- fonte primaria fora do componente
- manifesto gerado como artefato de build

### 9.5 Overengineering

Risco:

- tentar resolver IA, docs, SDUI e SEO ao mesmo tempo

Mitigacao:

- prioridade: metadata + semantica + manifesto
- JSON-LD depois
- automacao generativa depois

---

## 10. Recomendacao Final

Melhor estrategia para o SeedGrid hoje:

- **nao mexer em massa**
- **nao adicionar metadata diretamente em todos os componentes**
- **nao tentar inferir tudo automaticamente no primeiro passo**

Melhor caminho:

1. sidecar `sgMeta` + `aiHints` para poucos componentes
2. manifesto JSON consolidado no build
3. showcase consumindo manifesto
4. SDUI usando `rendererType`

Isso atende a visao final:

- gerar tela a partir de entidade
- sugerir componentes automaticamente
- montar UI via SDUI
- integrar com agentes de IA

Sem quebrar a arquitetura atual.

---

## 11. Proximos Passos Claros

1. Definir o shape final de `SgMetaV0` e `SgAiHintsV0`.
2. Escolher o piloto inicial entre `SgInputText`, `SgButton`, `SgPanel`, `SgInputSelect/SgAutocomplete` e `SgInputDate`.
3. Criar os sidecars `.meta.ts` apenas desses componentes.
4. Implementar o gerador de manifesto JSON no build.
5. Fazer o showcase usar o manifesto na home e em 1 pagina piloto.
6. So depois disso expandir para mais componentes.
