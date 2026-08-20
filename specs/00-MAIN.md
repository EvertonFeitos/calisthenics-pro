# SPEC 00 — MAIN (Visão Geral da Aplicação)

## 1. Identificação da Aplicação
* **Nome da Aplicação:** Calistenia Pro (Bento Workout Engine)
* **Versão da Especificação:** 1.0.0
* **Paradigma:** Single Page Application (SPA), Client-First, Offline-First (com suporte PWA) e integração opcional com backend para serviços de Inteligência Artificial Generativa.
* **Idioma Padrão da Interface:** Português do Brasil (pt-BR).

---

## 2. Objetivo da Aplicação e Problema que Resolve

### 2.1 Objetivo
Prover uma plataforma interativa, progressiva e visualmente imersiva para o treinamento estruturado de calistenia e exercícios com peso corporal. O sistema organiza a evolução do atleta desde o nível mais básico (Iniciante Absoluto) até o nível de alta performance (Atleta de Elite), fornecendo rotinas semanais, biblioteca de exercícios com mídias tutoriais (vídeos e imagens), execução de treinos guiados em tempo real com cronômetro inteligente e controle sonoro, registro detalhado de repetições/isometrias, histórico perpétuo, análise gráfica de desempenho e diagnósticos adaptativos orientados por Inteligência Artificial (Gemini).

### 2.2 Problema que Resolve
* **Falta de progressão estruturada:** Praticantes de calistenia frequentemente estagnam por não saberem a sequência correta de progressão neuromuscular e articular.
* **Execução técnica incorreta:** Falta de referência visual imediata sobre pegada, protração escapular, alinhamento pélvico e postura.
* **Falta de controle durante o treino:** Dificuldade de cronometrar descansos entre séries e registrar o volume real de treino (repetições e segundos de sustentação).
* **Dependência excessiva de conexão:** Perda de dados em ambientes sem internet (parques, praças de calistenia, garagens).
* **Ausência de análise adaptativa:** Falta de feedback personalizado sobre fadiga, volume semanal e metas individuais.

---

## 3. Público-Alvo e Personas

### 3.1 Público-Alvo
* Praticantes de calistenia, ginástica funcional e musculação com peso corporal de todos os níveis (iniciantes a atletas avançados).
* Usuários que treinam em casa, parques ou academias e necessitam de uma ferramenta rápida e sem atritos de login para guiar suas sessões.

### 3.2 Personas Representativas
1. **Lucas (Iniciante):** Nunca conseguiu fazer uma barra fixa ou flexão completa. Precisa de progressões facilitadas (na parede, de joelhos, australiana) e vídeos tutoriais claros.
2. **Mariana (Intermediária):** Treina 4 vezes por semana, busca hipertrofia e definição através de variações intermediárias (dips paralelas, flexão diamante, flexão arqueiro).
3. **Gabriel (Avançado/Elite):** Busca skills avançadas (Muscle-up, Planche, Front Lever, Handstand Push-up). Necessita de controle de isometrias em segundos e ajustes finos nas rotinas.

---

## 4. Funcionalidades Principais

1. **Progressão Multinível em 5 Estágios:**
   * Nível 1: Iniciante Absoluto (Adaptação anatômica e fortalecimento articular)
   * Nível 2: Básico Consolidado (Primeiras barras, flexões e agachamentos com peso corporal)
   * Nível 3: Intermediário (Força explosiva, dips, variações de pegada e volume elevado)
   * Nível 4: Avançado (Movimentos de alavanca, muscle-ups, isometrias de alta intensidade)
   * Nível 5: Atleta de Elite (Skills completas, planche, front lever, handstand push-ups)
2. **Grade Semanal Dinâmica e Customizável:**
   * Visualização da rotina semanal por dias (ex: Dia 1 ao Dia 7).
   * Identificação clara de dias de treino e dias de descanso ativo.
   * Editor de grade: adição, remoção, alteração de treinos e alternância para descanso.
3. **Biblioteca Completa de Movimentos com Mídia Embutida:**
   * Catálogo categorizado por padrão de movimento (Empurrar/Push, Puxar/Pull, Pernas/Core, Braços/Arms, Skills/Isometrias).
   * Player de vídeo embutido (YouTube, Vimeo, MP4 direto) e exibição de fotos ilustrativas de técnica correta.
   * CRUD completo de exercícios (criação, edição de instruções, dicas e mídias, exclusão).
4. **Execução de Treino Ativo em Tempo Real:**
   * Modo de tela cheia com interface de alto contraste.
   * Alternância entre Fase de Trabalho (Working) e Fase de Descanso (Resting).
   * Modos de temporização: Modo Manual (registro pós-série) e Modo Automático (Work/Rest contínuo para isometrias).
   * Timer circular com contagem regressiva, alertas sonoros multitonais (beeps de 3, 2, 1 e gongo de finalização) e ajustes rápidos (+15s, -15s, presets de 30s a 180s).
   * Registro individual de repetições ou segundos por série realizada.
5. **Resumo Pós-Treino e Celebração:**
   * Efeito de confetes festivos, métricas totais consolidadas (duração, séries concluídas, volume de reps/isometria) e discriminação por exercício.
6. **Histórico Permanente de Sessões:**
   * Linha do tempo de todos os treinos realizados com datas, horários e duração.
   * Detalhamento expansível série a série por exercício.
   * Exclusão individual de registros.
7. **Dashboard de Métricas e Evolução:**
   * Totalizadores de volume acumulado (repetições totais, segundos de isometria, minutos em treino, treinos concluídos).
   * Recordes Pessoais (PR - Personal Records) por exercício com base nas repetições máximas reais.
   * Linha do tempo evolutiva de cada exercício série a série ao longo das semanas.
8. **IA Coach (Treinador Inteligente com Gemini):**
   * Configuração de metas do usuário (objetivo primário, frequência semanal alvo, tempo de prática, observações de fadiga/foco).
   * Análise do histórico real de treinos via Gemini para diagnóstico de volume, recuperação, pontos de atenção e recomendações para as próximas 2 semanas.
   * Salvamento e consulta de relatórios anteriores de análise.
9. **Central de Ajustes e Manutenção:**
   * Configuração de tempo de descanso padrão global (30s, 60s, 90s, 120s, 180s).
   * Ativação/Desativação de efeitos sonoros com Web Audio API.
   * Restauração da grade padrão do nível ativo e redefinição completa de dados locais.

---

## 5. Estrutura Global e Fluxos Principais

### 5.1 Hierarquia de Navegação
A aplicação opera em uma estrutura de abas principais acessíveis via barra de navegação inferior flutuante (`BottomNav`) e cabeçalho fixo superior (`Header`):
1. **Aba Grade (`schedule`):** Visualização e edição da rotina semanal do nível selecionado.
2. **Aba Exercícios (`exercises`):** Biblioteca, busca, filtros de categoria e editor de movimentos.
3. **Aba Histórico (`history`):** Registro cronológico de todas as sessões finalizadas.
4. **Aba Progresso (`progress`):** Métricas consolidadas, Recordes Pessoais (PRs) e evolução por exercício.
5. **Aba IA Coach (`coach`):** Diagnóstico inteligente, formulário de metas e recomendações.
6. **Aba Ajustes (`settings`):** Configurações do motor de treino e armazenamento.

### 5.2 Telas Sobrepostas / Modais em Tela Cheia
* **Tela de Treino Ativo (`ActiveWorkoutView`):** Renderizada em tela cheia (`fixed inset-0 z-40`) bloqueando a navegação comum durante a execução da rotina.
* **Tela de Resumo Pós-Treino (`PostWorkoutSummary`):** Renderizada após a conclusão de todas as séries do treino ativo.
* **Modais Centrais (`WorkoutDetailModal`, `WorkoutEditorModal`, `ExerciseEditorModal`, `ScheduleEditorModal`):** Diálogos com fundo semitransparente escuro (`backdrop-blur`).

### 5.3 Fluxos de Usuário Passo a Passo

#### Fluxo 1: Seleção de Nível e Inicialização de Treino
1. O usuário visualiza o nível atual no `Header` ou no `LevelSelector`.
2. O usuário pode trocar de nível (Nível 1 ao 5) a qualquer momento. A grade de treinos se atualiza instantaneamente para a rotina correspondente ao nível selecionado.
3. O usuário localiza o dia atual na Grade Semanal.
4. O usuário clica em "Ver Detalhes" para inspecionar os exercícios ou clica diretamente em "Iniciar".
5. A aplicação abre a tela cheia de **Treino Ativo**.

#### Fluxo 2: Execução de Série e Descanso
1. O usuário visualiza o exercício atual, meta sugerida (ex: 8 repetições) e vídeo/imagem explicativa.
2. O usuário executa o movimento na barra/chão.
3. O usuário ajusta o valor numérico de repetições realizadas (ou usa o botão de incremento `+` / decremento `-` ou botões de atalho rápido).
4. O usuário clica no botão "CONCLUIR SÉRIE".
5. O sistema toca o efeito sonoro de conclusão de série e transita imediatamente para a **Fase de Descanso (Resting)**.
6. O cronômetro circular inicia a contagem regressiva a partir do tempo de descanso definido (ex: 120 segundos).
7. Aos 3, 2 e 1 segundos restantes, o sistema emite bips sonoros curtos de alerta.
8. Ao zerar o descanso, o sistema emite o sinal sonoro de finalização de descanso e transita automaticamente para a próxima série ou para o próximo exercício.
9. O usuário pode clicar em "Pular Descanso" a qualquer momento para iniciar imediatamente a próxima série.

#### Fluxo 3: Finalização e Consolidação
1. Ao concluir a última série do último exercício, o sistema executa o som comemorativo de finalização de treino.
2. A sessão completa é empacotada com identificadores, carimbo de data/hora (ISO 8601), duração em segundos e desempenho série a série, sendo persistida no repositório local.
3. O sistema renderiza a tela de **Resumo Pós-Treino** disparando efeito de confetes.
4. O usuário pode escolher entre "Ver Histórico Completo" (navega para a aba `history`) ou "Voltar para a Grade" (retorna para a aba `schedule`).

#### Fluxo 4: Consulta e Atualização da Análise IA
1. O usuário acessa a aba **IA Coach**.
2. O usuário preenche ou atualiza seus objetivos (ex: "Consolidar 10 barras fixas estritas").
3. O usuário clica em "Solicitar Análise de Treinamento com IA".
4. O cliente envia o histórico de sessões, nível atual, grade e objetivos para o endpoint `/api/gemini/analyze`.
5. O servidor formata o prompt de engenharia e invoca o modelo Gemini com schema JSON estruturado estrito.
6. O resultado retornado é salvo no repositório local e exibido em cards de diagnóstico, pontos fortes, sugestões práticas e foco para as próximas 2 semanas.

---

## 6. Regras Globais da Aplicação

1. **Acesso Total Livre e Imediato:** Todos os 5 níveis, exercícios, rotinas e ferramentas são desbloqueados por padrão. O usuário não deve ser bloqueado por paywalls ou travas artificiais de progressão.
2. **Persistência Local-First:** Qualquer alteração em exercícios, personalizações de rotinas, histórico de sessões, preferências ou análises de IA deve ser persistida imediatamente no armazenamento local (`localStorage`), sobrevivendo ao fechamento da aba ou reinicialização do dispositivo.
3. **Desacoplamento do Repositório:** A interface deve interagir exclusivamente com uma camada de repositório abstrata (`IStorageRepository`), permitindo futura substituição ou sincronização com banco de dados em nuvem (ex: Supabase / PostgreSQL) sem refatoração dos componentes visuais.
4. **Resiliência a Falhas de Mídia:** Se uma URL de imagem ou vídeo de exercício falhar, quebrar ou não existir, a interface deve degradar graciosamente ocultando o reprodutor e mantendo as instruções textuais legíveis, sem disparar exceções de runtime.
5. **Auditoria e Não Destrutividade da IA:** As análises geradas pela IA são estritamente consultivas. A IA **nunca** deve alterar ou deletar automaticamente a grade, exercícios ou histórico sem a ação deliberada do usuário.
6. **Autonomia do Cronômetro:** O cronômetro de treino e descanso deve manter a contagem consistente através de intervalos em segundos, com possibilidade de pausa e retomada.

---

## 7. Requisitos Não Funcionais

* **Tempo de Resposta / Interação:** Mudanças de estado de timer e toques em botões de séries devem responder em menos de 50ms.
* **Tamanho de Pacote e Dependências:** A aplicação utiliza bibliotecas padrão para ícones (`lucide-react`), áudio sintetizado via API nativa Web Audio API (`AudioContext`), e opcionalmente `canvas-confetti` para celebração.
* **Compatibilidade e Responsividade:** Suporte completo a navegadores modernos em telas Mobile (320px a 639px), Tablet (640px a 1023px) e Desktop (1024px a 1920px+).
* **Acessibilidade:** Elementos interativos com dimensões mínimas de toque de 44x44px em dispositivos móveis, alto contraste visual (fundo escuro #080808/#121212 com texto claro #F0F0F0) e rótulos de acessibilidade (`aria-label`) em botões baseados em ícones.

---

## 8. Diagrama de Relacionamento entre Telas e Estados

```
               +----------------------------------------------------+
               |              HEADER (Fixo no Topo)                 |
               |  [Logo Calistenia Pro] [Seletor Nível] [Som] [Total]|
               +----------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                   BARRA DE NAVEGAÇÃO INFERIOR (BottomNav)             |
     | [1. Grade]  [2. Exercícios]  [3. Histórico]  [4. Progresso]  [5. Coach] [6. Ajustes]|
     +-----+--------------+--------------+---------------+-------------+-----------+---+
           |              |              |               |             |           |
           v              v              v               v             v           v
     +-----------+  +------------+  +-----------+  +------------+  +-------+  +---------+
     | GradeView |  | Exercises  |  | History   |  | Progress   |  | AI    |  | Settings|
     | (Semanal) |  | Directory  |  | (Sessões) |  | (Métricas) |  | Coach |  | View    |
     +-----+-----+  +-----+------+  +-----------+  +------------+  +-------+  +---------+
           |              |
     (Iniciar)      (Novo / Editar)
           |              |
           v              v
     +--------------------------------+       +----------------------+
     |      ActiveWorkoutView         |       | ExerciseEditorModal  |
     |   (Treino Ativo Tela Cheia)    |       +----------------------+
     |  [Working Phase / Rest Phase]  |
     +----------------+---------------+
                      |
                 (Concluir)
                      |
                      v
     +--------------------------------+
     |      PostWorkoutSummary        |
     |   (Resumo Pós-Treino / Confete)|
     +----------------+---------------+
                      |
             +--------+--------+
             v                 v
     (Ver Histórico)    (Voltar à Grade)
```
