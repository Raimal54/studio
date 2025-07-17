"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudget } from '@/hooks/use-budget';
import { categories, ExpenseCategory } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Progress } from './ui/progress';
import { useTransactions } from '@/hooks/use-transactions';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

const budgetFormSchema = z.object({
    category: z.string().min(1, "Please select a category."),
    amount: z.coerce.number().positive("Amount must be a positive number."),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

export function Budgets() {
    const { budgets, addBudget, deleteBudget } = useBudget();
    const { transactions } = useTransactions();

    const form = useForm<BudgetFormData>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: {
            category: "",
            amount: 0,
        },
    });
    
    const onSubmit = (data: BudgetFormData) => {
        addBudget({ category: data.category as ExpenseCategory, amount: data.amount });
        form.reset();
    };
    
    const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Budget</CardTitle>
                    <CardDescription>Set a spending limit for a category this month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className='flex-grow'>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.expense.map((cat) => (
                                                    <SelectItem key={cat} value={cat} disabled={budgets.some(b => b.category === cat)}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className='flex-grow'>
                                        <FormLabel>Amount (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 5000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Add Budget</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className='space-y-4'>
                <h3 className="text-lg font-medium">Your Current Budgets</h3>
                {budgets.length > 0 ? (
                    budgets.map(budget => {
                        const spent = categoryTotals[budget.category] || 0;
                        const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                        const over = progress > 100;
                        return (
                             <Card key={budget.id}>
                                <CardContent className='pt-6'>
                                     <div className="flex justify-between items-center">
                                         <div className='flex-grow'>
                                             <div className="flex justify-between text-sm font-medium">
                                                 <span>{budget.category}</span>
                                                 <span className={cn(over ? "text-destructive" : "text-muted-foreground")}>
                                                    ₹{spent.toLocaleString()} / ₹{budget.amount.toLocaleString()}
                                                 </span>
                                             </div>
                                             <Progress value={Math.min(progress, 100)} className={cn("mt-1", over && "[&>div]:bg-destructive")} />
                                         </div>
                                         <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => deleteBudget(budget.id)}>
                                             <Trash2 className="h-4 w-4" />
                                         </Button>
                                     </div>
                                </CardContent>
                             </Card>
                        )
                    })
                ) : (
                    <p className="text-muted-foreground text-center py-4">You have no budgets set for this month.</p>
                )}
            </div>
        </div>
    );
}
