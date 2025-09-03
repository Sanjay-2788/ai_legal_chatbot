'use server';

import {
  topicSpecificAnswer,
  type TopicSpecificAnswerInput,
} from '@/ai/flows/topic-specific-answer-generation';
import { z } from 'zod';

const actionSchema = z.object({
  topic: z.string(),
  question: z.string(),
  language: z.enum(['en', 'ta']),
});

export async function getAIResponse(input: TopicSpecificAnswerInput): Promise<{
  answer?: string;
  error?: string;
}> {
  const parsedInput = actionSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const output = await topicSpecificAnswer(parsedInput.data);
    return { answer: output.answer };
  } catch (e) {
    console.error('AI Error:', e);
    return { error: 'An error occurred while fetching the AI response.' };
  }
}
