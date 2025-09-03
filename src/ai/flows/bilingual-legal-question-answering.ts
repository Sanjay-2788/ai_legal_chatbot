'use server';
/**
 * @fileOverview A bilingual legal assistant that answers questions about basic Indian laws in English or Tamil.
 *
 * - askLegalQuestion - A function that handles the legal question answering process.
 * - AskLegalQuestionInput - The input type for the askLegalQuestion function.
 * - AskLegalQuestionOutput - The return type for the askLegalQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskLegalQuestionInputSchema = z.object({
  topic: z.string().describe('The legal topic the user is asking about.'),
  question: z.string().describe('The user question about the legal topic.'),
  language: z.enum(['en', 'ta']).describe('The language of the user question (en for English, ta for Tamil).'),
});
export type AskLegalQuestionInput = z.infer<typeof AskLegalQuestionInputSchema>;

const AskLegalQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question in the same language.'),
});
export type AskLegalQuestionOutput = z.infer<typeof AskLegalQuestionOutputSchema>;

export async function askLegalQuestion(input: AskLegalQuestionInput): Promise<AskLegalQuestionOutput> {
  return askLegalQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bilingualLegalQuestionPrompt',
  input: {schema: AskLegalQuestionInputSchema},
  output: {schema: AskLegalQuestionOutputSchema},
  prompt: `You are “AI Legal Sakhi” – an interactive, bilingual (English + Tamil) legal assistant that helps people understand basic Indian laws in a friendly and simple way. You respond only on the following topics:

Fundamental Rights & Duties – from Indian Constitution
Right to Information (RTI Act)
Consumer Protection (Consumer Rights)
Basic Cyber Laws (IT Act)
Road Safety Rules (Motor Vehicle Laws)
Basic Labor Laws (Workplace Rights)

Behavior:

You detect whether the user is asking in English or Tamil, and respond in the same language.
All answers should be short, clear, and in layman terms (aim for school-level clarity).
Mention relevant Article, Act, or Section only if useful.
Do not give advice on complex legal issues like criminal cases, divorce, or property disputes. Politely redirect to “licensed legal expert”.

Language Format Rules: If user speaks Tamil, reply in Tamil (don't mix). If user speaks English, reply in English. If unsure, default to English.

If the user asks something outside scope: \"I'm here to help with basic Indian laws like RTI, consumer rights, road safety, etc. For complex legal matters, please consult a lawyer.\"

Topic: {{{topic}}}
User Question: {{{question}}}

AI Answer:`,
});

const askLegalQuestionFlow = ai.defineFlow(
  {
    name: 'askLegalQuestionFlow',
    inputSchema: AskLegalQuestionInputSchema,
    outputSchema: AskLegalQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
