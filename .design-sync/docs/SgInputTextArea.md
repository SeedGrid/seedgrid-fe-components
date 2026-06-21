# SgInputTextArea

Campo textual multi-linha para descricoes, observacoes e conteudos longos com suporte a contagem e validacao.

## Quando usar
- Captura de descricoes, observacoes, notas e comentarios longos.
- Campos multi-linha em formularios CRUD e fluxos de atendimento.
- Textos livres que exigem mais espaco e semantica de conteudo longo.

## Quando evitar
- Campos curtos como nome, titulo ou codigo; nesses casos prefira SgInputText.
- Valores numericos ou monetarios; nesses casos prefira SgInputNumber ou SgInputCurrency.
- Datas e horarios; nesses casos prefira SgInputDate.

## Composição
- Combinar com SgButton em formularios de cadastro ou atendimento.
- Usar dentro de SgPanel para blocos de observacoes e descricoes.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo multi-linha. |
| `name` | `string` | não | Nome do campo para formularios. |
| `label` | `string` | não | Rotulo principal exibido ao usuario. |
| `placeholder` | `string` | não | Texto de apoio para orientar o conteudo esperado. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `rows` | `number` | não | Quantidade inicial de linhas visiveis. |
| `maxLength` | `number` | não | Limite maximo de caracteres. |
| `minLength` | `number` | não | Limite minimo de caracteres. |
| `onChange` | `(value: string) => void` | não | Callback com o texto multi-linha atual. |

## Tags
form, textarea, long-text, notes, rhf, controlled, multiline, validation, char-counter, word-count, long text field, notes field, description input
