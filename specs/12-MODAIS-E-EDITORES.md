# SPEC 12 — MODAIS, EDITORES & DIÁLOGOS DE GESTÃO

## 1. Visão Geral
Este documento especifica todos os modais de diálogo e editores de customização da aplicação Calistenia Pro. Todos os modais compartilham uma estrutura visual consistente de alto contraste (`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`), containers Bento (`bg-[#121212]`, borda `1px solid #262626`, cantos `rounded-[32px]`) e animação suave de entrada.

---

## 2. Modal: `WorkoutDetailModal` (Ficha Detalhada do Treino)

### 2.1 Responsabilidade
Apresentar a ficha técnica completa de uma rotina de treino selecionada na grade semanal antes de o usuário iniciar a sessão.

### 2.2 Estrutura e Elementos Visuais
1. **Cabeçalho:**
   * Badge do Nível (ex: "Nível 1 • Adaptação").
   * Título do Treino em 18px extra-negrito `#F0F0F0`.
   * Tempo estimado com ícone `Clock` (ex: "~30 min") e botão de fechar (`X`).
2. **Descrição do Treino:**
   * Texto explicativo do foco neuromuscular da sessão.
3. **Lista Ordenada de Exercícios:**
   * Cada exercício é exibido em um card interno (`bg-[#161616]`, borda `#262626`, cantos `rounded-2xl`, padding de 14px):
     * Número da ordem (ex: `1`, `2`, `3`).
     * Nome do exercício em 14px negrito `#F0F0F0`.
     * Categoria muscular e músculos alvos.
     * Metas configuradas: `{sets} séries de {targetRepetitions} repetições` (ou `{targetDuration} segundos de isometria`).
     * Tempo de descanso sugerido: `{restDuration}s de descanso`.
     * Visualizador de mídia tutorial embutido (caso possua vídeo ou foto).
4. **Rodapé com Botões de Ação:**
   * Botão "Fechar": Fundo `#181818`, borda `#262626`, texto `#CCCCCC`.
   * Botão "Iniciar Este Treino Agora" (`#start-from-detail-btn`): Fundo `#6366f1` (Índigo), texto branco, cantos arredondados (`rounded-full`), ícone `Play`.

---

## 3. Modal: `WorkoutEditorModal` (Editor de Rotinas de Treino)

### 3.1 Responsabilidade
Permitir a edição completa de uma rotina de treino, incluindo nome, descrição, tempo estimado e a adição, remoção, reordenação e ajuste de séries/metas dos exercícios.

### 3.2 Campos e Controles
1. **Dados Gerais:**
   * Nome da Rotina (`<input type="text">` obrigatório).
   * Descrição (`<textarea rows="2">`).
   * Duração Estimada em Minutos (`<input type="number">`).
2. **Gerenciador de Exercícios:**
   * Lista dos exercícios configurados no treino com botões de reordenação (subir/descer) e botão de lixeira para remoção.
   * Ajuste fino por item:
     * Quantidade de Séries (`1` a `10`).
     * Meta de Repetições / Isometria em segundos.
     * Tempo de Descanso entre séries (`30s`, `60s`, `90s`, `120s`, `180s`).
3. **Botão "Adicionar Exercício ao Treino":**
   * Menu suspenso ou modal de seleção a partir do catálogo completo de exercícios.
4. **Ações de Rodapé:**
   * "Cancelar" e "Salvar Treino" (`#save-workout-btn`).

---

## 4. Modal: `ExerciseEditorModal` (Editor & Criador de Exercícios)

### 4.1 Responsabilidade
Permitir ao usuário cadastrar novos movimentos personalizados de calistenia ou editar exercícios existentes, incluindo parâmetros técnicos, instruções e mídias tutoriais (vídeo do YouTube/Vimeo/MP4 e imagem).

### 4.2 Campos do Formulário
1. **Nome do Exercício (`name`):** `<input type="text">` obrigatório (ex: "Straddle Planche").
2. **Métrica / Tipo (`type`):** `<select>` com opções `REPETITIONS` (Repetições) ou `TIME` (Tempo Isométrico).
3. **Categoria Muscular (`category`):** `<select>` com opções `push`, `pull`, `legs_core`, `arms`, `skills`, `fullbody`.
4. **Músculos Trabalhados (`muscleGroup`):** `<input type="text">` (ex: "Peitoral, Tríceps, Deltoides").
5. **Instruções de Postura (`instruction`):** `<textarea rows="2">` com orientações de pegada e escápula.
6. **Dicas Rápidas (`tipsText`):** `<textarea rows="2">` com dicas inseridas uma por linha.
7. **Seção de Mídia Tutorial:**
   * Campo URL de Vídeo (`videoUrl`): Aceita links do YouTube, Vimeo ou arquivos diretos `.mp4`.
   * Campo URL de Imagem (`imageUrl`): Aceita links de fotos ilustrativas.
   * **Pré-visualização em Tempo Real (`Live Media Preview`):** Renderiza o componente `ExerciseMediaViewer` instantaneamente assim que uma URL válida é digitada.
8. **Ações de Rodapé:**
   * Botão "Excluir" (visível apenas em modo de edição, com confirmação).
   * Botão "Cancelar".
   * Botão "Salvar Exercício" com ícone `Save`.

---

## 5. Modal: `ScheduleEditorModal` (Editor da Grade Semanal)

### 5.1 Responsabilidade
Permitir a personalização dos dias que compõem a grade semanal do nível ativo, alternando dias entre treinos específicos e descansos ativos.

### 5.2 Estrutura e Controles
1. **Cabeçalho:** "Personalizar Grade de Treinos — Nível {levelName}".
2. **Lista de Dias da Grade:**
   * Cada linha representa um dia sequencial (`Dia 1`, `Dia 2`...):
     * Seletor de Treino: `<select>` listando os treinos cadastrados para o nível.
     * Botão Alternador de Descanso com ícone `Coffee`: Ao ser clicado, transforma o dia em "Dia de Descanso / Recuperação" ou restaura o seletor de treino.
     * Botão de Excluir Dia (`Trash2`): Remove o dia da grade (permitido se houver mais de 1 dia configurado).
3. **Botão "Adicionar Novo Dia na Grade" (`#add-schedule-day-btn`):**
   * Botão com borda tracejada para acrescentar um novo dia sequencial ao ciclo.
4. **Ações de Rodapé:**
   * Botão "Restaurar Padrão": Restaura a grade original de fábrica do nível ativo.
   * Botão "Cancelar".
   * Botão "Salvar Grade" (`#save-schedule-btn`).
