# SPEC 10 — TELA: IA COACH (AICoachView)

## 1. Identificação da Tela
* **Nome da Tela:** Treinador Virtual & Análise Inteligente com Gemini (AICoachView).
* **Identificador de Rota / Aba:** `coach`.
* **Objetivo:** Permitir ao usuário definir suas metas individuais de treino, enviar o histórico de desempenho para processamento por Inteligência Artificial (Google Gemini) e receber diagnósticos personalizados, ajustes de rotina e recomendações estratégicas para as próximas semanas.

---

## 2. Layout e Estrutura Visual

### 2.1 Banner Superior Bento
* Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
* Tag: "INTELIGÊNCIA ARTIFICIAL" + Badge com ícone `Sparkles` e texto "Gemini Engine".
* Título H1: "IA Coach — Treinador Pessoal" em 18px extra-negrito `#F0F0F0`.
* Descrição: "Análise inteligente baseada no seu histórico real de repetições, consistência semanal e objetivos específicos."

---

## 3. Card: Configuração de Metas do Praticante (User Goals Card)

### 3.1 Estrutura do Formulário
* Card Bento (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px, `space-y-4`).
* Cabeçalho: Título "Suas Metas & Perfil" com ícone `Target` e botão de alternância para recolher/expandir o formulário.

### 3.2 Campos do Formulário
1. **Objetivo Primário (`primaryGoal`):**
   * `<input type="text">` obrigatório.
   * Placeholder: "Ex: Conquistar 10 barras fixas estritas e dominar a flexão diamante..."
   * Fundo `#181818`, borda `#2a2a2a`, cantos de 16px.
2. **Dias Semanais Alvo (`weeklyTargetDays`):**
   * Pílulas de seleção de 3, 4, 5 ou 6 dias por semana.
   * Pílula ativa: Fundo `#6366f1` (Índigo), texto branco.
3. **Tempo de Prática Prévia (`experienceMonths`):**
   * `<input type="number">` (0 a 120 meses).
4. **Observações de Foco / Lesões (`focusNotes`):**
   * `<textarea rows="2">`.
   * Placeholder: "Ex: Sinto dor no punho em flexões retas, prefiro barras paralelas..."
5. **Botão Salvar Metas:**
   * Fundo `#181818`, borda `#262626`, texto `#CCCCCC` com ícone `Save`.

---

## 4. Disparo e Execução da Análise de IA

### 4.1 Botão de Solicitação de Análise
* Botão destacado de largura total (`#request-ai-analysis-btn`):
  * Fundo `#6366f1` (Índigo 600) com hover `#4f46e5`, texto branco, altura de 50px, cantos `rounded-full`, sombra `shadow-lg shadow-indigo-600/30`.
  * Ícone `Sparkles` animado.
  * Rótulo: "Solicitar Análise de Treinamento com IA".

### 4.2 Estado de Carregamento (Loading State)
* Enquanto a requisição ao endpoint `/api/gemini/analyze` estiver pendente:
  * O botão é desabilitado (`disabled`).
  * Exibe spinner circular de rotação contínua e texto "Analisando seu histórico com IA Gemini...".
  * Card com efeito de pulso e mensagens dinâmicas de processamento ("Avaliando volume semanal...", "Calculando taxa de recuperação...").

---

## 5. Exibição do Relatório de Análise da IA

### 5.1 Card de Diagnóstico Geral
* Fundo `#121212`, borda `#6366f1` com 30% de opacidade, cantos `rounded-[28px]`, padding de 20px.
* Cabeçalho: Badge com carimbo de data da análise + Ícone `Bot` em tom Índigo.
* Título: "Diagnóstico do Treinador" em 16px extra-negrito `#F0F0F0`.
* Texto do Resumo (`summary`): Parágrafo detalhado com avaliação técnica da consistência do usuário.

### 5.2 Destaques e Pontos de Atenção (`keyInsights`)
* Lista com marcadores estilizados:
  * Ícone de verificação esmeralda `#10b981` para conquistas e pontos positivos.
  * Ícone de alerta âmbar `#f59e0b` para assimetrias ou volumes excessivos.

### 5.3 Recomendações Práticas (`suggestedAdjustments`)
* Grade de cards internos com cantos `rounded-2xl`, fundo `#161616`, borda `#262626`:
  * Categoria da recomendação (ex: "Descanso", "Técnica", "Volume").
  * Título da sugestão em 13px negrito `#F0F0F0`.
  * Descrição detalhada da ação que o atleta deve tomar.

### 5.4 Foco para as Próximas 2 Semanas (`recommendedFocus`)
* Card com fundo azul-marinho escuro (`#14162e`), borda `#6366f1` com 40% de opacidade, ícone `Target` e instruções diretas de periodização.

### 5.5 Dica de Mentalidade e Consistência (`motivationalTip`)
* Citação em destaque no rodapé do relatório entre aspas estilizadas em itálico.

---

## 6. Tratamento de Erros e Fallback
* Caso o backend retorne erro (ex: ausência de chave de API ou falha de conectividade):
  * A tela exibe card com borda rosa `#f43f5e`, ícone `AlertCircle`, mensagem clara do erro e instruções de contingência sem travar a navegação da aplicação.
