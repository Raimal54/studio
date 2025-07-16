"use client";

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2, Bot, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getDebtPayoffAdvice, DebtPayoffAdviceInput, DebtPayoffAdviceOutput } from '@/ai/flows/debt-payoff-advice';
import { DebtRepaymentChart } from '@/components/debt-repayment-chart';

const loanSchema = z.object({
  name: z.string().min(1, 'Loan name is required.'),
  balance: z.coerce.number().positive('Must be positive.'),
  interestRate: z.coerce.number().positive('Must be positive.'),
  minimumPayment: z.coerce.number().positive('Must be positive.'),
});

const formSchema = z.object({
  income: z.coerce.number().positive('Monthly income is required.'),
  expenses: z.coerce.number().nonnegative('Monthly expenses are required.'),
  loans: z.array(loanSchema).min(1, 'Please add at least one loan.'),
});

type FormData = z.infer<typeof formSchema>;

export default function DebtPayoffPage() {
  const [advice, setAdvice] = useState<DebtPayoffAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      expenses: undefined,
      loans: [{ name: '', balance: 0, interestRate: 0, minimumPayment: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'loans',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);

    const input: DebtPayoffAdviceInput = data;

    try {
      const result = await getDebtPayoffAdvice(input);
      setAdvice(result);
    } catch (e: any) {
      setError(e.message || 'Failed to get advice. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background font-body min-h-screen">
      <div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-6">
        <header className="flex items-center justify-between">
          <Link href="/" legacyBehavior>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              AI Debt Payoff Planner
            </h1>
          </div>
          <div className="w-10"></div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Your Financial Snapshot</CardTitle>
            <CardDescription>Enter your income, expenses, and loan details to get a personalized repayment plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input id="income" type="number" {...form.register('income')} placeholder="e.g., 50000" />
                  {form.formState.errors.income && <p className="text-red-500 text-sm mt-1">{form.formState.errors.income.message}</p>}
                </div>
                <div>
                  <Label htmlFor="expenses">Monthly Expenses (₹)</Label>
                  <Input id="expenses" type="number" {...form.register('expenses')} placeholder="e.g., 30000" />
                  {form.formState.errors.expenses && <p className="text-red-500 text-sm mt-1">{form.formState.errors.expenses.message}</p>}
                </div>
              </div>

              <Separator />
              
              <div>
                 <h3 className="text-lg font-medium">Your Loans</h3>
                 {form.formState.errors.loans && <p className="text-red-500 text-sm mt-1">{form.formState.errors.loans.message}</p>}
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end p-4 border rounded-lg relative">
                    <div className="sm:col-span-2">
                      <Label htmlFor={`loans.${index}.name`}>Loan Name</Label>
                      <Input id={`loans.${index}.name`} {...form.register(`loans.${index}.name`)} placeholder="e.g., Car Loan" />
                       {form.formState.errors.loans?.[index]?.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.loans?.[index]?.name?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`loans.${index}.balance`}>Balance (₹)</Label>
                      <Input id={`loans.${index}.balance`} type="number" {...form.register(`loans.${index}.balance`)} />
                      {form.formState.errors.loans?.[index]?.balance && <p className="text-red-500 text-sm mt-1">{form.formState.errors.loans?.[index]?.balance?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`loans.${index}.interestRate`}>Interest (%)</Label>
                      <Input id={`loans.${index}.interestRate`} type="number" step="0.01" {...form.register(`loans.${index}.interestRate`)} />
                      {form.formState.errors.loans?.[index]?.interestRate && <p className="text-red-500 text-sm mt-1">{form.formState.errors.loans?.[index]?.interestRate?.message}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`loans.${index}.minimumPayment`}>Min. Pay (₹)</Label>
                        <Input id={`loans.${index}.minimumPayment`} type="number" {...form.register(`loans.${index}.minimumPayment`)} />
                        {form.formState.errors.loans?.[index]?.minimumPayment && <p className="text-red-500 text-sm mt-1">{form.formState.errors.loans?.[index]?.minimumPayment?.message}</p>}
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={() => append({ name: '', balance: 0, interestRate: 0, minimumPayment: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Loan
              </Button>

              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Get Your Repayment Plan
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>Generating Your Plan...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        )}
        
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {advice && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{advice.strategy}</CardTitle>
              <CardDescription>{advice.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <DebtRepaymentChart data={advice.repaymentSchedule} />
                <div className="prose prose-sm max-w-none text-popover-foreground whitespace-pre-wrap font-sans">
                    <h3 className="font-semibold">Your Step-by-Step Guide</h3>
                    {advice.planExplanation}
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
