# SPEC 05 — TELA: BIBLIOTECA DE EXERCÍCIOS (ExercisesDirectoryView)

## 1. Identificação da Tela
* **Nome da Tela:** Biblioteca de Exercícios & Diretório de Movimentos (ExercisesDirectoryView).
* **Identificador de Rota / Aba:** `exercises`.
* **Objetivo:** Permitir ao usuário explorar todos os movimentos de calistenia catalogados, filtrar por grupo muscular, buscar por palavras-chave, assistir a vídeos explicativos de postura correta, visualizar fotos de técnica e criar/editar novos exercícios personalizados.

---

## 2. Layout e Estrutura Visual

### 2.1 Banner Superior Bento
* Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
* Tag: "BIBLIOTECA DE MOVIMENTOS" + Badge contendo o total de exercícios cadastrados (ex: "18 cadastrados").
* Título H1: "Exercícios & Execuções Corretas" em 18px extra-negrito `#F0F0F0`.
* Descrição: Informação sobre acesso a vídeos tutoriais, ilustrações, postura adequada e customização.
* Botão Primário: "Novo Exercício" com ícone `Plus`, fundo `#6366f1` (Índigo), cantos arredondados (`rounded-full`).

### 2.2 Barra de Busca e Filtros de Categoria
1. **Campo de Busca (`<input type="text">`):**
   * Posição com ícone `Search` à esquerda.
   * Placeholder: "Buscar por nome, músculo ou técnica (ex: Planche, Flexão, Barra)..."
   * Fundo `#121212`, borda `#222222`, cantos de 16px (`rounded-2xl`), texto claro `#F0F0F0`.
   * Filtragem instantânea sem recarregamento.
2. **Pílulas de Categoria com Rolagem Horizontal (`overflow-x-auto no-scrollbar`):**
   * Opções:
     * `all`: "Todos"
     * `push`: "Empurrar (Push)"
     * `pull`: "Puxar (Pull)"
     * `legs_core`: "Pernas & Core"
     * `arms`: "Braços (Arms)"
     * `skills`: "Skills & Isometrias"
   * Estado Ativo: Fundo `#6366f1` (Índigo), texto branco.
   * Estado Inativo: Fundo `#141414`, borda `#242424`, texto cinza `#888888`.

---

## 3. Cards de Exercício no Grid

### 3.1 Estrutura do Card de Exercício
* Disposto em grade de 1 coluna em mobile e 2 colunas a partir de 768px (`grid grid-cols-1 md:grid-cols-2 gap-3.5`).
* Fundo `#121212`, hover `#151515`, borda `#222222` (com borda Índigo `#6366f1` com 40% de opacidade no hover), cantos `rounded-[28px]`, padding de 16px.

### 3.2 Elementos Internos do Card
1. **Linha de Badges Superiores:**
   * Categoria muscular: Badge Índigo suave (ex: "Empurrar (Push)").
   * Indicador de Mídia:
     * Se possuir `videoUrl`: Badge roxo com ícone `Film` e texto "Vídeo".
     * Se possuir `imageUrl`: Badge esmeralda com ícone `Image` e texto "Foto".
   * Indicador de Tipo: Badge cinza `#1a1a1a` com texto "Isometria" ou "Repetições".
2. **Título e Músculos:**
   * Título H3 do exercício em 14px extra-negrito `#F0F0F0`.
   * Grupo muscular trabalhado em 11px Índigo claro (ex: "Peitoral maior, Tríceps, Deltoide anterior").
3. **Instruções Técnicas:**
   * Texto de instrução limitado a 2 linhas (`line-clamp-2`) em 12px cinza `#888888`.
4. **Visualizador de Mídia Embutido (`ExerciseMediaViewer`):**
   * Renderizado caso o exercício possua URL de vídeo ou imagem válida.
5. **Botão de Ação Inferior:**
   * Botão "Editar / Mídia" com ícone `Edit3` alinhado à direita no rodapé do card.

---

## 4. Estado Vazio (Empty State)
* Caso a busca textual ou o filtro selecionado não encontre correspondências:
  * Exibe container centralizado com cantos de 32px, ícone `Dumbbell` cinza de 32x32px, título "Nenhum exercício encontrado" e texto sugerindo buscar por outro termo ou cadastrar um novo exercício.

---

## 5. Regras de Negócio e Validações
1. **Busca Não Sensível a Maiúsculas/Minúsculas:** O filtro de busca pesquisa simultaneamente no `name`, no `muscleGroup` e nas `instruction` de cada exercício.
2. **Sanitização de Mídia:** Se o usuário cadastrar um link curto do YouTube (`youtu.be/xyz`) ou link com parâmetros extras, o sistema deve normalizar para reprodução sem erros.
3. **Persistência de Novos Exercícios:** Exercícios criados pelo usuário são salvos com ID prefixado `ex_custom_` e ficam imediatamente disponíveis para inclusão em qualquer treino.
