# SgSevenSegmentDigit

Digito de sete segmentos para displays classicos de relogio, paineis eletronicos e contadores numericos.

## Quando usar
- Relogios digitais classicos e displays numericos retro.
- Paineis eletronicos com representacao numerica compacta.
- KPIs com estetica de sete segmentos.

## Quando evitar
- Entrada de dados pelo usuario.
- Conteudo textual longo.
- Interfaces de lista ou tabela densas.

## Composição
- Combinar varios SgSevenSegmentDigit em relogios e contadores.
- Usar com SgClock, SgScreen e paineis operacionais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Caractere exibido no display. |
| `fontSize` | `number` | não | Escala visual do digito. |
| `color` | `string` | não | Cor dos segmentos ativos. |
| `backgroundColor` | `string` | não | Cor do fundo do display. |
| `className` | `string` | não | Classes CSS adicionais. |

## Tags
gadget, digit, seven-segment, clock, counter, single-character-display, seven-segment-style, clock-composition, retro-digital, seven segment digit, 7 segment display, digital clock digit
