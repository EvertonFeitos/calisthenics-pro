# SPEC 09 — TELA: PROGRESSO, RECORDES & MÉTRICAS (ProgressView)

## 1. Identificação da Tela
* **Nome da Tela:** Dashboard de Progresso, Métricas & Recordes Pessoais (ProgressView).
* **Identificador de Rota / Aba:** `progress`.
* **Objetivo:** Consolidar os dados históricos de todos os treinos realizados, calcular o volume acumulado de trabalho físico, exibir os Recordes Pessoais (PR) por exercício e traçar a evolução contínua do praticante de calistenia.

---

## 2. Layout e Estrutura Visual

### 2.1 Banner Superior Bento
* Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
* Tag: "EVOLUÇÃO & DESEMPENHO" + Badge com o total de PRs conquistados (ex: "6 recordes registrados").
* Título H1: "Progresso & Recordes Pessoais" em 18px extra-negrito `#F0F0F0`.
* Descrição: "Análise quantitativa do volume total de calistenia executado e seus maiores feitos em cada movimento."

---

## 3. Grade Bento de Métricas Globais (Global Stats Grid)
Disposta em grade responsiva de 2 colunas em mobile e 4 colunas a partir de 640px (`grid grid-cols-2 sm:grid-cols-4 gap-3`):

1. **Card 1 — Treinos Concluídos:**
   * Fundo `#121212`, borda `#222222`, cantos `rounded-2xl`, padding de 16px.
   * Ícone `CheckCircle2` em tom Esmeralda `#10b981`.
   * Valor: `{totalWorkouts}` em 22px fonte monospaçada extra-negrito `#F0F0F0`.
   * Rótulo: "Treinos Concluídos" em 11px cinza `#888888`.
2. **Card 2 — Repetições Acumuladas:**
   * Ícone `Flame` em tom Âmbar `#f59e0b`.
   * Valor: `{totalReps}` em 22px fonte monospaçada extra-negrito `#F0F0F0`.
   * Rótulo: "Repetições Totais" em 11px cinza `#888888`.
3. **Card 3 — Tempo Total em Isometria:**
   * Ícone `Zap` em tom Púrpura `#a855f7`.
   * Valor: `{totalHoldTimeSeconds}s` (ou minutos) em 22px monospaçado.
   * Rótulo: "Isometria Acumulada" em 11px cinza `#888888`.
4. **Card 4 — Tempo Total sob Carga:**
   * Ícone `Clock` em tom Índigo `#6366f1`.
   * Valor: `{totalMinutes} min` em 22px monospaçado.
   * Rótulo: "Tempo em Treino" em 11px cinza `#888888`.

---

## 4. Seção: Recordes Pessoais por Exercício (Personal Records - PR)

### 4.1 Estrutura do Card de PR
* Card Bento principal (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px).
* Cabeçalho de seção: Título "Recordes Pessoais (PR)" com ícone `Trophy` dourado `#f59e0b` e legenda "Melhor performance em uma única série registrada".
* Grade de PRs: 1 coluna em mobile, 2 colunas em tablet/desktop (`grid grid-cols-1 sm:grid-cols-2 gap-3`).

### 4.2 Elementos de Cada Item de PR
* Fundo `#161616`, borda `#262626`, cantos `rounded-2xl`, padding de 14px, layout flexível com espaçamento entre extremidades (`justify-between`).
* **Lado Esquerdo:**
  * Nome do exercício em 13px negrito `#F0F0F0`.
  * Total de séries históricas realizadas no movimento em 11px cinza `#888888`.
* **Lado Direito (Destaque do Recorde):**
  * Badge com fundo `#121212`, borda `#6366f1` com 30% de opacidade.
  * Valor em destaque: `{maxReps} reps` (para repetições) ou `{maxSeconds}s` (para isometrias) em fonte monospaçada e cor Índigo claro `#818cf8`.

---

## 5. Seção: Evolução Cronológica por Exercício
* Permite ao praticante visualizar a linha do tempo de desempenho em cada exercício específico ao longo das semanas.
* Exibe a progressão das repetições e volume de cada treino cronologicamente.

---

## 6. Estado Vazio (Empty State)
* Se nenhuma sessão foi realizada ainda:
  * Exibe container com borda tracejada `#262626`, ícone `TrendingUp` e mensagem: "Nenhum dado de progresso disponível. Conclua treinos para visualizar suas métricas e recordes pessoais."
