'use server';
/**
 * @fileOverview An AI flow for scanning receipts and extracting transaction data.
 *
 * - scanReceipt - Extracts transaction details from a receipt image.
 * - ScanReceiptInput - The input type for the scanReceipt function.
 * - ScanReceiptOutput - The return type for the scanReceipt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { categories, type ExpenseCategory } from '@/lib/types';

const ScanReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanReceiptInput = z.infer<typeof ScanReceiptInputSchema>;

const ScanReceiptOutputSchema = z.object({
  amount: z.number().describe("The total amount of the transaction. Find the largest numerical value that represents the total cost."),
  category: z.enum(categories.expense).describe("The most likely expense category for this receipt."),
  date: z.string().describe("The date of the transaction in YYYY-MM-DD format. If no date is found, use today's date."),
});
export type ScanReceiptOutput = z.infer<typeof ScanReceiptOutputSchema>;

export async function scanReceipt(input: ScanReceiptInput): Promise<ScanReceiptOutput> {
  return scanReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanReceiptPrompt',
  input: { schema: ScanReceiptInputSchema },
  output: { schema: ScanReceiptOutputSchema },
  prompt: `You are an expert receipt scanner. Analyze the provided receipt image and extract the key information.

  1.  **Find the Total Amount:** Identify the total amount paid. This is usually the largest number and might be labeled "Total", "Grand Total", or similar.
  2.  **Determine the Category:** Based on the store name or items listed, determine the most appropriate expense category from the provided list.
  3.  **Find the Date:** Extract the date of the purchase. If you cannot find a date, use the current date. Format it as YYYY-MM-DD.

  Receipt Image: {{media url=receiptDataUri}}`,
});

const scanReceiptFlow = ai.defineFlow(
  {
    name: 'scanReceiptFlow',
    inputSchema: ScanReceiptInputSchema,
    outputSchema: ScanReceiptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
