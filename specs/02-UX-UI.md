# SPEC 02 — UX/UI, DESIGN SYSTEM & SISTEMA VISUAL

## 1. Identidade Visual e Filosofia de Design
O Calistenia Pro utiliza um design system baseado no conceito **Bento Grid Dark Mode**, caracterizado por:
* **Fundo de alto contraste ultra-escuro:** Elimina distrações visuais e economiza energia em telas OLED.
* **Geometria Bento Box:** Containers com cantos amplamente arredondados (28px a 32px), bordas sutis com relevo escuro e hierarquia plana.
* **Cores de Destaque Vibrantes e Funcionais:** Acento principal em Índigo Elétrico (`#6366f1`), com suporte semântico em Esmeralda (`#10b981`), Âmbar (`#f59e0b`) e Rosa/Vermelho (`#f43f5e`).
* **Tipografia Numérica Monospaçada:** Utilizada para timers, contagens de repetições, durações e séries para estabilidade ótica durante animações.

---

## 2. Paleta de Cores Exatas (Design Tokens)

### 2.1 Cores de Fundo (Surfaces & Backgrounds)
| Token | Código Hex | Uso Primário |
| :--- | :--- | :--- |
| `bg-canvas` | `#080808` | Fundo principal da aplicação e tela de treino ativo |
| `bg-card` | `#121212` | Superfície principal dos cards Bento e modais |
| `bg-card-subtle` | `#141414` | Cabeçalhos de modais e sub-containers |
| `bg-input` | `#161616` | Fundo de inputs, botões secundários e controles |
| `bg-elevated` | `#181818` | Fundo de itens internos em cards, chips e badges |
| `bg-hover` | `#202020` | Estado hover de botões secundários e linhas de lista |
| `bg-active-pill` | `#1c1c1c` | Fundo de abas ativas na navegação |

### 2.2 Cores de Bordas (Borders & Dividers)
| Token | Código Hex | Uso Primário |
| :--- | :--- | :--- |
| `border-subtle` | `#1e1e1e` | Divisores discretos e cards em repouso |
| `border-card` | `#222222` | Borda padrão dos cards Bento e caixas de visualização |
| `border-input` | `#262626` | Borda de inputs, formulários e botões neutros |
| `border-focus` | `#333333` | Borda intermediária de hover |
| `border-brand` | `#6366f1` com opacidade (20% a 50%) | Destaques interativos e foco ativo |

### 2.3 Cores de Texto e Ícones (Typography & Content)
| Token | Código Hex | Uso Primário |
| :--- | :--- | :--- |
| `text-primary` | `#F0F0F0` | Títulos principais, valores de repetição e destaque |
| `text-secondary` | `#CCCCCC` | Subtítulos, rótulos de botões e texto de corpo ativo |
| `text-muted` | `#888888` | Descrições secundárias, metadados e legendas |
| `text-dim` | `#666666` | Unidades de medida secundárias e ícones inativos |
| `text-faint` | `#444444` | Separadores de texto e placeholders desabilitados |

### 2.4 Cores Semânticas e de Ação (Accents & States)
| Significado | Cor Base | Hex Principal | Hex Fundo / Badge | Hex Borda |
| :--- | :--- | :--- | :--- | :--- |
| **Ação / Marca (Brand)** | Índigo | `#6366f1` | `rgba(99, 102, 241, 0.12)` | `rgba(99, 102, 241, 0.3)` |
| **Ação Hover** | Índigo Claro | `#818cf8` | `rgba(99, 102, 241, 0.20)` | `rgba(99, 102, 241, 0.5)` |
| **Sucesso / Concluído** | Esmeralda | `#10b981` | `rgba(16, 185, 129, 0.12)` | `rgba(16, 185, 129, 0.3)` |
| **Aviso / Descanso** | Âmbar | `#f59e0b` | `rgba(245, 158, 11, 0.12)` | `rgba(245, 158, 11, 0.3)` |
| **Perigo / Cancelar** | Rosa / Rose | `#f43f5e` | `rgba(244, 63, 94, 0.12)` | `rgba(244, 63, 94, 0.3)` |
| **Isometria / Especial**| Púrpura | `#a855f7` | `rgba(168, 85, 247, 0.12)` | `rgba(168, 85, 247, 0.3)` |

---

## 3. Tipografia e Escala Hierárquica

* **Fonte Padrão (Sem-Serifa):** Sistema nativo ou sans-serif moderna (Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto).
* **Fonte Numérica / Monospaçada:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`.

| Nível / Uso | Tamanho da Fonte | Peso | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display (Timer Gigante)** | 36px a 40px | 900 (Black) | 1.1 | `-0.03em` |
| **H1 (Títulos de Página)** | 20px a 24px | 900 (Black) | 1.2 | `-0.02em` |
| **H2 (Títulos de Seção / Cards)**| 16px a 18px | 800 (ExtraBold) | 1.25 | `-0.01em` |
| **H3 (Títulos de Itens / Exercícios)**| 14px a 15px | 700 (Bold) | 1.3 | `0em` |
| **Body (Texto Principal)** | 13px a 14px | 400 (Regular) / 500 (Medium) | 1.5 | `0em` |
| **Small / Metadata** | 11px a 12px | 500 (Medium) / 600 (SemiBold) | 1.4 | `0.01em` |
| **Badge / Eyebrow / Tag** | 9px a 10px | 800 (ExtraBold) | 1.0 | `0.15em` (Uppercase) |

---

## 4. Regras de Espaçamento, Padding e Bordas

### 4.1 Escala de Espaçamento (Padding & Margins)
* **Gap Mínimo entre Itens Relacionados:** 6px a 8px (`gap-1.5` ou `gap-2`).
* **Gap entre Componentes em Grade:** 12px a 16px (`gap-3` a `gap-4`).
* **Padding Interno de Cards Principais:** 20px a 24px (`p-5` a `p-6`).
* **Padding Interno de Itens em Lista:** 12px a 16px (`p-3` a `p-4`).
* **Padding Horizontal de Botões:** O dobro do padding vertical (ex: `px-4 py-2` ou `px-5 py-2.5`).

### 4.2 Regra Matemática de Arredondamento de Cantos (Border Radius Nesting)
$$\text{Raio Interno} = \text{Raio Externo} - \text{Padding Interno}$$
* **Cards Bento Externos:** `rounded-[28px]` ou `rounded-[32px]` (28px a 32px).
* **Containers Internos / Sub-Cards:** `rounded-2xl` (16px).
* **Botões e Badges Interativos:** `rounded-full` (9999px) ou `rounded-xl` (12px).
* **Chips Numéricos de Séries:** `rounded-xl` (10px a 12px).

---

## 5. Catálogo de Ícones e Mapeamento (`lucide-react`)

| Conceito | Ícone Utilizado | Contexto |
| :--- | :--- | :--- |
| **Iniciar / Retomar** | `Play` | Botão de início de treino e retomar timer |
| **Pausar** | `Pause` | Pausar treino ativo |
| **Concluir Série** | `CheckCircle2` | Botão principal de registro da série |
| **Pular Descanso** | `SkipForward` | Botão de skip de descanso |
| **Tempo / Duração** | `Clock` | Cronômetros e durações estimadas |
| **Treino / Exercício** | `Dumbbell` | Biblioteca, peso corporal e rotinas |
| **Descanso / Recuperação** | `Coffee` | Dias de descanso na grade semanal |
| **Histórico** | `History` ou `Calendar` | Linha do tempo e sessões concluídas |
| **Progresso / Evolução** | `TrendingUp` | Gráficos e métricas de desempenho |
| **Recorde / Conquista** | `Trophy` ou `Award` | Resumo pós-treino e recordes pessoais |
| **Volume / Intensidade** | `Flame` | Total de repetições e calorias conceituais |
| **Isometria / Potência** | `Zap` | Segundos de sustentação estática |
| **Vídeo / Mídia** | `Film` | Vídeos tutoriais de execução correta |
| **Imagem / Foto** | `Image` | Fotos ilustrativas de anatomia/postura |
| **Editar** | `Edit3` | Customização de treino, grade ou exercício |
| **Excluir** | `Trash2` | Exclusão de sessão ou exercício |
| **IA Coach** | `Sparkles` ou `Bot` | Diagnóstico com Gemini |
| **Som Ativo** | `Volume2` | Som ligado no cabeçalho e configurações |
| **Som Mudo** | `VolumeX` | Som desativado |
| **Ajustes** | `Settings` | Tela de configurações |

---

## 6. Estados Visuais dos Componentes

### 6.1 Botão Primário (Ação Principal / Concluir Série / Iniciar)
* **Repouso:** Fundo `#6366f1` (Índigo 600), texto `#FFFFFF`, borda `1px solid rgba(99, 102, 241, 0.3)`, sombra `0 10px 15px -3px rgba(99, 102, 241, 0.3)`.
* **Hover:** Fundo `#4f46e5` (Índigo 500), escala `1.0`.
* **Active (Toque/Clique):** Escala `0.97`, feedback tátil visual.
* **Disabled:** Opacidade `0.5`, cursor `not-allowed`, sem sombra.

### 6.2 Botão Secundário / Neutro
* **Repouso:** Fundo `#181818`, texto `#CCCCCC`, borda `1px solid #262626`.
* **Hover:** Fundo `#202020`, texto `#F0F0F0`, borda `#333333`.
* **Active:** Escala `0.98`.

### 6.3 Inputs e Textareas
* **Repouso:** Fundo `#181818`, texto `#F0F0F0`, borda `1px solid #2a2a2a`, cantos `16px`.
* **Focus:** Borda `#6366f1`, anel de foco `ring-2 ring-indigo-500/20`, contorno removido (`outline-none`).
* **Placeholder:** Texto `#555555` a `#666666`.

### 6.4 Estados Vazios (Empty States)
* Container com borda pontilhada/tracejada (`border-dashed border-[#262626]`), cantos `32px`, ícone centralizado cinza `#666666` dentro de um quadrado arredondado `#181818`, mensagem de incentivo e botão de ação primária para guiar o usuário.

---

## 7. Responsividade e Breakpoints

### 7.1 Breakpoints do Sistema
* **Mobile (< 640px):**
  * Layout de 1 coluna em todas as grades (`grid-cols-1`).
  * Barra de navegação inferior flutuante fixada a 12px da base da tela.
  * Inputs com altura mínima de 44px para facilidade de toque.
  * Cabeçalho compacto com seletor de nível em menu suspenso pill.
* **Tablet (640px a 1023px):**
  * Grades distribuídas em 2 colunas (`sm:grid-cols-2`).
  * Cards Bento de métricas e dias da grade expandidos.
  * Modais com largura máxima de 560px centralizados na tela.
* **Desktop (≥ 1024px):**
  * Largura máxima centralizada do container em 896px (`max-w-4xl`) para manter a densidade ótica sem esticar excessivamente os elementos.
  * Ações secundárias exibidas diretamente na barra de ferramentas.

---

## 8. Feedback Auditivo (Web Audio API)
Para garantir funcionamento 100% offline sem necessidade de carregar arquivos de áudio externos, o sistema utiliza osciladores de áudio sintetizados nativos (`AudioContext`):

1. **Beep de Contagem Regressiva (3, 2, 1s):**
   * Onda: `sine`.
   * Frequência: 600 Hz (a 3s e 2s) e 800 Hz (a 1s).
   * Duração: 80ms com decaimento exponencial.
2. **Conclusão de Série (Set Complete):**
   * Onda: `sine`.
   * Frequência: Acorde harmônico duplo (523.25 Hz / C5 saltando para 659.25 Hz / E5).
   * Duração: 150ms.
3. **Fim do Descanso (Rest Finished):**
   * Onda: `triangle`.
   * Frequência: Tríade ascendente de alerta (440 Hz -> 554 Hz -> 659 Hz).
   * Duração: 250ms.
4. **Treino Concluído com Sucesso (Workout Complete):**
   * Onda: `triangle`.
   * Frequência: Acorde de vitória em arpejo quádruplo (523.25 Hz -> 659.25 Hz -> 783.99 Hz -> 1046.50 Hz / C-E-G-C).
   * Duração: 600ms.
