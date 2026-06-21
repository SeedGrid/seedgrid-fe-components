# SgTextEditor

Editor de texto rico para conteudo formatado, comentarios elaborados e edicao textual com recursos visuais.

## Quando usar
- Conteudo formatado com negrito, listas e estrutura rica.
- Descricoes longas com semantica de rich text.
- Cenarios editoriais, comunicados e observacoes elaboradas.

## Quando evitar
- Campos curtos ou texto simples; nesses casos prefira SgInputText ou SgInputTextArea.
- Dados estruturados, numericos ou temporais.
- Inputs de autenticacao ou selecao.

## Composição
- Combinar com SgButton para salvar e publicar conteudo.
- Usar em paineis de edicao de conteudo e CMS.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | não | Identificador unico do editor. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `value` | `string` | não | Conteudo atual do editor. |
| `readOnly` | `boolean` | não | Impede edicao do conteudo. |
| `placeholder` | `string` | não | Texto de ajuda inicial. |
| `height` | `number \| string` | não | Altura do editor. |
| `onChange` | `(value: string) => void` | não | Callback de mudanca do conteudo. |
| `onSave` | `(meta: SgTextEditorSaveMeta) => void` | não | Callback de persistencia do conteudo. |

## Tags
form, rich-text, editor, content, html, formatted-content, toolbar, upload-hooks, save-metadata, text editor, rich text editor, wysiwyg, formatted text
