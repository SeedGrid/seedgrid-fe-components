# SgPageControlPage

Declaracao de uma pagina individual dentro de um SgPageControl, com titulo, hint, icone e conteudo associado.

## Quando usar
- Declarar paginas internas de um PageControl com conteudo associado.
- Separar secoes navegaveis em abas ou etapas de configuracao.
- Modelar paineis de conteudo com titulo, hint e icone na navegacao superior.

## Quando evitar
- Fluxos com botoes de navegacao e validacao sequencial; nesses casos prefira WizardPage.
- Containers independentes sem controle de abas; nesses casos prefira Panel ou Card.
- Menus soltos fora de PageControl.

## Composição
- Usar sempre como filho de SgPageControl.
- Combinar com icones e hints para melhorar a navegacao entre secoes.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | não | Identificador estavel da pagina. |
| `title` | `ReactNode` | sim | Titulo exibido na aba da pagina. |
| `hint` | `string` | não | Descricao curta associada a aba. |
| `icon` | `ReactNode` | não | Icone opcional da aba. |
| `hidden` | `boolean` | não | Oculta a pagina sem remove-la da estrutura. |
| `disabled` | `boolean` | não | Desabilita a selecao da pagina. |
| `children` | `ReactNode` | sim | Conteudo exibido no painel desta pagina. |

## Tags
navigation, tabs, page, step, panel, tab-page, title, hint, icon, mount-control, tab page, page control page, navigation page, tab panel
