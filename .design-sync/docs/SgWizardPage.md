# SgWizardPage

Pagina individual dentro de um wizard, com titulo, icone e conteudo associado a uma etapa.

## Quando usar
- Declarar uma etapa individual dentro de um wizard.
- Separar conteudo, validacao e rotulos por passo em fluxos guiados.
- Modelar passos com icone e titulo em journeys multi-etapas.

## Quando evitar
- Abas independentes; nesses casos prefira PageControlPage.
- Containers soltos fora de um Wizard.
- Blocos de layout sem sequencia navegacional.

## Composição
- Usar sempre como filho de SgWizard.
- Combinar com inputs e secoes de resumo para organizar cada etapa.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | não | Titulo exibido no stepper do wizard. |
| `icon` | `ReactNode` | não | Icone opcional exibido quando o wizard usa stepper por icones. |
| `children` | `ReactNode` | sim | Conteudo da etapa. |
| `className` | `string` | não | Classes adicionais da etapa. |

## Tags
navigation, wizard, step, page, form-step, step-content, title, icon, wizard-children, wizard page, wizard step, step page, form step
