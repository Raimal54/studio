"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
      let investedThisYear = (monthlyInvestment * 12 * (year - 1));
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

  const chartConfig = {
    invested: {
      label: "Invested",
      color: "hsl(var(--chart-2))",
    },
    returns: {
      label: "Returns",
      color: "hsl(var(--chart-1))",
    },
  }

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
        
        <div className="w-full">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex flex-col">
                        <span className="capitalize text-xs text-muted-foreground">{name}</span>
                        <span className="font-bold">{formatCurrency(value as number)}</span>
                      </div>
                    )}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="invested"
                stroke={chartConfig.invested.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke={chartConfig.returns.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
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
