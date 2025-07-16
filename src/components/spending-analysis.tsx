"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { categories, type Transaction, type ExpenseCategory } from "@/lib/types"

interface SpendingAnalysisProps {
  transactions: Transaction[]
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Rent: "hsl(210, 80%, 60%)", // Blue
  Groceries: "hsl(140, 60%, 50%)", // Green
  Bills: "hsl(40, 90%, 60%)", // Orange
  Transport: "hsl(260, 70%, 65%)", // Purple
  Entertainment: "hsl(340, 85%, 65%)", // Pink
  Health: "hsl(190, 80%, 55%)", // Cyan
  Shopping: "hsl(50, 95%, 55%)", // Yellow
  Other: "hsl(0, 0%, 70%)", // Gray
};

export function SpendingAnalysis({ transactions }: SpendingAnalysisProps) {
  const chartData = React.useMemo(() => {
    const expenseData = transactions.filter((t) => t.type === "expense");
    const categoryTotals = expenseData.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  const chartConfig = React.useMemo(() => {
    const config: any = {};
    categories.expense.forEach((category) => {
      config[category] = {
        label: category,
        color: CATEGORY_COLORS[category],
      };
    });
    return config;
  }, []);

  if (chartData.length === 0) {
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
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>Your expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={chartConfig[entry.category]?.color || CATEGORY_COLORS.Other} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
