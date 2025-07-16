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

const PlanStepSchema = z.object({
  title: z.string().describe("A short, catchy title for this step."),
  description: z.string().describe("A detailed but easy-to-understand description of this step."),
  iconName: z.string().describe("The name of a lucide-react icon that represents this step (e.g., 'Target', 'TrendingUp', 'ShieldCheck').")
});

const DebtPayoffAdviceOutputSchema = z.object({
  strategy: z.string().describe('The name of the recommended debt payoff strategy (e.g., "Debt Avalanche", "Debt Snowball").'),
  summary: z.string().describe('A brief, encouraging summary of the plan and the payoff timeline, speaking like a supportive older brother.'),
  keyTakeaways: z.array(z.string()).describe("A short list of 3-4 bullet points summarizing the most important actions."),
  planExplanation: z.string().describe('A detailed explanation of *why* this strategy was chosen, in a friendly and encouraging tone.'),
  stepByStepGuide: z.array(PlanStepSchema).describe("A list of clear, actionable steps for the user to follow."),
  potentialPitfalls: z.array(z.string()).describe("A list of potential challenges or pitfalls to watch out for."),
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
  prompt: `You are an expert financial advisor, but you're also a wise, supportive, and motivating older brother. Your goal is to create a clear, actionable, and encouraging debt payoff plan that feels like advice from someone who truly cares.

  **User's Financial Information:**
  - Monthly Income: {{income}} INR
  - Monthly Expenses (excluding debt): {{expenses}} INR
  - Loans:
  {{#each loans}}
    - Name: {{name}}, Balance: {{balance}} INR, APR: {{interestRate}}%, Min. Payment: {{minimumPayment}} INR
  {{/each}}

  **Your Task:**
  1.  **Choose the Best Strategy:** Analyze the user's loans. Decide whether the 'Debt Avalanche' (highest interest rate first) or 'Debt Snowball' (lowest balance first) method is more suitable. **Strongly prefer the Debt Avalanche method** as it saves the most money. Only recommend the 'Debt Snowball' if there's a very small loan that can be paid off in 1-2 months for a quick motivational win.

  2.  **Create a Detailed, Practical Plan (As a Big Brother):**
      *   **Summary:** Write an uplifting summary. Start with something like, "Alright, let's get this handled. I've looked at your numbers, and we can absolutely build a plan to get you out of this." Calculate the total payoff time from the repayment schedule and state it clearly (e.g., "Based on this plan, you'll be completely debt-free in X years and Y months.").
      *   **Key Takeaways:** Create a short bulleted list of the absolute most important things to remember.
      *   **Plan Explanation:** Explain *why* you chose the strategy in simple, encouraging terms.
      *   **Step-by-Step Guide (In-Depth):** Break the plan into 3-5 clear, actionable steps. Each step needs a short title, a detailed description, and a relevant 'lucide-react' icon name. This is the most important part of your response. Be very specific.
          *   **Step 1: Focus Fire on the First Target.** Title it 'Focus on Your First Target'. Use icon 'Target'. Identify the first loan to target based on the chosen strategy. Be specific about the loan name. Calculate the total monthly payment to direct towards it (its minimum payment + all extra available income). **Crucially, analyze the repayment schedule you generate and estimate how many months it will take to pay off this specific loan.** For example: "For the next 8 months, you'll throw a total of X INR at your 'Personal Loan' until it's gone."
          *   **Step 2: Start the Rollover.** Title it 'Start the Debt Avalanche/Snowball'. Use icon 'TrendingUp'. Explain in detail what happens after the first loan is paid off. Describe how to "roll over" the full payment amount (the entire amount from the paid-off loan) and add it to the minimum payment of the *next* target loan. Name the next target loan and state the new, larger payment amount.
          *   **Step 3: Stay Consistent.** Title it 'Stay Disciplined'. Use icon 'Repeat'. Write a motivational message about staying consistent. Emphasize that every payment brings them closer to freedom.
          *   **Step 4: Life After Debt.** Title it 'Build Your Future'. Use icon 'Rocket'. Explain that once all debts are paid, they should immediately redirect the *entire monthly amount they were paying on debt* towards savings and investments to build wealth. Give a concrete number for this amount.
      *   **Potential Pitfalls:** Give a friendly warning about 2-3 common mistakes, like taking on new debt or getting discouraged by slow progress at the start.
  
  3.  **Generate a Repayment Schedule:**
      *   Calculate the month-by-month repayment schedule until all loans are paid off. This is critical for all other parts of the plan, especially the step-by-step guide's timeline estimates.
      *   The 'monthlyPayment' in each step should be the sum of all minimum payments plus any extra available income (income - expenses - sum of all minimum payments).
      *   For each month, provide the total remaining balance of all loans combined.
      *   The calculation should account for interest accruing monthly on the remaining balances. The monthly interest rate is APR / 12 / 100.

  Provide the output in the specified JSON format. Ensure your tone is consistently supportive and the steps are crystal clear and deeply practical.
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
