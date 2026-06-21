# SgSkeleton

Placeholder visual para estados de carregamento, simulando texto, blocos e avatares antes da chegada dos dados reais.

## Quando usar
- Representar carregamento de conteudo antes dos dados reais estarem disponiveis.
- Simular listas, cards, tabelas e detalhes de perfil em estado pending.
- Evitar layout shift durante carregamentos assíncronos.

## Quando evitar
- Exibir feedback final de erro ou sucesso; nesses casos prefira componentes de alerta ou toast.
- Conteudo real persistente; o skeleton e apenas placeholder.
- Acoes e interacoes diretas do usuario.

## Composição
- Usar junto de SgCard, SgAvatar e SgDatatable para estados de carregamento.
- Combinar varios skeletons em SgStack e SgGrid para simular layouts completos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `shape` | `"text" \| "rectangle" \| "rounded" \| "square" \| "circle"` | não | Forma visual base do placeholder. |
| `animation` | `"wave" \| "pulse" \| "none"` | não | Animacao aplicada ao placeholder. |
| `width` | `number \| string` | não | Largura do placeholder. |
| `height` | `number \| string` | não | Altura do placeholder. |
| `size` | `number \| string` | não | Tamanho unico para placeholders quadrados ou circulares. |
| `borderRadius` | `number \| string` | não | Raio de borda customizado. |

## Tags
feedback, loading, placeholder, skeleton, loading-state, shape-variants, animation, size-control, loading placeholder, content shimmer, loading block
