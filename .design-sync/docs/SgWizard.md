# SgWizard

Fluxo multi-etapas com stepper, validacao por etapa, navegacao controlada e finalizacao assincrona.

## Quando usar
- Guiar o usuario por um fluxo multi-etapas com validacao progressiva.
- Organizar cadastros complexos, onboarding e configuracoes assistidas.
- Separar coleta de dados em passos com navegacao controlada.

## Quando evitar
- Troca simples de abas sem sequencia; nesses casos prefira PageControl.
- Fluxos sem navegacao guiada; nesses casos prefira formularios comuns com Panel e inputs.
- Dialogs curtos com uma unica acao.

## Composição
- Usar com SgWizardPage e inputs para formularios complexos.
- Combinar com Button e dialogs de confirmacao quando houver etapa final de submit.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | sim | Paginas do wizard renderizadas em ordem. |
| `initialStep` | `number` | não | Indice inicial da etapa ativa. |
| `stepper` | `"numbered" \| "icons" \| "none"` | não | Modo visual do stepper. |
| `stepNavigation` | `"none" \| "previous" \| "previous-and-next"` | não | Define quais etapas podem ser acessadas clicando no stepper. |
| `validateStep` | `(stepIndex: number) => boolean \| Promise<boolean>` | não | Valida a etapa atual antes de avancar. |
| `onStepChange` | `(index: number) => void` | não | Callback disparado ao trocar de etapa. |
| `onFinish` | `() => void \| Promise<void>` | sim | Acao executada ao concluir o wizard. |

## Tags
navigation, wizard, steps, flow, form, multi-step, validation, stepper, previous-next, async-finish, step form, multi-step flow, guided flow
