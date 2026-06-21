# SgAvatar

Representacao visual compacta de pessoa, usuario ou entidade por imagem, iniciais, icone ou fallback.

## Quando usar
- Representar usuarios, pessoas e entidades em listas, cards e cabecalhos.
- Exibir imagem de perfil, iniciais ou fallback visual de identidade.
- Agrupar membros de equipe ou participantes com avatar group.

## Quando evitar
- Status textuais ou contadores; nesses casos prefira SgBadge.
- Acoes clicaveis principais; nesses casos prefira botao.
- Conteudo longo ou secao de layout.

## Composição
- Usar com SgBadge para status de usuario e com SgCard em cabecalhos.
- Combinar com SgMenu e breadcrumbs de perfil quando houver contexto de usuario.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `src` | `string` | não | URL da imagem principal do avatar. |
| `alt` | `string` | não | Texto alternativo da imagem do avatar. |
| `label` | `ReactNode` | não | Conteudo textual usado como iniciais ou identificacao visual. |
| `fallback` | `ReactNode` | não | Conteudo de fallback quando nao ha imagem. |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | não | Escala visual do avatar. |
| `shape` | `"circle" \| "square"` | não | Forma visual do avatar. |
| `severity` | `"primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info" \| "neutral" \| "custom"` | não | Tom visual do avatar quando nao ha imagem. |

## Tags
feedback, avatar, profile, identity, user, image-avatar, fallback, initials, grouping, severity, profile image, user avatar, identity badge
