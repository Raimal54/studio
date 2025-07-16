"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface DebtRepaymentChartProps {
    data: {
        month: number;
        totalRemainingBalance: number;
    }[];
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1 text-center">
            <span className="text-[0.7rem] uppercase text-muted-foreground">
              Month {label}
            </span>
            <span className="font-bold text-primary">
              {formatCurrency(payload[0].value)}
            </span>
        </div>
      </div>
    );
  }
  return null;
};


export function DebtRepaymentChart({ data }: DebtRepaymentChartProps) {
  const totalMonths = data.length;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Path to Debt-Free</CardTitle>
        <CardDescription>
            This chart visualizes your total debt balance decreasing over the next 
            <strong> {years} years and {months} months</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `M${value}`}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatCurrency(value)}
                    domain={['dataMin', 'dataMax']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="totalRemainingBalance" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUv)" 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
