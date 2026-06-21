# SgFlipDigit

Digito animado estilo flip para exibir numeros ou caracteres unicos em relogios, contadores e paines visuais.

## Quando usar
- Exibir digitos unicos em relogios digitais e contadores animados.
- Criar paines com estetica de flip clock ou scoreboards.
- Representar caracteres curtos com animacao de transicao visual.

## Quando evitar
- Entrada de dados pelo usuario; use componentes de input.
- Texto longo ou frases completas.
- Listas e tabelas com grande densidade de conteudo.

## Composição
- Combinar varios SgFlipDigit para horas, minutos, segundos e placares.
- Usar com SgClock, SgCard e SgScreen em paineis visuais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Caractere exibido no card flip. |
| `width` | `number` | não | Largura visual do card. |
| `height` | `number` | não | Altura visual do card. |
| `fontSize` | `number` | não | Tamanho da fonte do digito. |
| `className` | `string` | não | Classes CSS adicionais no container. |

## Tags
gadget, digit, flip, clock, counter, single-character-display, flip-animation, clock-composition, size-variants, flip digit, flip clock digit, animated digit
