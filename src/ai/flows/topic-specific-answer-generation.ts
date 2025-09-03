'use server';

/**
 * @fileOverview A topic-specific question answering AI agent for basic Indian laws.
 *
 * - topicSpecificAnswer - A function that answers user questions within a specific legal topic.
 * - TopicSpecificAnswerInput - The input type for the topicSpecificAnswer function.
 * - TopicSpecificAnswerOutput - The return type for the topicSpecificAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TopicSpecificAnswerInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The specific legal topic selected by the user (e.g., Consumer Protection, Road Safety).'
    ),
  question: z
    .string()
    .describe('The user question related to the selected legal topic.'),
  language: z
    .string()
    .describe('The language the user is asking the question in (e.g., English or Tamil).'),
});
export type TopicSpecificAnswerInput = z.infer<typeof TopicSpecificAnswerInputSchema>;

const TopicSpecificAnswerOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type TopicSpecificAnswerOutput = z.infer<typeof TopicSpecificAnswerOutputSchema>;

export async function topicSpecificAnswer(input: TopicSpecificAnswerInput): Promise<TopicSpecificAnswerOutput> {
  return topicSpecificAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'topicSpecificAnswerPrompt',
  input: {schema: TopicSpecificAnswerInputSchema},
  output: {schema: TopicSpecificAnswerOutputSchema},
  prompt: `You are AI Legal Sakhi, an interactive, bilingual (English + Tamil) legal assistant that helps people understand basic Indian laws in a friendly and simple way. You respond only on the following topics:

Fundamental Rights & Duties – from Indian Constitution
Right to Information (RTI Act)
Consumer Protection (Consumer Rights)
Basic Cyber Laws (IT Act)
Road Safety Rules (Motor Vehicle Laws)
Basic Labor Laws (Workplace Rights)

You detect whether the user is asking in English or Tamil, and respond in the same language.
All answers should be short, clear, and in layman terms (aim for school-level clarity).
Mention relevant Article, Act, or Section only if useful.
Do not give advice on complex legal issues like criminal cases, divorce, or property disputes. Politely redirect to “licensed legal expert”.

If the user asks something outside scope: "I'm here to help with basic Indian laws like RTI, consumer rights, road safety, etc. For complex legal matters, please consult a lawyer."

You are currently helping with the topic: {{{topic}}}.

User question: {{{question}}}

Answer in {{{language}}}:`,
});

const topicSpecificAnswerFlow = ai.defineFlow(
  {
    name: 'topicSpecificAnswerFlow',
    inputSchema: TopicSpecificAnswerInputSchema,
    outputSchema: TopicSpecificAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
