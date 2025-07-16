"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { getSpendingAdvice, SpendingAdviceInput } from "@/ai/flows/spending-advice"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { Transaction } from "@/lib/types"

interface SpendingAdviceProps {
  income: number
  transactions: Transaction[]
}

export function SpendingAdvice({ income, transactions }: SpendingAdviceProps) {
  const [advice, setAdvice] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleGetAdvice = async () => {
    setIsLoading(true)
    setError(null)
    setIsOpen(true)

    const spendingData = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    if (Object.keys(spendingData).length === 0) {
      setError("You need some expense transactions to get advice.");
      setIsLoading(false);
      return;
    }

    const input: SpendingAdviceInput = {
      income: income,
      spendingData: JSON.stringify(spendingData),
      monthsAhead: 3,
    };

    try {
      const result = await getSpendingAdvice(input);
      setAdvice(result.advice);
    } catch (e: any) {
      setError("Failed to get advice. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleGetAdvice} disabled={isLoading} className="w-full">
        <Sparkles className="mr-2 h-4 w-4" />
        Get AI Spending Advice
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Financial Advice
            </DialogTitle>
            <DialogDescription>
              Here are some AI-powered suggestions to optimize your spending.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {advice && !isLoading && (
              <div className="prose prose-sm max-w-none text-popover-foreground whitespace-pre-wrap font-sans">
                {advice}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
