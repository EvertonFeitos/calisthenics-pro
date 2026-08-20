# SPEC 11 — TELA: CONFIGURAÇÕES & AJUSTES (SettingsView)

## 1. Identificação da Tela
* **Nome da Tela:** Configurações do Sistema & Gestão de Dados (SettingsView).
* **Identificador de Rota / Aba:** `settings`.
* **Objetivo:** Permitir ao usuário customizar as preferências globais do cronômetro de descanso, gerenciar efeitos sonoros, restaurar rotinas padrão do nível ativo e realizar a manutenção e redefinição do armazenamento local.

---

## 2. Layout e Estrutura Visual

### 2.1 Banner Superior Bento
* Card com cantos `rounded-[28px]`, fundo `#121212`, borda `#222222`, padding de 20px.
* Tag: "SISTEMA & PREFERÊNCIAS" + Badge "Local-First".
* Título H1: "Ajustes & Configurações" em 18px extra-negrito `#F0F0F0`.
* Descrição: "Personalize o comportamento do cronômetro, áudio e gerencie a integridade do seu banco de dados local."

---

## 3. Seções de Configuração

### 3.1 Seção 1: Preferências de Treino & Cronômetro
* Card Bento (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px, `space-y-4`).
1. **Tempo de Descanso Padrão Global:**
   * Descrição: "Duração aplicada automaticamente aos exercícios sem descanso individual configurado."
   * Pílulas de seleção rápida: `30s`, `60s`, `90s`, `120s` (padrão), `180s`.
   * Pílula ativa: Fundo `#6366f1` (Índigo), texto branco, borda `#6366f1`.
2. **Efeitos Sonoros & Beeps (Web Audio API):**
   * Interruptor (Toggle Switch) ou botão com ícone `Volume2` / `VolumeX`.
   * Texto explicativo: "Emite beeps de contagem 3, 2, 1s e toques harmônicos ao concluir séries e descansos."
   * Botão "Testar Som": Toca o acorde de conclusão para verificação imediata.

### 3.2 Seção 2: Manutenção de Dados & Restauração
* Card Bento (`bg-[#121212]`, borda `#222222`, cantos `rounded-[28px]`, padding de 20px, `space-y-3.5`).
1. **Restaurar Grade Padrão do Nível Ativo (`#reset-level-schedule-btn`):**
   * Botão com fundo `#181818`, borda `#262626`, texto `#CCCCCC`, hover texto `#f59e0b`, ícone `RotateCcw`.
   * Ação: Restaura a distribuição dos treinos do nível selecionado para a configuração de fábrica sem apagar o histórico de treinos.
2. **Limpar Todo o Histórico de Treinos (`#clear-history-btn`):**
   * Botão com borda rosa `#f43f5e` com 30% de opacidade, texto rosa `#f43f5e`, hover fundo `#f43f5e/10`, ícone `Trash2`.
   * Ação: Exibe modal de confirmação de segurança antes de esvaziar o array de sessões.
3. **Redefinição de Fábrica Completa (Factory Reset):**
   * Botão com texto rosa avermelhado e ícone `AlertTriangle`.
   * Ação: Limpa todas as chaves do `localStorage` e recarrega os dados iniciais do zero.

### 3.3 Seção 3: Informações do Aplicativo
* Card Bento com metadados do sistema:
  * Versão da Aplicação: `1.0.0 (Bento Engine)`
  * Arquitetura: Single Page Application (SPA), Client-First, Offline-First
  * Armazenamento Ativo: LocalStorage Nativo Isolado
  * Modelo IA: Google Gemini 2.5 Flash

---

## 4. Validações e Regras de Segurança
1. **Confirmação em Duas Etapas:** Ações de limpeza e redefinição de fábrica exigem confirmação explícita em modal para evitar perda acidental de dados de treino.
2. **Persistência Imediata:** Alterações no tempo de descanso e configurações de áudio são salvas instantaneamente no repositório.
