# SgAvatarGroup

Agrupamento visual de avatares com sobreposicao, limite de itens e contador de participantes restantes.

## Quando usar
- Exibir participantes, membros de equipe e colaboradores em cabecalhos e cards.
- Representar grupos com limite visual e contador de itens adicionais.
- Mostrar ownership, revisores ou pessoas associadas a uma entidade.

## Quando evitar
- Uma unica identidade; nesses casos prefira SgAvatar.
- Listas detalhadas de usuarios com texto e metadata; nesses casos prefira lista ou tabela.
- Status textuais e contadores puros; nesses casos prefira SgBadge.

## Composição
- Usar com SgAvatar em listas, cards e cabecalhos de colaboracao.
- Combinar com Badge ou Card quando houver destaque de contagem ou ownership.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | sim | Lista de avatares exibidos no agrupamento. |
| `max` | `number` | não | Quantidade maxima de avatares visiveis antes do contador de overflow. |
| `total` | `number` | não | Quantidade total de participantes para calculo do overflow. |
| `overlap` | `"none" \| "sm" \| "md" \| "lg"` | não | Nivel de sobreposicao entre os avatares. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | não | Escala aplicada aos avatares do grupo. |
| `shape` | `"circle" \| "square"` | não | Forma visual aplicada ao grupo de avatares. |

## Tags
feedback, avatar, group, participants, team, avatar-stack, overlap, max-limit, overflow-counter, team-display, avatar group, team avatars, participant stack, member avatars
