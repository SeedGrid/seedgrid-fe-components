# Changelog

## Nao publicado

### SgNotificationBell: acao ao abrir por tipo de notificacao (P186)

- Novo registro de acoes por tipo: `registerNotificationAction(type, { label?, icon?, run })` (devolve a funcao que desfaz), `unregisterNotificationAction(type)` e `getNotificationAction(type)`. Cada modulo registra os tipos que emite; o sino nao conhece tipo nenhum e o host nao precisa de `switch`.
- `SgNotification` ganha `actionable?: boolean` (o backend declara que ESTA notificacao ainda e abrivel). O item so e clicavel com `actionable=true` E acao registrada; sem o campo ou com `false` e informativa (o clique so marca como lida). `actionable=true` sem acao registrada fica informativa e avisa uma vez por tipo no console.
- Nova prop `actions` (acoes por tipo so da instancia, com prioridade sobre o registro). `run` recebe a notificacao (o `payload` so traz identificadores); se lancar erro, o painel fica aberto com a mensagem do erro (novas chaves i18n `bell.openFailed` e `bell.openFailedNoReason`).
- `onOpen` continua como valvula de escape (roda depois da acao do tipo). `types[tipo].onOpen` continua funcionando.

## 2026.11.14 - 2026-11-17

### BREAKING: SgInputNumber e SgInputCurrency sem `required` e `requiredMessage`

- As props `required` e `requiredMessage` foram **removidas** de `SgInputNumber` e `SgInputCurrency` (tipos, asterisco no rotulo e validacao). Para exigir um valor use
  `minValue` e `minValueMessage` (ex.: `minValue={0.01} minValueMessage="Informe um valor maior que zero."`).
- O zero passa a contar como valor: `minValue` e `maxValue` validam tambem o `0` (antes o zero era tratado como vazio e pulava os limites).
  Com `emptyValueIsNull`, o campo vazio de verdade (`null`) continua sem erro de limite.
- `Ctrl+A` seguido de digito substitui o valor; `Backspace`/`Delete` com tudo selecionado apaga tudo.
- Com `register`, o valor inicial vindo do formulario e formatado no idioma (`"0.00"` aparece como `0,00` em pt-BR em `SgInputCurrency`).
- A mensagem padrao de `minValue`/`maxValue` usa o separador decimal do idioma (pt-BR `0,01`; en-US `0.01`).

### SgMultiSelect e SgMultiSelectChips: `requiredMessage` e obrigatorio fora de formulario

- Nova prop `requiredMessage` (mensagem para ausencia de valor). Os chips mostram o erro de `required` tambem fora de um formulario.

### SgButton: `onClick` aceita Promise com loading automatico

- `onClick` pode devolver uma `Promise`: enquanto pendente o botao fica em `loading` (`aria-busy`), cliques sao ignorados e o erro e relancado.
  `onClick` sincrono continua igual.

### Arraste do cartao: `draggable` com tres estados em SgCard, SgClock e SgCalendar

- `SgClock` e `SgCalendar` ganham a prop `draggable` no topo (`undefined` = automatico, arrasta a partir de 640 px; `true` = sempre; `false` = nunca), com prioridade sobre `cardProps.draggable`.
  `SgCard` avulso continua nao arrastavel por padrao. Sem `id`/`dragPersistKey` o `SgClock` nao persiste a posicao, e posicao salva fora da tela e descartada.

### Campos mascarados: detalhes

- Valor externo (`value`, `defaultValue`, `setValue`) maior que a mascara e cortado nela, como ao digitar ou colar; colar telefone com DDI `+55` tira o `55`.
  As secoes seguintes (mascara, numero sempre numero, `valueMode`) fazem parte do mesmo lote.

### Tema (`@seedgrid/fe-theme`): cor de destaque com contraste garantido

- O tema escolhe, a partir da cor semente, o tom que garante contraste minimo de 4,5:1 (claro escurece, escuro clareia so o que falha): texto sobre fundo, texto do contorno
  (tom 600), anel de foco solido e rotulos. Fundo cheio de botao usa a cor pura da semente (`--primary-fill`/`--destructive-fill`). No tema claro, borda, anel e rotulo dos campos usam a cor pura
  da semente. No editor de tema do showcase, a cor livre avisa quando o contraste e baixo e o seletor tem 7 cores predefinidas (o amarelo saiu).

### Tema: vermelho de erro com texto branco legivel (selo e avatar `danger`)

- O numero do selo do `SgNotificationBell` (e o texto de `SgBadge`/`SgAvatar` com `severity="danger"`) saia PRETO sobre o vermelho (o branco dava ~3,8:1 e o tema caia no preto). Agora o
  `--destructive` escurece so o necessario para o BRANCO passar em 4,5:1 (claro `#E7200D`, 4,56:1; escuro `#E62514`, 4,53:1) e o texto fica branco, nos dois modos e com qualquer vermelho
  customizado (`error`). O degrau `--sg-error-500` acompanha. O botao `danger` (fundo `--sg-error-fill`) nao muda.

### Tema: botao `danger` e cor `info` com texto branco

- O botao `danger` no tema escuro (antes texto preto) e o botao, o selo e o avatar `info` (claro e escuro) passam a ter texto BRANCO com contraste >= 4,5:1. O fundo escurece so o necessario
  (`darkenForWhiteText`), com a mesma cor nos dois temas; hover e active escurecem a partir dele. Alerta e link nao mudam.

### Showcase

- Aviso "gire o aparelho" com o celular deitado (paisagem e altura menor que 500 px), nos 5 idiomas.

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

