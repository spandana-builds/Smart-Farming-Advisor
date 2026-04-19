import { EDGE_FUNCTION_URL, getSessionId } from './supabase';
import { WeatherInput, Recommendations, ChatMessage } from '../types';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
};

export async function fetchRecommendations(
  cropId: string,
  cropName: string,
  weather: WeatherInput
): Promise<{ recommendations: Recommendations; sessionRecordId: string | null }> {
  const res = await fetch(`${EDGE_FUNCTION_URL}/recommendations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      cropId,
      cropName,
      ...weather,
      sessionId: getSessionId(),
    }),
  });
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  const data = await res.json();
  return {
    recommendations: data.recommendations,
    sessionRecordId: data.sessionRecord?.id ?? null,
  };
}

export async function sendChatMessage(
  question: string,
  cropId: string,
  temperature: number,
  humidity: number,
  farmingSessionId: string | null,
  context: string
): Promise<string> {
  const res = await fetch(`${EDGE_FUNCTION_URL}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      question,
      cropId,
      temperature,
      humidity,
      farmingSessionId,
      sessionId: getSessionId(),
      context,
    }),
  });
  if (!res.ok) throw new Error('Failed to get AI response');
  const data = await res.json();
  return data.answer;
}

export async function fetchHistory() {
  const sessionId = getSessionId();
  const res = await fetch(`${EDGE_FUNCTION_URL}/history?session_id=${sessionId}`, {
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch history');
  const data = await res.json();
  return data.history ?? [];
}

export function buildInitialMessages(cropName: string, weather: WeatherInput): ChatMessage[] {
  return [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Hello! I'm your Smart Farming AI Advisor. I've analyzed the conditions for your **${cropName}** crop:\n\n- Temperature: **${weather.temperature}°C** | Humidity: **${weather.humidity}%**\n- Location: **${weather.location || 'Custom input'}** | Season: **${weather.season}**\n\nI'm ready to answer any questions about irrigation, fertilizers, pest management, or general farming tips. What would you like to know?`,
      timestamp: new Date(),
    },
  ];
}
