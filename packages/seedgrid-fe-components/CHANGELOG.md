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
  `validation={(v) => v !== null && v >= 1000 ? null : "Minimo 1000"}`. Vazio tambem chama `validation`: recebe `0` (padrao) ou `null` (com `emptyValueIsNull`);
  `onValidation` segue `(message: string | null) => void`.

### SgInputDateTime: modo do valor (`valueMode`) — BREAKING no padrao

- Nova prop `valueMode`: `"local"` (padrao, `2026-01-15T10:30`), `"utc"` (`2026-01-15T13:30:00Z`) ou `"offset"`
  (`2026-01-15T10:30:00-03:00`, com o deslocamento do `timeZone`). Vale para o primeiro argumento de `onChange` e para o valor
  gravado no formulario (`control`); `value`, `defaultValue`, `defaultValues` e `setValue` aceitam qualquer um dos formatos
  (texto sem fuso e o relogio do proprio campo, no `timeZone`). `timeZone` continua: `local` (dispositivo), `UTC`, `+03:00` ou IANA.
- **Mudanca que quebra:** antes o primeiro argumento de `onChange` era sempre o instante UTC com milissegundos
  (`2026-11-03T17:30:00.000Z`); agora o padrao e `local`. Para manter o instante UTC use `valueMode="utc"` (sem milissegundos).
- Com `register`, `utc`/`offset` convertem so o que e digitado; para atribuir por codigo use `control`.

