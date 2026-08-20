import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini AI analysis route (Server-side to protect API key)
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { history, currentLevel, goals, schedule, currentWorkouts, userNotes } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Chave da API Gemini não configurada no servidor. Configure a variável GEMINI_API_KEY no painel de Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Você é um treinador especialista em calistenia e condicionamento físico pelo peso corporal.
Analise os dados reais de treino do usuário abaixo e forneça sugestões e recomendações personalizadas, progressivas e motivadoras.

DADOS DO USUÁRIO:
- Nível Atual: ${currentLevel || 'Básico'}
- Objetivos Informados: ${goals ? JSON.stringify(goals) : 'Desenvolver força, consistência e domínio corporal'}
- Observações adicionais do usuário: ${userNotes || 'Nenhuma'}
- Quantidade de treinos no histórico: ${Array.isArray(history) ? history.length : 0}
- Histórico Recente de Treinos: ${JSON.stringify(history?.slice(0, 8) || [])}
- Grade Atual: ${JSON.stringify(schedule || [])}
- Treinos configurados: ${JSON.stringify(currentWorkouts || [])}

DIRETRIZES:
1. Seja motivador, objetivo e focado em progressão segura na calistenia.
2. Analise o volume real executado (repetições reais vs metas) e a consistência.
3. Se o usuário estiver com dificuldades para atingir metas, sugira variações mais acessíveis ou ajustes no descanso. Se estiver superando as metas com facilidade, sugira progressão.
4. Forneça sugestões estruturadas em JSON com:
   - summary: Resumo da avaliação física/consistência (1 a 2 parágrafos amigáveis em português)
   - keyInsights: Lista de 3 a 5 pontos fortes ou pontos de atenção observados
   - suggestedAdjustments: Lista de sugestões práticas para rotina, séries, descanso ou exercícios
   - recommendedFocus: Foco recomendado para as próximas 2 semanas
   - motivationalTip: Uma dica prática ou frase motivacional sobre a consistência na calistenia.

Responda ESTRITAMENTE em formato JSON compatível com o schema requisitado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Resumo da avaliação do histórico e consistência do usuário',
            },
            keyInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Principais descobertas e percepções de evolução',
            },
            suggestedAdjustments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'Volume, Descanso, Progressão, Exercício ou Frequência' },
                },
                required: ['title', 'description', 'category'],
              },
              description: 'Ajustes sugeridos para o usuário considerar',
            },
            recommendedFocus: {
              type: Type.STRING,
              description: 'Foco prioritário para as próximas sessões',
            },
            motivationalTip: {
              type: Type.STRING,
              description: 'Dica motivadora e prática para calistenia',
            },
          },
          required: ['summary', 'keyInsights', 'suggestedAdjustments', 'recommendedFocus', 'motivationalTip'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Resposta vazia recebida do modelo Gemini.');
    }

    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Erro na análise do Gemini:', error);
    return res.status(500).json({
      error: error?.message || 'Falha ao processar a análise com inteligência artificial.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Calistenia Pro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
