"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { type Transaction, type ExpenseCategory, type Budget } from "@/lib/types"
import { Progress } from "./ui/progress"
import { cn } from "@/lib/utils"

interface SpendingAnalysisProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingAnalysis({ transactions, budgets }: SpendingAnalysisProps) {
  const categoryTotals = React.useMemo(() => {
    const expenseData = transactions.filter((t) => t.type === "expense");
    return expenseData.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);
  
  const budgetData = React.useMemo(() => {
    return budgets.map(budget => {
      const spent = categoryTotals[budget.category as ExpenseCategory] || 0;
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return {
        ...budget,
        spent,
        progress: Math.min(progress, 100), // Cap at 100%
        over: progress > 100
      }
    });
  }, [budgets, categoryTotals]);


  if (transactions.filter(t=>t.type==='expense').length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-80">
        <CardHeader>
          <CardTitle>Spending Analysis</CardTitle>
          <CardDescription>No expense data available to display.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add some expenses to see your analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending vs. Budgets</CardTitle>
        <CardDescription>Your spending progress for this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="space-y-4 mt-4">
            {budgetData.length > 0 ? budgetData.map(item => (
                <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className={cn("font-mono", item.over ? "text-destructive" : "text-muted-foreground")}>
                          ₹{item.spent.toLocaleString()} / ₹{item.amount.toLocaleString()}
                        </span>
                    </div>
                    <Progress value={item.progress} className={cn(item.over && "[&>div]:bg-destructive")} />
                </div>
            )) : (
              <p className="text-muted-foreground text-center text-sm py-4">No budgets set. Go to the Budgets tab to create one.</p>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
