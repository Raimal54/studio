
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        // In a real app, you would perform authentication here.
        // For this demo, we'll just navigate to the home page.
        router.push('/');
    }

    return (
        <main className="bg-background font-body min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Wallet className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Welcome to Chai Wallet</CardTitle>
                    <CardDescription>Sign in to continue to your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="user@example.com" defaultValue="user@example.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" defaultValue="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                </CardFooter>
            </Card>
        </main>
    )
}
