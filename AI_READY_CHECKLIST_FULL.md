# AI Ready Checklist Full

## Summary

- Total components: 82
- With metadata: 82
- Without metadata: 0
- Coverage: 100.0%
- Manifest coverage: 82/82 (100%)
- Showcase coverage: 82/82 (100%)

## Guardrails

- Metadata deve ficar em sidecar `*.meta.ts`; nao embutir inteligencia diretamente no JSX nem anexar metadata ao runtime do componente.
- O rollout deve ser incremental e de baixo risco: sem refactor global, sem trocar docs manuais em massa e sem quebrar o comportamento atual.
- A fonte primaria da semantica deve ser o sidecar; o artefato consolidado e o manifesto JSON gerado no build.
- O showcase deve consumir o manifesto apenas em pontos especificos e complementares, sem reescrever a pagina inteira.
- JSON-LD nao e prioridade deste checklist; so entra no futuro para paginas publicas e canonicas.
- O foco principal e metadata + semantica + manifesto + consumo por tooling/IA/SDUI, com compatibilidade com a arquitetura atual.

## Completion Model

- Um componente so deve ser considerado IA-ready de forma robusta quando tiver sidecar, semantica minima (`sgMeta`), hints de decisao (`aiHints`), contrato SDUI minimo e entrada no manifesto.
- O checklist abaixo mistura verificacoes automaticas do repo com criterios de completude recomendados pelo `IA_READY_ANALYSIS.md`.
- Itens marcados refletem o estado detectado hoje; itens desmarcados indicam lacunas reais ou pontos ainda nao auditados automaticamente.

## Automated Checks Legend

- `Criar .meta.ts`: existe sidecar correspondente.
- `sgMeta completo`: sidecar exporta `sgMeta`.
- `aiHints completo`: sidecar exporta `aiHints`.
- `identity core`: `componentId`, `slug`, `category` e `description` presentes.
- `use-case hints`: `preferredUseCases`, `avoidUseCases`, `synonyms`, `relatedEntityFields` e `compositionHints` presentes.
- `rankingSignals`: `aiHints.rankingSignals` presente.
- `fieldSemantics`: `sgMeta.fieldSemantics` presente e nao vazio.
- `props semantics`: ha props com `semanticRole` e `bindable`.
- `sdui contract`: ha bloco `sdui` com `rendererType` e `defaultProps`.
- `incluido no manifesto`: componente aparece no manifesto consolidado ou nas entradas do build.
- `exibido no showcase`: ha pagina do showcase consumindo manifesto via `ComponentAiSummary`, `ComponentAiPropsTable` ou `loadAiManifestComponent(...)`.

## Input

### SgAutocomplete

- Group: Input
- Export source: `./inputs/SgAutocomplete`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgAutocomplete.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgCheckboxGroup

- Group: Input
- Export source: `./inputs/SgCheckboxGroup`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgCheckboxGroup.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgCombobox

- Group: Input
- Export source: `./inputs/SgCombobox`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgCombobox.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputBirthDate

- Group: Input
- Export source: `./inputs/SgInputBirthDate`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputBirthDate.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputCNPJ

- Group: Input
- Export source: `./inputs/SgInputCNPJ`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputCNPJ.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputCPF

- Group: Input
- Export source: `./inputs/SgInputCPF`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputCPF.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputCPFCNPJ

- Group: Input
- Export source: `./inputs/SgInputCPFCNPJ`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputCPFCNPJ.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputCurrency

- Group: Input
- Export source: `./inputs/SgInputCurrency`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputCurrency.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputDate

- Group: Input
- Export source: `./inputs/SgInputDate`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputDate.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputEmail

- Group: Input
- Export source: `./inputs/SgInputEmail`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputEmail.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputNumber

- Group: Input
- Export source: `./inputs/SgInputNumber`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputNumber.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputOTP

- Group: Input
- Export source: `./inputs/SgInputOTP`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputOTP.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputPassword

- Group: Input
- Export source: `./inputs/SgInputPassword`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputPassword.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputPhone

- Group: Input
- Export source: `./inputs/SgInputPhone`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputPhone.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputPostalCode

- Group: Input
- Export source: `./inputs/SgInputPostalCode`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputPostalCode.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputText

- Group: Input
- Export source: `./inputs/SgInputText`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputText.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgInputTextArea

- Group: Input
- Export source: `./inputs/SgInputTextArea`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgInputTextarea.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgOrderList

- Group: Input
- Export source: `./inputs/SgOrderList`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgOrderList.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgPickList

- Group: Input
- Export source: `./inputs/SgPickList`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgPickList.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgRadioGroup

- Group: Input
- Export source: `./inputs/SgRadioGroup`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgRadioGroup.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgRating

- Group: Input
- Export source: `./inputs/SgRating`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgRating.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgSlider

- Group: Input
- Export source: `./inputs/SgSlider`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgSlider.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgStepperInput

- Group: Input
- Export source: `./inputs/SgStepperInput`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgStepperInput.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgTextEditor

- Group: Input
- Export source: `./inputs/SgTextEditor`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgTextEditor.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgToggleSwitch

- Group: Input
- Export source: `./inputs/SgToggleSwitch`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgToggleSwitch.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Action

### SgButton

- Group: Action
- Export source: `./buttons/SgButton`
- Expected metadata: `packages/seedgrid-fe-components/src/buttons/SgButton.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgFloatActionButton

- Group: Action
- Export source: `./buttons/SgFloatActionButton`
- Expected metadata: `packages/seedgrid-fe-components/src/buttons/SgFloatActionButton.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgSplitButton

- Group: Action
- Export source: `./buttons/SgSplitButton`
- Expected metadata: `packages/seedgrid-fe-components/src/buttons/SgSplitButton.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Layout

### SgAccordion

- Group: Layout
- Export source: `./layout/SgAccordion`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgAccordion.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgCard

- Group: Layout
- Export source: `./layout/SgCard`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgCard.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgCarousel

- Group: Layout
- Export source: `./layout/SgCarousel`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgCarousel.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDockLayout

- Group: Layout
- Export source: `./layout/SgDockLayout`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgDockLayout.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDockScreen

- Group: Layout
- Export source: `./layout/SgDockScreen`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgDockScreen.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDockZone

- Group: Layout
- Export source: `./layout/SgDockZone`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgDockZone.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgExpandablePanel

- Group: Layout
- Export source: `./layout/SgExpandablePanel`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgExpandablePanel.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgGrid

- Group: Layout
- Export source: `./layout/SgGrid`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgGrid.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgGroupBox

- Group: Layout
- Export source: `./layout/SgGroupBox`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgGroupBox.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgPanel

- Group: Layout
- Export source: `./layout/SgPanel`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgPanel.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgScreen

- Group: Layout
- Export source: `./layout/SgScreen`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgScreen.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgStack

- Group: Layout
- Export source: `./layout/SgStack`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgStack.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgToolBar

- Group: Layout
- Export source: `./layout/SgToolBar`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgToolBar.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgToolbarIconButton

- Group: Layout
- Export source: `./layout/SgToolBar`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgToolbarIconButton.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Data

### SgDatatable

- Group: Data
- Export source: `./inputs/SgDatatable`
- Expected metadata: `packages/seedgrid-fe-components/src/inputs/SgDatatable.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Feedback

### SgBadge

- Group: Feedback
- Export source: `./commons/SgBadge`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgBadge.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgBadgeOverlay

- Group: Feedback
- Export source: `./commons/SgBadgeOverlay`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgBadgeOverlay.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgConfirmationDialog

- Group: Feedback
- Export source: `./overlay/SgConfirmationDialog`
- Expected metadata: `packages/seedgrid-fe-components/src/overlay/SgConfirmationDialog.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDialog

- Group: Feedback
- Export source: `./overlay/SgDialog`
- Expected metadata: `packages/seedgrid-fe-components/src/overlay/SgDialog.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgPopup

- Group: Feedback
- Export source: `./overlay/SgPopup`
- Expected metadata: `packages/seedgrid-fe-components/src/overlay/SgPopup.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgSkeleton

- Group: Feedback
- Export source: `./commons/SgSkeleton`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgSkeleton.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgToaster

- Group: Feedback
- Export source: `./commons/SgToaster`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgToaster.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgToastHost

- Group: Feedback
- Export source: `./commons/SgToastHost`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgToastHost.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgWhistleHost

- Group: Feedback
- Export source: `./commons/SgWhistleHost`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgWhistleHost.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Navigation

### SgBreadcrumb

- Group: Navigation
- Export source: `./layout/SgBreadcrumb`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgBreadcrumb.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDockMenu

- Group: Navigation
- Export source: `./menus/SgDockMenu`
- Expected metadata: `packages/seedgrid-fe-components/src/menus/SgDockMenu.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgMenu

- Group: Navigation
- Export source: `./layout/SgMenu`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgMenu.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgPageControl

- Group: Navigation
- Export source: `./layout/SgPageControl`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgPageControl.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgPageControlPage

- Group: Navigation
- Export source: `./layout/SgPageControl`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgPageControlPage.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgTreeView

- Group: Navigation
- Export source: `./layout/SgTreeView`
- Expected metadata: `packages/seedgrid-fe-components/src/layout/SgTreeView.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

## Other

### SgAvatar

- Group: Other
- Export source: `./commons/SgAvatar`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgAvatar.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgAvatarGroup

- Group: Other
- Export source: `./commons/SgAvatar`
- Expected metadata: `packages/seedgrid-fe-components/src/commons/SgAvatarGroup.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgCalendar

- Group: Other
- Export source: `./gadgets/calendar`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/calendar/SgCalendar.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgClock

- Group: Other
- Export source: `./gadgets/clock/SgClock`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/clock/SgClock.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgClockThemePicker

- Group: Other
- Export source: `./gadgets/clock/themes`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/clock/themes/SgClockThemePicker.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgClockThemePreview

- Group: Other
- Export source: `./gadgets/clock/themes`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/clock/themes/SgClockThemePreview.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgClockThemeProvider

- Group: Other
- Export source: `./gadgets/clock/themes`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/clock/themes/SgClockThemeProvider.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgComponentsI18nProvider

- Group: Other
- Export source: `./i18n`
- Expected metadata: `packages/seedgrid-fe-components/src/i18n/SgComponentsI18nProvider.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgDiscardDigit

- Group: Other
- Export source: `./digits/discard-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/discard-digit/SgDiscardDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgEnvironmentProvider

- Group: Other
- Export source: `./environment/SgEnvironmentProvider`
- Expected metadata: `packages/seedgrid-fe-components/src/environment/SgEnvironmentProvider.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgFadeDigit

- Group: Other
- Export source: `./digits/fade-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/fade-digit/SgFadeDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgFlipDigit

- Group: Other
- Export source: `./digits/flip-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/flip-digit/SgFlipDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgLinearGauge

- Group: Other
- Export source: `./gadgets/gauge`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/gauge/SgLinearGauge.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgMatrixDigit

- Group: Other
- Export source: `./digits/matrix-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/matrix-digit/SgMatrixDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgNeonDigit

- Group: Other
- Export source: `./digits/neon-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/neon-digit/SgNeonDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgQRCode

- Group: Other
- Export source: `./gadgets/qr-code`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/qr-code/SgQRCode.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgRadialGauge

- Group: Other
- Export source: `./gadgets/gauge`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/gauge/SgRadialGauge.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgRoller3DDigit

- Group: Other
- Export source: `./digits/roller3d-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/roller3d-digit/SgRoller3DDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgSegmentDigit

- Group: Other
- Export source: `./digits/segment-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/segment-digit/SgSegmentDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgSevenSegmentDigit

- Group: Other
- Export source: `./digits/seven-segment-digit`
- Expected metadata: `packages/seedgrid-fe-components/src/digits/seven-segment-digit/SgSevenSegmentDigit.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgStringAnimator

- Group: Other
- Export source: `./gadgets/string-animator`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/string-animator/SgStringAnimator.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgTimeProvider

- Group: Other
- Export source: `./gadgets/clock/SgTimeProvider`
- Expected metadata: `packages/seedgrid-fe-components/src/gadgets/clock/SgTimeProvider.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgWizard

- Group: Other
- Export source: `./wizard/SgWizard`
- Expected metadata: `packages/seedgrid-fe-components/src/wizard/SgWizard.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase

### SgWizardPage

- Group: Other
- Export source: `./wizard/SgWizard`
- Expected metadata: `packages/seedgrid-fe-components/src/wizard/SgWizardPage.meta.ts`

- [x] Criar .meta.ts
- [x] sgMeta completo
- [x] aiHints completo
- [x] identity core
- [x] use-case hints
- [x] rankingSignals
- [x] fieldSemantics
- [x] props semantics
- [x] sdui contract
- [x] incluido no manifesto
- [x] exibido no showcase
