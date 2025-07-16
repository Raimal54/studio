'use server';

/**
 * @fileOverview AI-powered debt payoff advice flow.
 *
 * - getDebtPayoffAdvice - A function that provides a debt repayment strategy.
 * - DebtPayoffAdviceInput - The input type for the getDebtPayoffAdvice function.
 * - DebtPayoffAdviceOutput - The return type for the getDebtPayoffAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LoanSchema = z.object({
  name: z.string().describe('The name of the loan (e.g., "Personal Loan", "Car Loan").'),
  balance: z.number().describe('The current outstanding balance of the loan in INR.'),
  interestRate: z.number().describe('The annual interest rate (APR) of the loan as a percentage (e.g., 12.5).'),
  minimumPayment: z.number().describe('The minimum monthly payment for the loan in INR.'),
});

const DebtPayoffAdviceInputSchema = z.object({
  income: z.number().describe('Total monthly income in INR.'),
  expenses: z.number().describe('Total monthly expenses in INR, excluding debt payments.'),
  loans: z.array(LoanSchema).describe('An array of the user\'s current loans.'),
});
export type DebtPayoffAdviceInput = z.infer<typeof DebtPayoffAdviceInputSchema>;

const RepaymentStepSchema = z.object({
  month: z.number().describe('The month number in the repayment plan (e.g., 1, 2, 3...).'),
  totalRemainingBalance: z.number().describe('The total remaining balance of all loans at the end of this month.'),
  monthlyPayment: z.number().describe('The total amount paid towards debts this month.'),
});

const DebtPayoffAdviceOutputSchema = z.object({
  strategy: z.string().describe('The name of the recommended debt payoff strategy (e.g., "Debt Avalanche", "Debt Snowball").'),
  summary: z.string().describe('A brief, encouraging summary of the plan and the payoff timeline.'),
  planExplanation: z.string().describe('A detailed explanation of the recommended strategy and step-by-step instructions on how to follow it.'),
  repaymentSchedule: z.array(RepaymentStepSchema).describe('A month-by-month schedule showing the debt balance decreasing over time.'),
});
export type DebtPayoffAdviceOutput = z.infer<typeof DebtPayoffAdviceOutputSchema>;

export async function getDebtPayoffAdvice(input: DebtPayoffAdviceInput): Promise<DebtPayoffAdviceOutput> {
  return debtPayoffAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debtPayoffAdvicePrompt',
  input: { schema: DebtPayoffAdviceInputSchema },
  output: { schema: DebtPayoffAdviceOutputSchema },
  prompt: `You are an expert financial advisor specializing in debt reduction strategies. Your goal is to create a clear, actionable, and encouraging debt payoff plan for the user.

  **User's Financial Information:**
  - Monthly Income: {{income}} INR
  - Monthly Expenses (excluding debt): {{expenses}} INR
  - Available for Debt Repayment: {{income}} - {{expenses}} = {{math income '-' expenses}} INR per month.
  - Loans:
  {{#each loans}}
    - Name: {{name}}, Balance: {{balance}} INR, APR: {{interestRate}}%, Min. Payment: {{minimumPayment}} INR
  {{/each}}

  **Your Task:**
  1.  **Choose the Best Strategy:** Analyze the user's loans. Decide whether the 'Debt Avalanche' (highest interest rate first) or 'Debt Snowball' (lowest balance first) method is more suitable. The 'Debt Avalanche' method is almost always mathematically superior as it saves the most money on interest. You should recommend the **Debt Avalanche** method unless there are very small loans that can be paid off quickly for a psychological win, in which case you can consider the 'Debt Snowball' method. State which strategy you've chosen.

  2.  **Create a Plan Explanation:**
      *   Explain the chosen strategy (Avalanche or Snowball) in simple terms.
      *   Provide a step-by-step guide. Tell the user to pay the minimum on all loans except for the target loan. All extra money should go towards the target loan.
      *   Once the target loan is paid off, the payment amount from that loan (minimum + extra) should be "snowballed" onto the next target loan.

  3.  **Generate a Repayment Schedule:**
      *   Calculate the month-by-month repayment schedule until all loans are paid off.
      *   The 'monthlyPayment' in each step should be the sum of all minimum payments plus any extra available income (income - expenses - sum of minimums). If the user has a negative disposable income after minimum payments, the monthly payment is just the sum of minimums.
      *   For each month, provide the total remaining balance of all loans combined.
      *   The calculation should account for interest accruing monthly on the remaining balances. The monthly interest rate is APR / 12 / 100.

  4.  **Write a Summary:**
      *   Start with an encouraging sentence.
      *   State the chosen strategy.
      *   Clearly state the projected payoff date (e.g., "You'll be debt-free in X years and Y months.").

  Provide the output in the specified JSON format. Ensure the 'repaymentSchedule' is accurate based on your calculations.
  `,
});


const debtPayoffAdviceFlow = ai.defineFlow(
  {
    name: 'debtPayoffAdviceFlow',
    inputSchema: DebtPayoffAdviceInputSchema,
    outputSchema: DebtPayoffAdviceOutputSchema,
  },
  async input => {
    // Basic validation to prevent requests for users who can't afford minimum payments
    const totalMinimumPayments = input.loans.reduce((acc, loan) => acc + loan.minimumPayment, 0);
    if (input.income - input.expenses < totalMinimumPayments) {
        throw new Error("Your income is not sufficient to cover your expenses and minimum debt payments. Please review your budget.");
    }

    const {output} = await prompt(input);
    return output!;
  }
);
