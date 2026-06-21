# SgDiscardDigit

Digito animado com transicao de descarte para representar mudanca de valores em displays compactos.

## Quando usar
- Displays de contagem com transicao visual mais expressiva.
- Indicadores numericos compactos em dashboards.
- Widgets que priorizam efeito de troca entre caracteres.

## Quando evitar
- Entrada de dados do usuario.
- Texto longo e leitura continua.
- Tabelas e grids com muitas celulas.

## Composição
- Combinar varios SgDiscardDigit para relogios e contadores.
- Usar com SgCard, SgPanel e widgets de destaque.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Caractere exibido no display. |
| `fontSize` | `number` | não | Escala visual do digito. |
| `color` | `string` | não | Cor do caractere. |
| `backgroundColor` | `string` | não | Cor do fundo do card. |
| `className` | `string` | não | Classes CSS adicionais. |

## Tags
gadget, digit, discard, display, counter, single-character-display, discard-animation, counter-composition, custom-colors, discard digit, animated digit, counter digit
