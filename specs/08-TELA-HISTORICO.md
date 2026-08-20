# SPEC 08 — TELA: HISTÓRICO DE TREINOS (HistoryView)

## 1. Identificação da Tela
* **Nome da Tela:** Histórico de Treinos Realizados (HistoryView).
* **Identificador de Rota / Aba:** `history`.
* **Objetivo:** Listar cronologicamente todas as sessões de treino concluídas pelo usuário, permitindo inspecionar o detalhamento de cada série realizada, a duração da sessão, a data/hora e excluir registros indesejados.

---

## 2. Layout e Estrutura Visual

### 2.1 Banner Superior Bento
* Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
* Tag: "REGISTRO DE ATIVIDADES" + Badge com o total de sessões registradas (ex: "7 sessões registradas").
* Título H1: "Histórico de Treinos" em 18px extra-negrito `#F0F0F0`.
* Descrição: "Acompanhe cada sessão realizada, data, duração e repetições reais executadas série a série."

### 2.2 Lista de Sessões (Timeline de Treinos)
* Espaçamento vertical entre os cards de sessão de 14px (`space-y-3.5`).
* Ordenação: Decrescente por data/hora de término (`finishedAt`), com as sessões mais recentes no topo.

---

## 3. Estrutura do Card de Sessão

### 3.1 Cabeçalho do Card (Linha Principal Resumida)
* Fundo `#121212`, borda `#222222` (com destaque no hover), cantos `rounded-[28px]`, padding de 16px.
* **Coluna Esquerda (Identificação):**
  * Data formatada em português (ex: "Quinta-feira, 20 de Agosto de 2026 às 14:32") em 12px cinza `#888888`.
  * Título do Treino em 15px extra-negrito `#F0F0F0` + Badge do Nível (ex: "Adaptação" ou "Iniciante") em texto Índigo.
* **Coluna Direita (Métricas & Controles):**
  * Duração formatada com ícone `Clock` (ex: "24 min 12s").
  * Total de séries concluídas com ícone `CheckCircle2` (ex: "12 séries").
  * Total de repetições acumuladas com ícone `Flame` (ex: "96 reps").
  * Botão de Expandir/Recolher Detalhes com ícone `ChevronDown` / `ChevronUp`.
  * Botão de Excluir Sessão (`#delete-session-btn-{id}`) com ícone `Trash2` em tom cinza hover rosa `#f43f5e`.

### 3.2 Corpo Expandido do Card (Detalhamento Série a Série)
Ao clicar no card ou no botão de expansão:
* Divisor sutil em `#1e1e1e`.
* Lista de todos os exercícios executados na sessão:
  * Nome do exercício em 13px negrito `#F0F0F0`.
  * Quantidade de séries realizadas no exercício.
  * Pílulas das séries com fundo `#181818`, borda `#262626`, exibindo o número da série e o valor real registrado (ex: `S1: 10 reps`, `S2: 8 reps`, `S3: 30s`).

---

## 4. Estado Vazio (Empty State)
* Caso o array de sessões esteja vazio (`sessions.length === 0`):
  * Container centralizado com cantos de 32px e borda tracejada `#262626`.
  * Ícone `History` cinza de 32x32px dentro de um círculo `#181818`.
  * Título: "Nenhum treino registrado ainda".
  * Subtítulo: "Conclua seu primeiro treino na grade semanal para ver seu histórico detalhado aqui."
  * Botão de Ação: "Ir para a Grade de Treinos" que navega para a aba `schedule`.

---

## 5. Regras de Exclusão e Validação
1. **Confirmação Prévia:** Ao clicar no ícone de lixeira, o sistema solicita confirmação explícita ao usuário ("Deseja realmente excluir este registro de treino do histórico?").
2. **Atualização Reativa:** A exclusão remove o item do repositório local e atualiza instantaneamente as métricas globais e a contagem no cabeçalho.
