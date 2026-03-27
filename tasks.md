
### TASKS SHOWCASE 

### Criação dos arquivos de exemplo:
o que vai ser a tarefa:
    - dentro da pasta do showcase de cada componente, criar uma subpasta samples, nessa pasta, colocar os exemplos ex: apps\showcase\src\app\components\digits\sg-discard-digit\samples, apps\showcase\src\app\components\sg-input-text\samples, etc
    - os arquivos de dos exemplos devem ter o nome do exemplo no showcase com extensao .tsx.sample ex: no caso do sgInputText "basico( RHF ).tsx.sample", "obrigatorio.tsx.sample", "controlado(caso necessario).tsx.sample", "contador de caracteres.tsx.sample", etc 
    - os exemplos comuns continuam no padrão `.tsx.sample`
    - quando a página tiver `SgPlayground`, extrair o código interativo para um arquivo dedicado no padrão `.tsx.playground`
    - utilizar o esbuild para validar os codigos se estão compiláveis, lembre-se que o usuário desenvolvedor vai copiar e colar esses codigos e os mesmos devem funcionar 


### Checklist de acompanhamento

#### Inputs
[x] SgInputText: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico (RHF)
    [x] 2) Obrigatório
    [x] 3) Controlado (caso necessário)
    [x] 4) Contador de caracteres
    [x] 5) Tamanho mínimo
    [x] 6) Mínimo de palavras
    [x] 7) Validação customizada
    [x] 8) Ícone prefixo
    [x] 9) Prefixo e sufixo
    [x] 10) Botões de ícone
    [x] 11) Variações visuais
    [x] 12) Sem botão limpar
    [x] 13) Largura e borda
    [x] 14) Desabilitado e somente leitura
    [x] 15) Erro externo
    [x] 16) Standalone (form completo)
    [x] 17) Eventos (standalone)
    [x] 18) Posição do rótulo
    [x] 19) Elevação

[x] SgInputTextArea: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Controlado
    [x] 4) Contador
    [x] 5) Tamanho mínimo
    [x] 6) Mínimo de palavras
    [x] 7) Mínimo de linhas
    [x] 8) Validação customizada
    [x] 9) Tamanho e linhas
    [x] 10) Ícone prefixo
    [x] 11) Variações visuais
    [x] 12) Sem botão limpar
    [x] 13) Largura e borda
    [x] 14) Desabilitado e somente leitura
    [x] 15) Erro externo
    [x] 16) Eventos
    [x] 17) Posição do rótulo
    [x] 18) Playground
[x] SgInputPassword: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Validação
    [x] 4) Variações visuais
    [x] 5) Eventos
    [x] 6) Posição do rótulo
    [x] 7) Playground
[x] SgInputOTP: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Máscara customizada
    [x] 3) Colagem + onComplete
    [x] 4) Acesso por ref
    [x] 5) Playground
- SgInputSelect: página própria do showcase não encontrada; item listado no índice, mas sem rota dedicada em `apps/showcase/src/app/components`
    - pendente de decisão: criar página dedicada ou remover do índice atual
[x] SgInputDate: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Intervalo
    [x] 3) Data fixa
    [x] 4) Posição do rótulo
    [x] 5) Playground
[x] SgInputBirthDate: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Intervalo
    [x] 4) Posição do rótulo
    [x] 5) Playground
[x] SgToggleSwitch: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Com ícones (on/off)
    [x] 3) Remote (simulação de update)
    [x] 4) Controlado externamente + captura do valor
    [x] 5) React Hook Form
    [x] 6) Estados Disabled / ReadOnly
    [x] 7) Playground
[x] SgInputEmail: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Bloqueados
    [x] 5) Validação customizada
    [x] 6) Lista de bloqueados
    [x] 7) JSON
    [x] 8) Variações visuais
    [x] 9) Sem botão limpar
    [x] 10) Largura e borda
    [x] 11) Desabilitado
    [x] 12) Eventos
    [x] 13) Posição do rótulo
    [x] 14) Playground
[x] SgInputCPF: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Tamanho
    [x] 4) Inválido
    [x] 5) Validação customizada
    [x] 6) Variações visuais
    [x] 7) Sem botão limpar
    [x] 8) Largura e borda
    [x] 9) Desabilitado
    [x] 10) Eventos
    [x] 11) Posição do rótulo
    [x] 12) Playground
[x] SgInputCNPJ: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Alfanumérico
    [x] 3) Lista alfanumérica
    [x] 4) CNPJ público
    [x] 5) Obrigatório
    [x] 6) Tamanho
    [x] 7) Inválido
    [x] 8) Validação customizada
    [x] 9) Variações visuais
    [x] 10) Sem botão limpar
    [x] 11) Largura e borda
    [x] 12) Desabilitado
    [x] 13) Eventos
    [x] 14) Posição do rótulo
    [x] 15) Playground
[x] SgInputCPFCNPJ: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Validação customizada
    [x] 5) Alfanumérico
    [x] 6) Lista alfanumérica
    [x] 7) Variações visuais
    [x] 8) Sem botão limpar
    [x] 9) Largura e borda
    [x] 10) Desabilitado
    [x] 11) Eventos
    [x] 12) Posição do rótulo
    [x] 13) Playground
[x] SgInputPostalCode: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Países
    [x] 3) Obrigatório
    [x] 4) Controlado
    [x] 5) Validação customizada
    [x] 6) ViaCEP
    [x] 7) Ícone prefixo
    [x] 8) Prefixo e sufixo
    [x] 9) Botões de ícone
    [x] 10) Variações visuais
    [x] 11) Largura e borda
    [x] 12) Desabilitado e somente leitura
    [x] 13) Standalone
    [x] 14) Eventos
    [x] 15) Posição do rótulo
    [x] 16) Playground
[x] SgInputPhone: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Validação customizada
    [x] 5) Variações visuais
    [x] 6) Sem botão limpar
    [x] 7) Largura e borda
    [x] 8) Desabilitado
    [x] 9) Eventos
    [x] 10) Posição do rótulo
    [x] 11) Playground
[x] SgAutocomplete: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Customizado
    [x] 3) Agrupado
    [x] 4) Dropdown
    [x] 5) Footer
    [x] 6) Tamanho mínimo
    [x] 7) Border radius
    [x] 8) Playground
[x] SgCombobox: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico com lista de objetos
    [x] 2) Controlado por value
    [x] 3) Source async + custom render
    [x] 4) Border radius
    [x] 5) Playground
[x] SgSlider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Controle externo
    [x] 3) Step e width
    [x] 4) className, ariaLabel e disabled
    [x] 5) inputProps
    [x] 6) Playground
[x] SgStepperInput: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Controle externo
    [x] 3) Read-only e disabled
    [x] 4) Playground
[ ] SgTextEditor: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Sem CSS
    [ ] 3) Desabilitado
    [ ] 4) Border radius
    [ ] 5) Playground
[ ] SgDatatable: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Filtros
    [ ] 3) Seleção
    [ ] 4) Templates
    [ ] 5) Ações
    [ ] 6) Controlado
    [ ] 7) Server-side
    [ ] 8) Loading e vazio
    [ ] 9) Playground
[ ] SgInputNumber: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Obrigatório
    [ ] 3) Controlado
    [ ] 4) Validação customizada
    [ ] 5) Ícone prefixo
    [ ] 6) Prefixo e sufixo
    [ ] 7) Botões de ícone
    [ ] 8) Sem negativos
    [ ] 9) Sem decimais
    [ ] 10) Mínimo e máximo
    [ ] 11) Valor vazio
    [ ] 12) Variações visuais
    [ ] 13) Standalone
    [ ] 14) Eventos
    [ ] 15) Largura e borda
    [ ] 16) Posição do rótulo
    [ ] 17) Playground
[ ] SgInputCurrency: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Obrigatório
    [ ] 3) Controlado
    [ ] 4) Validação customizada
    [ ] 5) Moeda
    [ ] 6) Símbolo
    [ ] 7) Botões de ícone
    [ ] 8) Sem negativos
    [ ] 9) Sem decimais
    [ ] 10) Mínimo e máximo
    [ ] 11) Valor vazio
    [ ] 12) Variações visuais
    [ ] 13) Standalone
    [ ] 14) Eventos
    [ ] 15) Largura e borda
    [ ] 16) Playground

#### Layout e navegação
[ ] SgGroupBox: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Formulário
    [ ] 3) Tamanho
    [ ] 4) className
    [ ] 5) Playground
[ ] SgCard: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Leading e trailing
    [ ] 3) Colapsável
    [ ] 4) Variantes
    [ ] 5) Surface colors
    [ ] 6) Draggable + persistence
    [ ] 7) Playground
[ ] SgAccordion: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico vertical (single)
    [ ] 2) Multiple + collapsible
    [ ] 3) Horizontal
    [ ] 4) Controlado por estado
    [ ] 5) Custom items + header background
    [ ] 6) Color customization example
    [ ] 7) Playground
[ ] SgSkeleton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basic shapes
    [ ] 2) Text widths
    [ ] 3) Animation
    [ ] 4) Card placeholder
    [ ] 5) List and table
    [ ] 6) Playground
[ ] SgScreen: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Complete example
    [ ] 2) Playground
[ ] SgDockScreen: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Playground
[ ] SgMainPanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Complete example
    [ ] 2) Playground
[ ] SgPanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) align + width + height
    [ ] 2) span + rowSpan
    [ ] 3) borderStyle + padding + children
    [ ] 4) scrollable + scrollbarGutter
    [ ] 5) Combined example
    [ ] 6) Playground
[ ] SgGrid: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Columns responsivo
    [ ] 2) Auto-Fit + RowSpan
    [ ] 3) Playground
[ ] SgStack: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Column + Row
    [ ] 2) Playground
[ ] SgBadge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Variants
    [ ] 3) Sizes
    [ ] 4) Counter
    [ ] 5) Actions
    [ ] 6) Playground
[ ] SgBadgeOverlay: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Placements
    [ ] 3) Playground
[ ] SgAvatar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Shape e tamanho
    [ ] 3) Severity e cores customizadas
    [ ] 4) Avatar Group
    [ ] 5) Playground
[ ] SgBreadcrumb: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Caminho externo
    [ ] 3) Overflow
    [ ] 4) Playground
[ ] SgMenu: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Sidebar fixa
    [ ] 2) Drawer mobile
    [ ] 3) PanelMenu
    [ ] 4) Tiered
    [ ] 5) MegaMenu horizontal
    [ ] 6) MegaMenu vertical
    [ ] 7) Sidebar dockable
    [ ] 8) Playground
[ ] SgExpandablePanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Inline controlado + resize
    [ ] 2) Overlay + comportamento
    [ ] 3) defaultOpen + estilização
    [ ] 4) Acessibilidade + fade
    [ ] 5) Sem backdrop + animation none
    [ ] 6) Playground
[ ] SgDialog: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Severity
    [ ] 3) No close
    [ ] 4) Strict
    [ ] 5) Auto close
    [ ] 6) Playground
[ ] SgToolBar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) onClick assíncrono com toast
    [ ] 3) Orientação e quebra
    [ ] 4) Cores de fundo
    [ ] 5) Playground
[ ] SgDockLayout: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Playground
[ ] SgTreeView: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Icon tone
    [ ] 3) Confirm
    [ ] 4) Size
    [ ] 5) Expanded
    [ ] 6) Json checked
    [ ] 7) Playground
[ ] SgPageControl: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Controle externo
    [ ] 3) Ocultar página externamente
    [ ] 4) Com hint nas abas
    [ ] 5) Playground
[ ] SgPopup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Básico
    [ ] 2) Ícone + hint
    [ ] 3) Custom
    [ ] 4) Playground
[ ] SgPlayground: revisar se precisa pasta `samples` própria ou se fica apenas como infraestrutura

#### Ações, seleção e feedback
[ ] SgButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Icones
    [ ] 3) Severities
    [ ] 4) Elevated Buttons
    [ ] 5) Rounded Buttons
    [ ] 6) Ghost Buttons (Flat)
    [ ] 7) Outlined + Elevation
    [ ] 8) Outlined Buttons
    [ ] 9) Rounded Icon Buttons
    [ ] 10) Rounded Text Icon Buttons
    [ ] 11) Rounded and Outlined Icon Buttons
    [ ] 12) Sizes
    [ ] 13) Loading
    [ ] 14) Custom Colors
    [ ] 15) Playground
[ ] SgFloatActionButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Positions
    [ ] 2) Variants
    [ ] 3) Shapes & Sizes
    [ ] 4) Elevation
    [ ] 5) Hint
    [ ] 6) Actions - Linear Layout
    [ ] 7) Circle Layout
    [ ] 8) Semi-Circle Layout
    [ ] 9) Quarter-Circle Layout
    [ ] 10) Active Icon
    [ ] 11) Animations
    [ ] 12) Custom Color
    [ ] 13) Disabled & Loading
    [ ] 14) Drag & Drop
    [ ] 15) Playground
[ ] SgSplitButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Severidades
    [ ] 3) Outlined
    [ ] 4) Ghost
    [ ] 5) Elevated
    [ ] 6) Tamanhos
    [ ] 7) Com icones
    [ ] 8) Separadores de menu
    [ ] 9) Disabled
    [ ] 10) Loading
    [ ] 11) Itens desabilitados
    [ ] 12) Playground
[ ] SgCheckboxGroup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Orientation Horizontal
    [ ] 3) Com Icones
    [ ] 4) Apenas Icones (Icon Only)
    [ ] 5) Selecao Controlada
    [ ] 6) Controle Externo (setValue/getValue)
    [ ] 7) Com Opcao Desabilitada
    [ ] 8) Grupo Disabled
    [ ] 9) Read-only
    [ ] 10) Obrigatorio com Validacao
    [ ] 11) Horizontal com Icones Coloridos
    [ ] 12) Selection Style Highlight (Lista)
    [ ] 13) Com GroupBox Customizado
    [ ] 14) React Hook Form - Register
    [ ] 15) Playground Interativo
    [ ] 16) Check All (showCheckAll)
    [ ] 17) Checked inicial no source
    [ ] 18) Ref imperativo (getChecked / checkAll / clearAll)
[ ] SgRadioGroup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Orientation Horizontal
    [ ] 3) Com Icones
    [ ] 4) Apenas Icones (Icon Only)
    [ ] 5) Selecao Controlada
    [ ] 6) Controle Externo (setValue/getValue)
    [ ] 7) Com Opcao Desabilitada
    [ ] 8) Grupo Disabled
    [ ] 9) Read-only
    [ ] 10) Obrigatorio com Validacao
    [ ] 11) Horizontal com Icones Coloridos
    [ ] 12) Selection Style Highlight (Lista)
    [ ] 13) Com GroupBox Customizado
    [ ] 14) React Hook Form - Register
    [ ] 15) Playground Interativo
[ ] SgOrderList: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (controles internos)
    [ ] 2) Selecao multipla + controles externos (ref)
    [ ] 3) Drag and drop sem botoes
    [ ] 4) Item template customizado e item desabilitado
    [ ] 5) Ordem controlada por estado externo
    [ ] 6) Playground interativo
[ ] SgPickList: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Com Filtros
    [ ] 3) Somente transferencia (sem ordenacao)
    [ ] 4) Reordenacao com controles de lista
    [ ] 5) Controles externos por ref
    [ ] 6) Item template customizado
    [ ] 7) Playground interativo
[ ] SgRating: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Meia estrela + tooltip
    [ ] 3) Read-only e desabilitado
    [ ] 4) Tamanhos e quantidade de estrelas
    [ ] 5) Cores e icones customizados
    [ ] 6) Callbacks
    [ ] 7) React Hook Form
    [ ] 8) Campo obrigatorio
    [ ] 9) Playground
[ ] SgToastHost: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) O que e o SgToastHost
    [ ] 2) Base setup
    [ ] 3) Prioridade: layout vs pagina
    [ ] 4) Toast types
    [ ] 5) Loading by id (update same toast)
    [ ] 6) toast.promise
    [ ] 7) Actions and custom toast
    [ ] 8) Options per toast
    [ ] 9) Transparency
    [ ] 10) Custom Colors
    [ ] 11) Posicionamento
    [ ] 12) Playground
[ ] SgToaster: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Base setup
    [ ] 2) Toast types
    [ ] 3) Loading by id (update same toast)
    [ ] 4) toast.promise
    [ ] 5) Actions and custom toast
    [ ] 6) Options per toast
    [ ] 7) Transparency
    [ ] 8) Custom Colors
    [ ] 9) Playground
[ ] SgConfirmationDialog: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Icone a esquerda
    [ ] 3) Icone no topo
    [ ] 4) Botoes customizados
    [ ] 5) Surface customizada (customColor + elevation)
    [ ] 6) Playground interativo

#### Digits
[ ] SgFlipDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) Letras (A-Z)
    [ ] 3) Variacoes de tamanho
    [ ] 4) Sequencia estilo relogio
    [ ] 5) Auto increment
    [ ] 6) Playground
[ ] SgFadeDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) Letras (A-Z)
    [ ] 3) Cores customizadas
    [ ] 4) Auto increment
    [ ] 5) Sequencia estilo relogio
    [ ] 6) Tamanhos
    [ ] 7) Playground
[ ] SgRoller3DDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) 2-digit padded value
    [ ] 3) Letras (A-Z)
    [ ] 4) Animacao de nomes
    [ ] 5) Variacoes de tamanho
    [ ] 6) Playground
[ ] SgMatrixDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) Texto matricial
    [ ] 3) Variacoes de color/backgroundColor
    [ ] 4) Escala da matriz
    [ ] 5) Playground
[ ] SgNeonDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Texto em neon
    [ ] 3) Neon script (referencia visual)
    [ ] 4) Variacoes de color/background/shadow
    [ ] 5) Escala e leitura
    [ ] 6) Playground
[ ] SgDiscardDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico
    [ ] 2) Folhas sequenciais
    [ ] 3) Variacoes de papel
    [ ] 4) Fontes
    [ ] 5) Auto descarte
    [ ] 6) Paginacao imperativa (ref)
    [ ] 7) Playground
[ ] SgSegmentDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) Composicao estilo relogio
    [ ] 3) Tamanhos
    [ ] 4) Cores
    [ ] 5) Playground
[ ] SgSevenSegmentDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (0-9)
    [ ] 2) Hexadecimal (0-9 A-F)
    [ ] 3) Temas de cor
    [ ] 4) Tamanho e espessura
    [ ] 5) Composicao estilo relogio
    [ ] 6) Playground

#### Gadgets
[ ] SgClock: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Analogico
    [ ] 2) Tema inline (sem provider)
    [ ] 3) Digital
    [ ] 4) Roller 3D
    [ ] 5) Flip
    [ ] 6) Segment
    [ ] 7) Seven Segment
    [ ] 8) Fade
    [ ] 9) Matrix
    [ ] 10) Neon
    [ ] 11) Discard
    [ ] 12) Timezone
    [ ] 13) Playground
[ ] SgCalendar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Basico (mes atual)
    [ ] 2) Selecionado controlado + limite de datas
    [ ] 3) Locale + multiplos meses
    [ ] 4) Playground
[ ] SgStringAnimator: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Roller 3D - nomes (left-aligned)
    [ ] 2) Roller 3D - numeros (right-aligned)
    [ ] 3) Estilo Flip
    [ ] 4) Estilo Neon
    [ ] 5) Estilo Fade
    [ ] 6) Estilo Discard
    [ ] 7) Estilo Matrix
    [ ] 8) autoStart - animacao automatica
    [ ] 9) Velocidades
    [ ] 10) Playground
[ ] SgQRCode: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Interactive example
    [ ] 2) Playground
[ ] SgLinearGauge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Default (Horizontal)
    [ ] 2) Vertical + Multi Pointers
    [ ] 3) Playground
[ ] SgRadialGauge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Speedometer Style
    [ ] 2) Thicker Ring (ringThickness)
    [ ] 3) Axis Inversed + Angulos Custom
    [ ] 4) Multi Pointers + Annotation
    [ ] 5) Range Pointer (Donut)
    [ ] 6) Other Props (size, labels and accessibility)
    [ ] 7) Playground

#### Hooks
[ ] useComponentsI18n: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Construir componentes conscientes do locale
[ ] useSgEnvironment: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Default (sem provider)
    [ ] 2) Com provider
[ ] useSgPersistence: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Quando usar vs useSgPersistentState
[ ] useSgPersistentState: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Com isolamento por namespace
    [ ] 3) Serialize e deserialize customizados
    [ ] 4) Versionamento de estado
[ ] useSgTime: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Sem provider (fallback)
    [ ] 3) Usando tick para re-renders

#### Providers
[ ] SgClockThemeProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Tema local customizado
    [ ] 3) Registro global
[ ] SgComponentsI18nProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Troca dinamica de locale
    [ ] 3) API imperativa (setComponentsI18n)
    [ ] 4) Sobrescrita de mensagens
[ ] SgEnvironmentProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Default (namespace vazio)
    [ ] 2) Namespace customizado
    [ ] 3) REST (por usuario)
    [ ] 4) Hybrid (local + REST)
    [ ] 5) Playground
[ ] SgTimeProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Uso basico
    [ ] 2) Sem provedor (fallback)
    [ ] 3) Integracao com Next.js

#### Outros
[ ] SgWizard: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [ ] 1) Validacao automatica
    [ ] 2) stepNavigation
    [ ] 3) Stepper com Icones
    [ ] 4) Stepper Numerado
    [ ] 5) Labels customizados
    [ ] 6) onBeforeNext async
    [ ] 7) validateStep
    [ ] 8) Playground
[ ] SgBenchmark: decidir se entra no mesmo padrão de `samples` e validar com esbuild
    [ ] 1) SgInputText (uncontrolled)
    [ ] 2) Native input (uncontrolled)
    [ ] 3) Playground
[ ] Theme page: decidir se vira checklist próprio de exemplos de tema
    [ ] 1) Instalacao
    [ ] 2) Setup Basico
    [ ] 3) Hook useSgTheme
    [ ] 4) Usando CSS Variables
    [ ] 5) Paletas de Cores
    [ ] 6) Cores Semanticas
    [ ] 7) Cores Neutras
    [ ] 8) Tokens de Componentes
    [ ] 9) Configuracao do Tailwind
    [ ] 10) Estado Atual do Tema
    [ ] 11) Persistencia no localStorage
