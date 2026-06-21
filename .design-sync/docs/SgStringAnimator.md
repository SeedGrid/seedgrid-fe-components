# SgStringAnimator

Componente para animar transicao entre strings usando estilos como roller3d, flip e neon em displays textuais curtos.

## Quando usar
- Animar mudanca de labels, titulos curtos e textos de destaque.
- Criar widgets textuais com transicao visual em dashboards e landing sections.
- Representar evolucao entre dois estados textuais curtos.

## Quando evitar
- Paragrafos longos ou conteudo de leitura extensa.
- Campos editaveis de formulario.
- Tabelas e listas com alto volume de linhas.

## Composição
- Usar com SgCard e SgDashboard em secoes de destaque.
- Combinar com digitos animados para paineis hibridos de texto e numero.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `sourceString` | `string` | sim | Texto inicial da animacao. |
| `targetString` | `string` | sim | Texto final da animacao. |
| `stringAnimatorStyle` | `"roller3d" \| "flip" \| "neon" \| "fade" \| "matrix" \| "discard" \| "segment" \| "sevenSegment"` | não | Estilo visual usado na transicao. |
| `alignTo` | `"left" \| "center" \| "right"` | não | Alinhamento do texto animado. |
| `fontSize` | `number` | não | Escala visual do display. |

## Tags
gadget, string, animation, display, text, string-transition, multiple-animation-styles, manual-trigger, alignment-control, string animator, animated text, text transition, display animator
