'use server';

/**
 * @fileOverview AI-powered spending advice flow.
 *
 * - getSpendingAdvice - A function that provides spending advice based on user's financial data.
 * - SpendingAdviceInput - The input type for the getSpendingAdvice function.
 * - SpendingAdviceOutput - The return type for the getSpendingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingAdviceInputSchema = z.object({
  income: z.number().describe('Total income for the last month in INR.'),
  spendingData: z.string().describe('JSON string of spending data, including categories and amounts.'),
  monthsAhead: z.number().default(3).describe('The number of months ahead to provide advice for.'),
});
export type SpendingAdviceInput = z.infer<typeof SpendingAdviceInputSchema>;

const SpendingAdviceOutputSchema = z.object({
  advice: z.string().describe('AI-powered advice on how to optimize spending habits for the upcoming months.'),
});
export type SpendingAdviceOutput = z.infer<typeof SpendingAdviceOutputSchema>;

export async function getSpendingAdvice(input: SpendingAdviceInput): Promise<SpendingAdviceOutput> {
  return spendingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingAdvicePrompt',
  input: {schema: SpendingAdviceInputSchema},
  output: {schema: SpendingAdviceOutputSchema},
  prompt: `You are a personal finance advisor specializing in providing spending advice.

  Based on the user's income and past spending data, provide personalized recommendations on how to optimize their spending habits for the upcoming months. Consider suggesting ways to reduce expenses in specific categories or increase savings.
  The spending advice should be formatted nicely and be easy to read.

  Income: {{income}} INR
  Spending Data: {{{spendingData}}}
  Months Ahead: {{monthsAhead}}
  `,
});

const spendingAdviceFlow = ai.defineFlow(
  {
    name: 'spendingAdviceFlow',
    inputSchema: SpendingAdviceInputSchema,
    outputSchema: SpendingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
