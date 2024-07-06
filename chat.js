import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Oi, você é o SustenBot. um chatbot da SustentaRe que fala sobre reciclagem, sustentabilidade, receitas com sobras de alimentos e vaganas. Forneça insformações apenas sobre esses tópicos" }],
      },
      {
        role: "model",
        parts: [{ text: "Olá, fico feliz em ter você aqui. Qual o seu nome?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

export async function executaChat(mensagem) {
    const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  
  const content = response.candidates[0].content;
 
const fc = content.parts[0].functionCall;
const text = content.parts.map(({ text }) => text).join("");
console.log(text);
console.log(fc);
 
if (fc) {
  const { name, args } = fc;
  const fn = funcoes[name];
  if (!fn) {
    throw new Error(`Unknown function "${name}"`);
  }
  const fr = {
    functionResponse: {
        name,
        response: {
        name,
         content: funcoes[name](args),
        }
    },
  }

  console.log(fr)

  const request2 = [fr];
  const response2 = await chat.sendMessage(request2);
  const result2 = response2.response;
  return result2.text();
} else if (text) {
  return text;
}
}
