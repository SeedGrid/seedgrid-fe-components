# Changelog

## Nao publicado

### BREAKING: SgInputNumber e SgInputCurrency emitem sempre numero

- `onChange`, o valor gravado no formulario (react-hook-form) e `onExternalChange` agora entregam `number`
  (antes entregavam texto, como `"37.00"`). Com `emptyValueIsNull`, campo vazio entrega `null`; sem ele, entrega `0`.
- `defaultValues`, `setValue`, `reset` e a prop `value` continuam aceitando numero **ou** texto (`"37.5"`).
- A prop `emptyValue` (`"null" | "zero"`) foi **removida**, sem alias. Use `emptyValueIsNull` (boolean, padrao `false`):
  `emptyValue="null"` vira `emptyValueIsNull`; `emptyValue="zero"` (padrao) nao precisa de prop.
- O numero e um `double`. Valores com muitas casas decimais nao sao preservados de forma exata
  (uma prop explicita para texto fica para uma versao futura).
- Backends que esperavam texto devem converter ou aceitar numero no JSON.
- `validation` de SgInputNumber/SgInputCurrency agora recebe `number | null` (antes `string`):
  `validation={(v) => v !== null && v >= 1000 ? null : "Minimo 1000"}`. Vazio (0) nao chama `validation`;
  `null` so chega com `emptyValueIsNull`. `onValidation` segue `(message: string | null) => void`.
