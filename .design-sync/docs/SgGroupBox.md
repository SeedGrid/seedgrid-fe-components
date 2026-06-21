# SgGroupBox

Container simples com titulo visual para agrupar campos e conteudos relacionados em uma secao delimitada.

## Quando usar
- Agrupar campos relacionados em formularios pequenos e medios.
- Criar secoes com titulo visivel em configuracoes, cadastro e dados pessoais.
- Delimitar visualmente conteudo sem adicionar comportamento complexo.

## Quando evitar
- Criar hierarquias colapsaveis; nesses casos prefira SgAccordion.
- Blocos com destaque visual mais rico; nesses casos prefira SgCard.
- Acoes e inputs isolados; nesses casos prefira componentes especificos.

## Composição
- Usar com componentes sgInput* para organizar formularios em secoes.
- Combinar com SgButton no rodape quando a secao tiver acoes locais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | sim | Titulo exibido no topo da secao agrupada. |
| `children` | `ReactNode` | sim | Conteudo agrupado dentro do fieldset. |
| `width` | `number \| string` | não | Largura do bloco de agrupamento. |
| `height` | `number \| string` | não | Altura do bloco de agrupamento. |

## Tags
layout, group, fieldset, form-section, container, grouping, titled-section, form-block, sized-container, group box, form group, titled section
