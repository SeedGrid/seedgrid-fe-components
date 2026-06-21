# SgPanel

Container visual e estrutural para agrupamento de conteudo, composicao de secoes e cenarios com dock, padding e scroll.

## Quando usar
- Agrupar visualmente conteudo relacionado em secoes ou blocos de formulario.
- Estruturar layouts com dock, areas laterais, cabecalho e rodape.
- Destacar conteudo ou criar containers com scroll controlado.

## Quando evitar
- Executar acoes; nesses casos prefira SgButton.
- Capturar dados; nesses casos prefira componentes de input.
- Substituir navegacao especializada; nesses casos prefira componentes de menu e layout dedicados.

## Composição
- Usar como container para campos como SgInputText.
- Combinar com SgButton em rodapes de secao ou areas de acao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `align` | `"top" \| "left" \| "right" \| "bottom" \| "client"` | não | Posicionamento relativo ao container pai em cenarios de dock. |
| `width` | `number \| string` | não | Largura do painel quando dockado ou usado em composicoes controladas. |
| `height` | `number \| string` | não | Altura do painel quando dockado ou usado em composicoes controladas. |
| `borderStyle` | `"none" \| "solid" \| "dashed"` | não | Estilo visual da borda do container. |
| `padding` | `number \| string` | não | Espacamento externo do painel em relacao ao slot recebido do pai. |
| `contentPadding` | `number \| string` | não | Espacamento interno entre a borda e o conteudo. |
| `scrollable` | `boolean \| "auto" \| "x" \| "y"` | não | Habilita scroll apenas quando desejado. |
| `scrollbarGutter` | `boolean` | não | Reserva espaco visual para scrollbar. |
| `children` | `ReactNode` | não | Conteudo livre ou outros elementos de layout aninhados. |

## Tags
layout, container, panel, group, grouping, dock-layout, scrollable, grid-span, section, group box, content block
