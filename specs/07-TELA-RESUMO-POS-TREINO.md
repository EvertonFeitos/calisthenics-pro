# SPEC 07 — TELA: RESUMO PÓS-TREINO & CELEBRAÇÃO (PostWorkoutSummary)

## 1. Identificação da Tela
* **Nome da Tela:** Resumo Pós-Treino / Celebração de Conclusão (PostWorkoutSummary).
* **Tipo:** Tela Cheia com Apresentação de Resultados (`min-h-screen bg-[#080808]`).
* **Objetivo:** Fornecer feedback imediato de conquista e encerramento após a finalização de todas as séries de uma rotina, disparar efeitos comemorativos, consolidar métricas de volume e desempenho da sessão recém-executada e direcionar o usuário para o histórico ou de volta para a grade.

---

## 2. Efeito Comemorativo (Confetti Trigger)
* Ao montar a tela, o sistema dispara uma explosão comemorativa de confetes coloridos em duas rajadas:
  * Rajada 1: 80 partículas com dispersão de 70 graus na coordenada `(0.5, 0.6)`.
  * Rajada 2 (após 300ms): 50 partículas com dispersão de 90 graus na coordenada `(0.5, 0.5)`.

---

## 3. Estrutura Visual da Interface

### 3.1 Cabeçalho de Conquista Bento
* **Ícone Central:** Círculo de 80x80px com gradiente Índigo (`from-indigo-600 to-indigo-800`), borda `#6366f1` com 30% de opacidade, sombra brilhante e ícone `Trophy` dourado `#f59e0b` de 40x40px.
* **Título:** "TREINO CONCLUÍDO!" em 28px a 32px extra-negrito `#F0F0F0` com tracking apertado.
* **Subtítulo:** "{workoutName} • Nível {levelName} finalizado com sucesso." em 14px cinza `#888888`.

### 3.2 Grade Bento de Métricas Consolidadas (Metrics Bento Grid)
Disposta em grade responsiva de 2 colunas em mobile e 4 colunas em telas maiores (`grid grid-cols-2 sm:grid-cols-4 gap-3`):
1. **Card 1 — Duração Total:**
   * Ícone `Clock` em tom Índigo.
   * Valor: `{MM}m {SS}s` em fonte monospaçada extra-negrito `#F0F0F0`.
   * Rótulo: "Tempo Total".
2. **Card 2 — Séries Concluídas:**
   * Ícone `CheckCircle2` em tom Esmeralda.
   * Valor: `{totalCompletedSets}` séries em fonte monospaçada.
   * Rótulo: "Séries Feitas".
3. **Card 3 — Volume de Repetições:**
   * Ícone `Flame` em tom Âmbar.
   * Valor: `{totalReps}` reps em fonte monospaçada.
   * Rótulo: "Reps Totais".
4. **Card 4 — Tempo sob Tensão (Isometria):**
   * Ícone `Zap` em tom Púrpura.
   * Valor: `{totalHoldSeconds}s` em fonte monospaçada.
   * Rótulo: "Isometria".

---

## 4. Detalhamento por Exercício (Exercise Breakdown Card)
* Card Bento (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px).
* Título da Seção: "Desempenho por Exercício" com ícone `Dumbbell`.
* Linhas de Exercício:
  * Nome do exercício em 14px negrito `#F0F0F0`.
  * Quantidade de séries concluídas vs previstas (ex: "3/3 séries").
  * Total de repetições acumuladas ou segundos de sustentação no exercício.
  * Pílulas individuais de cada série com os valores reais registrados (ex: `[10] [8] [8]`).

---

## 5. Ações e Navegação no Rodapé
* **Botão Secundário (`#view-history-btn`):**
  * Fundo `#181818`, borda `#262626`, texto `#CCCCCC`, ícone `History`, rótulo "Ver no Histórico Completo".
  * Ação: Direciona para a aba `history`.
* **Botão Primário (`#back-to-schedule-btn`):**
  * Fundo `#6366f1`, texto branco, cantos arredondados (`rounded-full`), ícone `Calendar`, rótulo "Voltar para a Grade".
  * Ação: Direciona para a aba `schedule`.
