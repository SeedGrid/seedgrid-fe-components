# SgQRCode

Gerador visual de QR Code com configuracao de valor, logo central, tamanho, margem e cores.

## Quando usar
- Exibir links, payloads PIX e codigos escaneaveis em telas e comprovantes.
- Compartilhar acesso rapido a URLs, apps e recursos externos.
- Representar codigos maquina-legiveis em cards, dialogos e comprovantes.

## Quando evitar
- Entrada de texto ou edicao de dados.
- Valores numericos simples sem necessidade de codificacao visual.
- Blocos de conteudo textual longo.

## Composição
- Usar com SgCard, SgDialog e SgPanel para areas de compartilhamento ou pagamento.
- Combinar com SgBadge e SgButton para acoes de copiar e compartilhar.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | Valor textual codificado no QR Code. |
| `size` | `number` | não | Tamanho do QR em pixels. |
| `logoSrc` | `string` | não | URL da logo exibida no centro do QR. |
| `fgColor` | `string` | não | Cor principal do QR Code. |
| `bgColor` | `string` | não | Cor de fundo do QR Code. |

## Tags
gadget, qr-code, barcode, pix, share, qr-generation, logo-overlay, size-control, color-customization, empty-fallback, qr code, code generator, pix qr, scan code
