# SgCarousel

Componente de navegacao sequencial para colecoes visuais com autoplay, navegadores e indicadores.

## Quando usar
- Exibir galerias, destaques, banners e colecoes navegaveis por deslize.
- Rotacionar conteudo visual ou promocional em espacos limitados.
- Apresentar grupos de cards ou imagens em navegacao sequencial.

## Quando evitar
- Listas completas sempre visiveis; nesses casos prefira grid ou stack.
- Navegacao hierarquica de paginas.
- Conteudo de formulario e captura de dados.

## Composição
- Usar com SgCard e SgBadge para destaque de itens visuais.
- Combinar com SgScreen e SgPanel em landing pages e dashboards.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `items` | `ReactNode[]` | sim | Colecao de slides renderizados. |
| `numVisible` | `number` | não | Quantidade de itens visiveis simultaneamente. |
| `numScroll` | `number` | não | Quantidade de itens avancados por interacao. |
| `orientation` | `"horizontal" \| "vertical"` | não | Orientacao do fluxo do carousel. |
| `circular` | `boolean` | não | Permite loop continuo dos itens. |
| `autoPlay` | `boolean` | não | Ativa reproducao automatica do carousel. |
| `showIndicators` | `boolean` | não | Exibe indicadores de pagina. |

## Tags
layout, carousel, slider, gallery, sequential-navigation, autoplay, indicators, orientation, circular-loop, gallery slider, content rotator
