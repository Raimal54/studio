
"use client";

import { Budgets } from "@/components/budgets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PiggyBank } from "lucide-react";
import Link from "next/link";


export default function BudgetsPage() {

    return (
        <main className="bg-background font-body min-h-screen">
            <div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-8">
                <header className="flex items-center justify-between">
                    <Link href="/" legacyBehavior>
                        <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back to Home</span>
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <PiggyBank className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">
                            Monthly Budgets
                        </h1>
                    </div>
                    <div className="w-10"></div>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Your Budgets</CardTitle>
                        <CardDescription>Set spending limits for categories to stay on track.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Budgets />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
