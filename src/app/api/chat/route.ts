import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getInternship } from './tools/getInternship';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getSports } from './tools/getSports';
import { getWeather } from './tools/getWeather';

// Create DeepSeek client (OpenAI-compatible API)
const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages, isVoiceMode } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    const systemPromptToCheck = isVoiceMode
      ? { ...SYSTEM_PROMPT, content: SYSTEM_PROMPT.content + '\n\nIMPORTANT: You are currently speaking via voice. Keep your responses VERY short, concise, and conversational. Limit responses to 1-2 sentences max unless asked for a long explanation. Do not use markdown formatting like bold or lists, as they are spoken.' }
      : SYSTEM_PROMPT;

    messages.unshift(systemPromptToCheck);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getInternship,
      getWeather,
    };

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages,
      toolCallStreaming: true,
      tools,
      maxSteps: 2,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (err) {
    console.error('Global error:', err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}
