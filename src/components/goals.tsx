"use client";

import { useGoals } from '@/hooks/use-goals';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Progress } from './ui/progress';

const goalFormSchema = z.object({
    name: z.string().min(2, "Goal name must be at least 2 characters."),
    targetAmount: z.coerce.number().positive("Target amount must be positive."),
    deadline: z.date({ required_error: "A deadline is required." }),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

export function Goals() {
    const { goals, addGoal, deleteGoal, addContribution } = useGoals();
    
    const form = useForm<GoalFormData>({
        resolver: zodResolver(goalFormSchema),
        defaultValues: {
            name: "",
            targetAmount: 0,
        },
    });
    
    const onSubmit = (data: GoalFormData) => {
        addGoal({ ...data, deadline: data.deadline.toISOString() });
        form.reset();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Goal</CardTitle>
                    <CardDescription>Define a savings goal and track your progress.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Goal Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Vacation to Goa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name="targetAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Amount (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g., 50000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Deadline</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Add Goal</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className='space-y-4'>
                <h3 className="text-lg font-medium">Your Current Goals</h3>
                {goals.length > 0 ? (
                    goals.map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <Card key={goal.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className='flex-grow'>
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold">{goal.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Deadline: {format(new Date(goal.deadline), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className='text-primary font-medium'>
                                                    ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                                                </span>
                                                <span>{Math.round(progress)}%</span>
                                            </div>
                                            <Progress value={progress} className="mt-2" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => deleteGoal(goal.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <p className="text-muted-foreground text-center py-4">You haven't set any goals yet.</p>
                )}
            </div>
        </div>
    );
}
