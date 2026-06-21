# SgFadeDigit

Digito animado com transicao de fade para exibicao de numeros e caracteres em relogios e contadores luminosos.

## Quando usar
- Relogios e contadores com visual suave de transicao.
- Exibicao de digitos com identidade luminosa ou neon.
- Widgets numericos que exigem mudanca visual discreta.

## Quando evitar
- Captura de valor pelo usuario.
- Texto longo ou blocos informativos.
- Tabelas de dados com muitas celulas.

## Composição
- Combinar varios SgFadeDigit para relogios e contadores.
- Usar com SgClock, SgPanel e paineis de status.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Caractere exibido no card. |
| `fontSize` | `number` | não | Escala visual do digito. |
| `color` | `string` | não | Cor do caractere exibido. |
| `backgroundColor` | `string` | não | Cor de fundo do card. |
| `className` | `string` | não | Classes CSS adicionais. |

## Tags
gadget, digit, fade, clock, counter, single-character-display, fade-animation, clock-composition, custom-colors, fade digit, animated digit, nixie-style digit
