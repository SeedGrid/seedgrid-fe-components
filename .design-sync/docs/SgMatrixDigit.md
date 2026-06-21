# SgMatrixDigit

Digito em estilo matriz para displays compactos de numeros e caracteres com estetica de painel digital.

## Quando usar
- Displays com estetica de painel digital ou matriz.
- Contadores compactos em dashboards tecnicos.
- Indicadores visuais que precisam de identidade pixelada.

## Quando evitar
- Texto longo ou conteudo editorial.
- Entrada de dados pelo usuario.
- Formularios e controles de selecao.

## Composição
- Combinar varios SgMatrixDigit em paines de contagem.
- Usar com SgCard, SgDashboard e widgets numericos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Caractere exibido na matriz. |
| `fontSize` | `number` | não | Escala visual do display. |
| `color` | `string` | não | Cor principal do digito. |
| `backgroundColor` | `string` | não | Cor do fundo do display. |
| `className` | `string` | não | Classes CSS adicionais. |

## Tags
gadget, digit, matrix, display, counter, single-character-display, matrix-style, counter-composition, pixel-look, matrix digit, dot matrix digit, panel digit
