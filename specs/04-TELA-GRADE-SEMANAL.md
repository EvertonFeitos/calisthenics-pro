# SPEC 04 — TELA: GRADE SEMANAL (ScheduleView)

## 1. Identificação da Tela
* **Nome da Tela:** Grade Semanal de Treinos (ScheduleView).
* **Identificador de Rota / Aba:** `schedule`.
* **Objetivo:** Exibir o plano de treinamento semanal para o nível selecionado, permitindo visualizar os dias de treino e descanso, inspecionar a sequência de exercícios, personalizar a grade e iniciar uma sessão de treino ativo.

---

## 2. Layout e Estrutura Visual
* **Container Principal:** Disposto verticalmente com espaçamento entre seções de 16px (`space-y-4`), com animação suave de fade-in.
* **Banner Superior Bento (Header Banner):**
  * Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
  * Tag superior: "GRADE SEMANAL" em 10px uppercase cinza `#888888` + Badge com "Nível {order} • {badge}" em texto e borda Índigo `#6366f1`.
  * Título H1: "Rotina de Treinos — {Nome do Nível}" em 18px extra-negrito `#F0F0F0`.
  * Descrição: Texto em 12px cinza `#888888` descrevendo o objetivo do nível.
  * Botão de Ação: "Personalizar Grade" (`#edit-schedule-btn`) no canto superior direito com ícone `Edit3`.
* **Grade de Dias (Bento Grid of Days):**
  * Grade responsiva de 1 coluna em mobile e 2 colunas em telas a partir de 640px (`grid grid-cols-1 sm:grid-cols-2 gap-4`).

---

## 3. Comportamento dos Cards de Dia

### 3.1 Card de Dia de Descanso (`isRestDay = true` ou sem treino associado)
* **Estilo Visual:** Fundo `#121212`, borda `#1e1e1e`, cantos `rounded-[32px]`, padding de 20px, opacidade reduzida a 80% (com 100% no hover).
* **Cabeçalho do Card:** Rótulo "Dia {dayNumber} • {dayOfWeek}" em 12px cinza `#888888` à esquerda; Badge de "Descanso" com ícone `Coffee` em cinza `#888888` à direita.
* **Corpo do Card:** Título H3 "Descanso / Recuperação" e texto explicativo (ex: "Dia livre para descanso muscular e recuperação articular").
* **Rodapé do Card:** Mensagem sutil em itálico "Recuperação ativa recomendada" separada por borda `#1a1a1a`.

### 3.2 Card de Dia de Treino (`isRestDay = false` com treino válido)
* **Estilo Visual:** Fundo `#121212`, borda `#222222` (com transição para `#6366f1` com 40% de opacidade no hover), cantos `rounded-[32px]`, padding de 20px, sombra suave.
* **Cabeçalho do Card:** Rótulo "Dia {dayNumber} • {dayOfWeek}" em 12px `#BBBBBB` à esquerda; Duração estimada "~{estimatedMinutes} min" com ícone `Clock` em fonte monospaçada à direita.
* **Título do Treino:** Texto em 16px extra-negrito `#F0F0F0` com efeito hover mudando para tom Índigo claro.
* **Descrição:** Texto resumido em 12px cinza `#888888` limitado a 2 linhas (`line-clamp-2`).
* **Prévia dos Exercícios (Bento Pills):**
  * Exibe as 3 primeiras pílulas de exercício no formato: `{Nome do Exercício} ({sets}x{targetRepetitions}r)` ou `{sets}x{targetDuration}s`.
  * Se o treino tiver mais de 3 exercícios, exibe um badge indicador com `+{N}` em destaque Índigo.
* **Barra de Ações do Card:**
  * Botão "Ver Detalhes" (`#detail-workout-btn-{id}`): Fundo `#181818`, borda `#262626`, texto `#CCCCCC` com ícone `Eye`.
  * Botão de Edição Rápida de Exercícios: Botão circular com ícone `Edit3` para abrir o editor de exercícios do treino.
  * Botão "Iniciar" (`#start-workout-btn-{id}`): Fundo `#6366f1` (Índigo), texto branco, cantos arredondados (`rounded-full`), sombra projetada, ícone `Play`.

---

## 4. Entradas, Saídas e Interações

### 4.1 Dados Necessários (Entradas)
* `currentLevel`: Objeto do nível selecionado contendo `id`, `name`, `order`, `badge` e `description`.
* `schedule`: Array de `WorkoutScheduleDay` correspondente ao nível atual.
* `workoutsMap`: Dicionário indexando objetos `Workout` por ID.
* `exercisesMap`: Dicionário indexando objetos `Exercise` por ID.

### 4.2 Ações e Eventos Disparados (Saídas)
* Clicar em "Personalizar Grade" $\rightarrow$ Abre o `ScheduleEditorModal`.
* Clicar em "Ver Detalhes" em um card $\rightarrow$ Abre o `WorkoutDetailModal` com a ficha do treino.
* Clicar no botão `Edit3` de um card de treino $\rightarrow$ Abre o `WorkoutEditorModal` para editar exercícios daquele treino.
* Clicar em "Iniciar" em um card $\rightarrow$ Inicia o `ActiveWorkoutView` com a rotina selecionada.

---

## 5. Critérios de Aceite
1. A grade deve atualizar imediatamente ao alterar o nível ativo no cabeçalho.
2. Dias configurados como descanso nunca devem apresentar o botão "Iniciar Treino".
3. O número de exercícios exibido nas pílulas deve refletir fielmente a contagem configurada no treino.
4. Em telas com menos de 640px de largura, os cards devem ocupar 100% da largura útil em coluna única.
