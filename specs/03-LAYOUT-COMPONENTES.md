# SPEC 03 — LAYOUT & COMPONENTES ESTRUTURAIS REUTILIZÁVEIS

## 1. Visão Geral
Este documento especifica todos os componentes estruturais, transversais e reutilizáveis da aplicação Calistenia Pro. Cada componente é documentado de forma agnóstica de framework, descrevendo suas propriedades de entrada (Props/Inputs), emissão de eventos (Events/Outputs), estados internos, marcação visual e regras de comportamento.

---

## 2. Componente: `Header` (Cabeçalho Fixo Superior)

### 2.1 Responsabilidade
Prover a barra superior fixa de navegação contendo a identidade do produto, seletor de nível ativo em menu compacto, alternador global de som e indicador de treinos concluídos.

### 2.2 Localização e Hierarquia
* **Posição:** Fixado no topo (`sticky top-0 z-30`).
* **Fundo:** `#080808` com 90% de opacidade e desfoque de fundo (`backdrop-blur-xl`), borda inferior `1px solid #222222`.

### 2.3 Contrato de Interface (Props / Entradas e Saídas)
* **Entradas (Props):**
  * `currentLevelInfo: LevelInfo` (Objeto do nível ativo).
  * `levels: LevelInfo[]` (Array com os 5 níveis disponíveis).
  * `soundEnabled: boolean` (Flag de áudio ativado).
  * `completedWorkoutsCount: number` (Total de treinos concluídos no histórico).
* **Saídas (Eventos):**
  * `onSelectLevel(levelId: LevelId): void` (Disparado quando o usuário altera o nível no dropdown).
  * `onToggleSound(): void` (Disparado ao clicar no botão de som).

### 2.4 Elementos Visuais e Interações
1. **Logotipo Bento Box:**
   * Ícone quadrado `#6366f1` de 40x40px com cantos de 12px, contendo um box minimalista estilizado.
   * Texto "CALISTENIA" em fonte extra-negrito (`#F0F0F0`) + "PRO" em fonte leve com sublinhado (`text-indigo-400`).
   * Legenda "Bento Workout Engine" em 11px cinza `#888888`.
2. **Dropdown Seletor de Nível (`#level-selector-dropdown`):**
   * Elemento `<select>` arredondado (`rounded-full`), fundo `#161616`, texto `#818cf8`, borda `#262626`.
   * Permite alternar diretamente entre os níveis 1 a 5 sem sair da tela atual.
3. **Botão de Som (`#toggle-sound-btn`):**
   * Botão circular (`rounded-full`) de 36x36px.
   * Exibe ícone `Volume2` (Índigo) quando ativo e `VolumeX` (Cinza) quando mudo.
4. **Badge de Treinos Concluídos:**
   * Pílula com ponto luminoso verde (`#10b981`) pulsante e contagem de treinos realizados. Oculto em telas menores que 640px para economizar espaço.

---

## 3. Componente: `BottomNav` (Barra de Navegação Inferior Flutuante)

### 3.1 Responsabilidade
Permitir a alternância rápida e intuitiva entre as 6 áreas centrais do aplicativo através de uma barra flutuante ergonômica com suporte à área segura de dispositivos móveis (`pb-safe`).

### 3.2 Localização e Hierarquia
* **Posição:** Fixado no rodapé flutuante (`fixed bottom-3 left-0 right-0 z-30`).
* **Container:** Centralizado com largura máxima de 448px (`max-w-md`), cantos arredondados em pílula (`rounded-full`), fundo `#121212` com 95% de opacidade, borda `1px solid #262626` e sombra projetada intensa.

### 3.3 Itens de Navegação (Abas)
1. `schedule`: Grade Semanal (Ícone `Calendar`, Rótulo "Grade").
2. `exercises`: Biblioteca de Exercícios (Ícone `Dumbbell`, Rótulo "Exercícios").
3. `history`: Histórico de Treinos (Ícone `History`, Rótulo "Histórico").
4. `progress`: Métricas e Recordes (Ícone `TrendingUp`, Rótulo "Progresso").
5. `coach`: Treinador IA Gemini (Ícone `Sparkles`, Rótulo "IA Coach").
6. `settings`: Ajustes do Sistema (Ícone `Settings`, Rótulo "Ajustes").

### 3.4 Estados Visuais dos Botões da Barra
* **Aba Ativa:** Fundo `#1c1c1c`, texto e ícone em `#6366f1` (Índigo), borda sutil `1px solid rgba(99,102,241,0.3)`, ícone ampliado com escala `1.1`.
* **Aba Inativa:** Fundo transparente, texto cinza `#888888`, ícone cinza `#888888`, hover com fundo `#161616` e texto `#F0F0F0`.

---

## 4. Componente: `LevelSelector` (Seletor Expandido de Níveis)

### 4.1 Responsabilidade
Apresentar os 5 estágios de evolução da calistenia em formato de cards Bento interativos, destacando o nível selecionado, requisitos e objetivos anatômicos.

### 4.2 Estrutura Visual
* Container principal em card Bento (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px).
* Cabeçalho de seção com tag de rastreamento "NÍVEL DE TREINAMENTO" e título "Progressão de Força & Calistenia".
* Grade responsiva de 5 cards: 2 colunas em mobile e 5 colunas em tablet/desktop (`grid-cols-2 sm:grid-cols-5 gap-2.5`).

### 4.3 Comportamento do Card de Nível
* **Card Ativo:** Gradiente de fundo sutil de azul-marinho profundo para escuro (`from-[#1e1b4b]/60 to-[#121212]`), borda `#6366f1` com anel de foco (`ring-1 ring-indigo-500/40`), badge do nível preenchido em `#6366f1` e ícone `CheckCircle2` no canto superior direito.
* **Card Inativo:** Fundo `#181818`, borda `#262626`, texto `#888888`, badge cinza escuro `#222222`.

---

## 5. Componente: `ExerciseMediaViewer` (Visualizador Universal de Mídia)

### 5.1 Responsabilidade
Processar, sanitizar e renderizar de forma fluida vídeos e imagens explicativas de exercícios, com alternância de abas ("Vídeo Tutorial" e "Foto / Ilustração") e opção de colapso/expansão.

### 5.2 Contrato de Interface
* **Entradas (Props):**
  * `videoUrl?: string` (URL do YouTube, Vimeo ou link direto MP4).
  * `imageUrl?: string` (URL da foto ilustrativa).
  * `exerciseName: string` (Nome do exercício para textos alternativos e títulos de acessibilidade).
  * `collapsible?: boolean` (Se permite recolher/expandir o player. Padrão: `false`).
  * `defaultCollapsed?: boolean` (Se inicia recolhido. Padrão: `false`).
* **Comportamento de Detecção de Mídia:**
  * Se a URL for do YouTube (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`), o componente converte automaticamente para a URL de incorporação segura `https://www.youtube-nocookie.com/embed/{ID}`.
  * Se a URL for do Vimeo (`vimeo.com/...`), converte para `https://player.vimeo.com/video/{ID}`.
  * Se for arquivo de vídeo direto (`.mp4`, `.webm`), renderiza a tag `<video>` nativa com controles e reprodução em linha (`playsInline`).
  * Se o link de imagem falhar ao carregar (`onError`), o componente marca estado de erro e oculta a aba quebrada automaticamente sem travar a interface.

---

## 6. Componente: `CircularCountdownTimer` (Timer Circular de Descanso)

### 6.1 Responsabilidade
Exibir visualmente a contagem regressiva do tempo de descanso entre séries através de um indicador de progresso circular SVG animado e controles de ajuste imediato.

### 6.2 Estrutura Matemática do SVG
* **ViewBox:** `0 0 100 100`.
* **Círculo de Fundo (Trilha):** Centro `(50, 50)`, raio `44`, cor `#181818`, espessura do traço `6px`.
* **Círculo de Progresso (Ativo):** Centro `(50, 50)`, raio `44`, cor `#6366f1`, espessura do traço `6px`, rotação de `-90deg`.
* **Perímetro da Circunferência:** $C = 2 \times \pi \times 44 \approx 276.46\text{px}$.
* **Cálculo do Offset do Traço:**
$$\text{strokeDashoffset} = 276 - \left(\frac{276 \times \text{Tempo Restante}}{\text{Tempo Total de Descanso}}\right)$$

### 6.3 Controles de Ajuste Rápido do Descanso
* **Botões de Delta:** `-15s`, `+15s`, `+30s` (atualizam dinamicamente o tempo restante sem reiniciar a série).
* **Chips de Tempo Fixo (Presets):** `30s`, `60s`, `90s`, `120s`, `180s`.
* **Botão de Pular Descanso (`#skip-rest-btn`):** Interrompe imediatamente o timer e avança para a próxima série.

---

## 7. Componente: Diálogos de Confirmação & Modais

### 7.1 Regras Estruturais Comuns dos Modais
* **Overlay:** Posição fixa cobrindo 100% da viewport (`fixed inset-0 z-50`), fundo preto com 80% a 85% de opacidade e desfoque de fundo (`backdrop-blur-sm` ou `backdrop-blur-md`).
* **Container Central:** Card Bento (`bg-[#121212]`, borda `1px solid #262626`, cantos `rounded-[32px]`, sombra projetada profunda `shadow-2xl`).
* **Animação de Entrada:** Transição de opacidade (fade-in) combinada com escala suave de 0.95 para 1.0 (scale-up).
* **Bloqueio de Rolagem:** O corpo da página principal permanece fixo enquanto o modal estiver visível.
