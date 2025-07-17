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
  budgets: z.string().optional().describe('JSON string of user-defined budgets per category.'),
  goals: z.string().optional().describe('JSON string of user-defined financial goals.'),
});
export type SpendingAdviceInput = z.infer<typeof SpendingAdviceInputSchema>;

const SpendingAdviceOutputSchema = z.object({
  advice: z.string().describe('AI-powered advice on how to optimize spending habits for the upcoming months. Use markdown for formatting.'),
});
export type SpendingAdviceOutput = z.infer<typeof SpendingAdviceOutputSchema>;

export async function getSpendingAdvice(input: SpendingAdviceInput): Promise<SpendingAdviceOutput> {
  return spendingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingAdvicePrompt',
  input: {schema: SpendingAdviceInputSchema},
  output: {schema: SpendingAdviceOutputSchema},
  prompt: `You are a friendly and encouraging personal finance advisor. Your goal is to provide actionable, personalized, and easy-to-understand advice to help users manage their money better.

  **User's Financial Snapshot:**
  - Monthly Income: {{income}} INR
  - Spending Data (JSON): {{{spendingData}}}
  - Budgets (JSON): {{{budgets}}}
  - Savings Goals (JSON): {{{goals}}}

  **Your Task:**
  Based on the user's financial data, provide personalized recommendations for the next {{monthsAhead}} months. Format your response using Markdown for readability (e.g., use headings, bold text, and bullet points).

  1.  **Analyze Spending:** Identify the top 2-3 spending categories. Are there any areas where spending seems unusually high compared to a typical budget?
  2.  **Compare with Budgets:** If budget data is available, compare the user's actual spending against their set budgets.
      - Praise them for categories where they are under budget.
      - Gently point out categories where they've gone over budget and suggest specific, practical ways to cut back. For example, instead of "spend less on food," suggest "try meal prepping or using a grocery list to avoid impulse buys."
  3.  **Connect to Goals:** If goal data is available, calculate how much they need to save monthly to reach their goals by the deadline. Suggest how they could adjust their spending to meet these savings targets.
  4.  **Provide Actionable Tips:** Offer a short list of 3-5 clear, actionable tips. These should be your main recommendations.
  5.  **Look Ahead:** Briefly mention what they could do with the money they save (e.g., "The money you save here could be put towards your vacation goal!").

  **Tone:**
  Be positive and empowering. Avoid being judgmental. Use a friendly tone, like a knowledgeable friend.
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
