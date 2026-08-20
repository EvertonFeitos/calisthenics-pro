# SPEC 06 — TELA: TREINO ATIVO EM TEMPO REAL (ActiveWorkoutView)

## 1. Identificação da Tela
* **Nome da Tela:** Execução de Treino Ativo / Cronômetro e Registro de Séries (ActiveWorkoutView).
* **Tipo:** Tela Cheia Imersiva Sobreposta (`fixed inset-0 z-40 bg-[#080808]`).
* **Objetivo:** Conduzir a execução do treino do usuário em tempo real, fornecendo orientações do exercício atual, vídeos explicativos, controle de repetições realizadas ou tempo sob tensão, cronômetro automático de descanso com avisos sonoros e registro de dados de performance.

---

## 2. Máquina de Estados da Sessão Ativa

A tela opera baseada em uma máquina de estados finita:

```
                      +-------------------+
                      |   INÍCIO TREINO   |
                      +---------+---------+
                                |
                                v
               +-------> [ FASE WORKING ] <-------+
               |         (Executando Série)       |
               |                |                 |
  (Descanso Concluído /         | (Concluir Série)|
    Pular Descanso)             v                 |
               |         [ FASE RESTING ] --------+
               |         (Timer Descanso)
               |                |
               +----------------+
                                | (Última Série do Último Exercício)
                                v
                      [ FINALIZAR SESSÃO ]
                                |
                                v
                     (PostWorkoutSummary)
```

### 2.1 Fases Operacionais (`WorkoutPhase`)
1. `WORKING`: Fase em que o atleta está executando a série na barra/chão. O cronômetro total da sessão e o cronômetro do exercício continuam ativos.
2. `RESTING`: Fase de recuperação entre séries. O cronômetro circular faz a contagem regressiva e emite bips sonoros.
3. `PAUSED`: Estado de congelamento temporário em qualquer momento do treino. O tempo é travado até que o usuário clique em Retomar.

### 2.2 Modos de Temporização (`TimerMode`)
* `REST_ONLY` (Modo Manual): O cronômetro atua apenas na contagem regressiva de descanso entre as séries. O atleta marca a conclusão da série manualmente.
* `AUTO_WORK_REST` (Modo Automático para Isometrias): Para exercícios baseados em tempo (`ExerciseType.TIME`), o timer realiza a contagem regressiva da execução da série e, ao zerar, dispara a conclusão e inicia imediatamente o descanso.

---

## 3. Estrutura Visual da Interface

### 3.1 Barra Superior Fixa (Top Workout Navigation)
* **Botão "Encerrar" (`#quit-workout-btn`):** Posicionado no canto superior esquerdo com ícone `X`, abre o modal de confirmação de desistência.
* **Informações Centrais:**
  * Nome do treino em letras maiúsculas extra-negrito Índigo `#818cf8`.
  * Cronômetro total decorrido da sessão formatado em `MM:SS` em fonte monospaçada com ícone `Clock`.
* **Controles do Canto Direito:**
  * Botão seletor de modo ("Modo Auto" vs "Manual") com identificador `#toggle-timer-mode-btn`.
  * Botão de pausa/play (`#pause-workout-btn`) com ícone `Pause` ou `Play`.
* **Barra de Progresso da Sessão (Session Progress Bar):**
  * Rótulo indicativo: `{Séries Concluídas}/{Total de Séries} séries ({Progresso}%)`.
  * Barra de progresso com trilha `#181818`, preenchimento em `#6366f1` (Índigo) e efeito luminoso sutil.

### 3.2 Cabeçalho do Exercício Atual
* Badge circular: "Exercício {X} de {Total} • Série {Y} de {Séries do Exercício}".
* Título do Exercício em 24px a 30px extra-negrito `#F0F0F0`.
* Grupo muscular e Botão "Ver Execução Correta" (caso possua mídia) para abrir o modal de tutorial técnico.

---

## 4. Cards Centrais Dinâmicos

### 4.1 Card da Fase de Trabalho (`WORKING Phase Card`)
Exibido durante a execução da série:
1. **Linha de Metas:**
   * Meta Sugerida: "{N} repetições" ou "{N} segundos".
   * Cronômetro de trabalho em tempo real (se for exercício de tempo).
2. **Instruções e Mídia Rápida:**
   * Texto de instrução técnica e reprodutor de vídeo/foto embutido caso configurado.
3. **Seletor de Performance Real Realizada:**
   * Rótulo "Repetições Realizadas" (ou "Duração Real em segundos").
   * Botão de alternância "Não registrar reps" para marcar a série sem salvar valor numérico.
   * Controles de Incremento:
     * Botão de Decremento (`#decrease-rep-btn`) com ícone `Minus` (diminui 1 unidade até o limite de 0).
     * Valor numérico em 36px fonte monospaçada extra-negrito `#F0F0F0`.
     * Botão de Incremento (`#increase-rep-btn`) com ícone `Plus` (aumenta 1 unidade).
   * Pílulas de Atalho Rápido: Botões com valores fixos `0`, `3`, `5`, `8`, `10`, `12`, `15` para preenchimento com 1 toque.
4. **Botão Principal de Ação (`#complete-set-btn`):**
   * Botão de largura total com 56px de altura, cantos arredondados (`rounded-full`), fundo `#6366f1`, texto "CONCLUIR SÉRIE", ícone `CheckCircle2` e sombra projetada.

### 4.2 Card da Fase de Descanso (`RESTING Phase Card`)
Exibido durante a recuperação:
1. **Tag de Status:** "DESCANSO ENTRE SÉRIES" em pílula Índigo.
2. **Timer Circular SVG (100x100 ViewBox):**
   * Contagem regressiva central em 36px monospaçado (ex: `01:45`).
   * Rastro circular animado em `#6366f1` regredindo conforme o tempo passa.
3. **Ajustes Rápidos de Tempo:**
   * Botões de Delta: `-15s`, `+15s`, `+30s` (atualizam dinamicamente o tempo restante).
   * Pílulas de Presets: `30s`, `60s`, `90s`, `120s`, `180s`.
4. **Botão Pular Descanso (`#skip-rest-btn`):**
   * Botão com ícone `SkipForward` para encerrar o descanso e iniciar imediatamente a próxima série.
5. **Revisão de Mídia Opcional:**
   * Visualizador de mídia recolhível para o atleta estudar o movimento da próxima série durante o repouso.

### 4.3 Prévia da Próxima Ação (Next Action Preview)
* Barra inferior indicando: "A Seguir: Série {Y+1} de {Total}" ou "Próximo Exercício: {Nome}" ou "Finalização do Treino!".

---

## 5. Gatilhos Sonoros e Transições

| Evento | Efeito Sonoro Disparado | Comportamento na Interface |
| :--- | :--- | :--- |
| **Conclusão de Série** | `soundService.playSetComplete()` | Transita para fase `RESTING`, inicia contagem regressiva |
| **Contagem 3, 2, 1s** | `soundService.playCountdownTick(freq)` | Emite beeps curtos (600Hz / 800Hz) a cada segundo final |
| **Fim do Descanso** | `soundService.playRestFinished()` | Transita para fase `WORKING` da próxima série |
| **Fim do Treino** | `soundService.playWorkoutComplete()` | Salva a sessão no repositório e abre o `PostWorkoutSummary` |

---

## 6. Diálogo de Confirmação de Saída / Cancelamento
* Se o usuário clicar em "Encerrar", o sistema exibe o modal com ícone `AlertTriangle` em tom rosa `#f43f5e`, título "Interromper Treino?" e opções:
  * "Continuar": Fecha o modal e mantém o treino em andamento.
  * "Sair": Descarta a sessão incompleta e retorna para a aba de Grade Semanal.
