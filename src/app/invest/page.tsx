"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, BookOpen, Rocket } from "lucide-react";
import Link from "next/link";
import { InvestmentGrowthChart } from "@/components/investment-growth-chart";

export default function InvestPage() {
  return (
    <main className="bg-background font-body min-h-screen">
      <div className="max-w-xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-6">
        <header className="flex items-center justify-between">
            <Link href="/" legacyBehavior>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back to Home</span>
                </Button>
            </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Start Investing
            </h1>
          </div>
          <div className="w-10"></div>
        </header>

        <InvestmentGrowthChart />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              How to Invest
            </CardTitle>
            <CardDescription>A simple guide to begin your investment journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>Define Your Goals:</strong> Understand why you're investing (e.g., retirement, a big purchase).</p>
            <p>2. <strong>Assess Your Risk Tolerance:</strong> Know how much risk you're comfortable with.</p>
            <p>3. <strong>Choose Your Investments:</strong> Research options like stocks, bonds, and mutual funds.</p>
            <p>4. <strong>Open an Account:</strong> Select a brokerage platform to manage your investments.</p>
            <p>5. <strong>Start Small & Stay Consistent:</strong> You don't need a lot to start. Regular investments (SIPs) can be powerful.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Ready to Start?
            </CardTitle>
            <CardDescription>Take the next step towards your financial future.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://www.google.com/search?q=best+investment+platforms+in+india" target="_blank" rel="noopener noreferrer">
              <Button className="w-full" size="lg">
                Explore Investment Platforms
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-2 text-center">
             You will be redirected to Google. Please do your own research before investing.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
