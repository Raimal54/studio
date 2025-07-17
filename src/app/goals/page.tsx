
"use client";

import { Goals } from "@/components/goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target } from "lucide-react";
import Link from "next/link";


export default function GoalsPage() {

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
                            <Target className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">
                            Financial Goals
                        </h1>
                    </div>
                    <div className="w-10"></div>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Track Your Savings Goals</CardTitle>
                        <CardDescription>Set targets and watch your savings grow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Goals />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
