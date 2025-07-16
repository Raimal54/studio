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
import type { Transaction } from "@/lib/types"

interface SpendingAnalysisProps {
  transactions: Transaction[]
}

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
    chartData.forEach((item, index) => {
      config[item.category] = {
        label: item.category,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [chartData]);

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
                 <Cell key={`cell-${index}`} fill={chartConfig[entry.category]?.color} />
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
