# SgInputPostalCode

Campo especializado para CEP e codigos postais com suporte a multiplos paises, mascaras e consulta opcional ao ViaCEP.

## Quando usar
- Captura de CEP ou codigo postal em formularios de endereco.
- Campos de localizacao com comportamento dependente do pais.
- Fluxos brasileiros com enriquecimento via ViaCEP.

## Quando evitar
- Texto livre de endereco completo; nesses casos use campo textual complementar.
- Documentos pessoais, telefone ou email.
- Valores monetarios, datas ou selecoes estruturadas.

## Composição
- Combinar com SgInputText para logradouro e complemento.
- Usar com SgPanel em blocos de endereco.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `country` | `"BR" \| "PT" \| "US" \| "ES" \| "UY" \| "AR" \| "PY"` | não | Pais usado para mascara e validacao. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `validateWithViaCep` | `boolean` | não | Ativa consulta ao ViaCEP para BR. |
| `lengthMessage` | `string` | não | Mensagem para tamanho invalido. |
| `invalidMessage` | `string` | não | Mensagem para codigo invalido. |
| `onViaCepResult` | `(data: ViaCepResponse) => void` | não | Callback com resposta da consulta ViaCEP. |

## Tags
form, postal-code, cep, address, rhf, mask, validation, country-aware, viacep, clearable, postal code, zip code, zipcode, address code
