# useSgClockThemeResolver

Hook para resolver tema do SgClock dinamicamente. Permite consultar temas registrados, alternar entre eles e acessar a configuracao current.

## Quando usar
- Alternar dinamicamente entre temas de relogio.
- Implementar modo claro/escuro personalizado para SgClock.
- Consultar temas registrados e renderizar seletor de tema.

## Quando evitar
- Estilizar componentes nao-clock; use SgClockThemeProvider ou estilo CSS direto.
- Mutacao manual de registro de temas; use registerTheme() em vez disso.

## Composição
- Usar dentro de SgClockThemeProvider para acesso a resolucao de temas.
- Combinar com SgClock para renderizar relógios com temas dinamicos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.resolveMode` | `SgClockThemeResolveMode` | não | Modo de resolucao do tema (auto, light, dark, custom). |
| `returns.resolveTheme` | `(themeId: string) => SgClockTheme \| null` | não | Funcao para resolver um tema pelo ID. |
| `returns.currentTheme` | `SgClockTheme \| null` | não | Tema atualmente ativo. |
| `returns.setResolveMode` | `(mode: SgClockThemeResolveMode) => void` | não | Alterar modo de resolucao do tema. |

## Tags
hook, clock, theme, resolver, theme-resolution, dynamic-theme-switching, theme-registry-access, theme resolver, clock theme, theme switcher
