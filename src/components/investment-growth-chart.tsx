"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.7rem] uppercase text-muted-foreground">
              Year {label}
            </span>
          </div>
        </div>
        <div className="mt-2 grid gap-1.5">
            {payload.map((item: any) => (
                 <div key={item.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}} />
                    <p className="text-sm text-muted-foreground">{item.name}:</p>
                    <p className="text-sm font-medium">{formatCurrency(item.value)}</p>
                 </div>
            ))}
        </div>
      </div>
    );
  }

  return null;
};

export function InvestmentGrowthChart() {
  const [monthlyInvestment, setMonthlyInvestment] = React.useState(10000)
  const [returnRate, setReturnRate] = React.useState(12)
  const [timePeriod, setTimePeriod] = React.useState(10)

  const chartData = React.useMemo(() => {
    const data = []
    let futureValue = 0
    const monthlyRate = returnRate / 100 / 12

    for (let year = 1; year <= timePeriod; year++) {
      for (let month = 1; month <= 12; month++) {
        futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate)
      }
      data.push({
        year,
        "invested": monthlyInvestment * 12 * year,
        "returns": futureValue,
      })
    }
    return data
  }, [monthlyInvestment, returnRate, timePeriod])

  const totalInvested = monthlyInvestment * 12 * timePeriod;
  const totalReturns = chartData.length > 0 ? chartData[chartData.length - 1].returns : 0;
  const totalGains = totalReturns - totalInvested;
  const maxReturnValue = totalReturns * 1.1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Future Value Calculator</CardTitle>
        <CardDescription>
          See how your money can grow over time with consistent investment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="monthly-investment">Monthly Investment</Label>
              <span className="font-semibold">{formatCurrency(monthlyInvestment)}</span>
            </div>
            <Slider
              id="monthly-investment"
              value={[monthlyInvestment]}
              onValueChange={(value) => setMonthlyInvestment(value[0])}
              min={500}
              max={100000}
              step={500}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="return-rate">Expected Return Rate (p.a.)</Label>
              <span className="font-semibold">{returnRate}%</span>
            </div>
            <Slider
              id="return-rate"
              value={[returnRate]}
              onValueChange={(value) => setReturnRate(value[0])}
              min={1}
              max={30}
              step={0.5}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="time-period">Time Period (Years)</Label>
              <span className="font-semibold">{timePeriod} years</span>
            </div>
            <Slider
              id="time-period"
              value={[timePeriod]}
              onValueChange={(value) => setTimePeriod(value[0])}
              min={1}
              max={40}
              step={1}
            />
          </div>
        </div>
        
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `Yr ${value}`}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatCurrency(value)}
                    domain={[0, maxReturnValue]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    name="Invested"
                    type="monotone"
                    dataKey="invested"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    name="Returns"
                    type="monotone"
                    dataKey="returns"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-sm text-muted-foreground">Invested Amount</p>
                <p className="text-xl font-bold">{formatCurrency(totalInvested)}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Est. Gains</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalGains)}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Future Value</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(totalReturns)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
