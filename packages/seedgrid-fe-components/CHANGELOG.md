# Changelog

## Nao publicado

### BREAKING: campos com mascara entregam sempre o valor mascarado

- `SgInputCPF`, `SgInputCNPJ`, `SgInputCPFCNPJ`, `SgInputPhone` e `SgInputPostalCode` entregam o valor **mascarado**
  (`529.982.247-25`, `(11) 98765-4321`, `01310-100`) em qualquer caminho: `onChange` standalone, `control` (Controller) e `register`,
  tanto digitado quanto setado por codigo (`defaultValues`, `setValue`, `reset`, `value`). Antes, `control` entregava o texto cru.
- A entrada aceita texto cru ou ja mascarado e converte; nao ha prop nova.
- Quem precisa so dos digitos deve limpar ao usar: `value.replace(/\D/g, "")`.
- Limites conhecidos: com `control`, se `defaultValues` vier cru o campo normaliza para mascarado e o formulario passa a constar como alterado (dirty);
  com `register`, `reset({ campo: cru })` nao atualiza o DOM de campos nao controlados (comportamento do react-hook-form), mascare o valor ao resetar.

### SgInputNumber e SgInputCurrency: texto posto por codigo vira numero no formulario

- `defaultValues`, `setValue` e `initialValue` com texto (`"37.5"`) passam a ser gravados no formulario como `number` (`37.5`) logo na montagem/atribuicao, nao so apos a primeira edicao. No React isso vale com `control`; o campo normaliza e o formulario pode constar como alterado (dirty).

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

