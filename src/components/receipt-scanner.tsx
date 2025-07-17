"use client";

import { useState, useRef } from 'react';
import { Camera, Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { scanReceipt } from '@/ai/flows/scan-receipt';
import { Transaction } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ReceiptScannerProps {
    onTransactionScanned: (transaction: Omit<Transaction, 'id' | 'type'>) => void;
}

export function ReceiptScanner({ onTransactionScanned }: ReceiptScannerProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataUri = reader.result as string;
            try {
                const result = await scanReceipt({ receiptDataUri: dataUri });
                onTransactionScanned({
                    ...result,
                    date: result.date ? new Date(result.date).toISOString() : new Date().toISOString(),
                    type: 'expense'
                });
                toast({
                    title: "Success!",
                    description: "Receipt scanned and transaction added.",
                });
                setOpen(false);
            } catch (e: any) {
                console.error(e);
                setError("Failed to scan the receipt. The image might be unclear or the format isn't supported. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the file. Please try again.");
            setIsLoading(false);
        };
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Scan Receipt
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan a Receipt</DialogTitle>
                    <DialogDescription>
                        Upload an image of your receipt and let AI extract the details.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Scan Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex flex-col items-center justify-center space-y-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-muted-foreground">Scanning, please wait...</p>
                            </>
                        ) : (
                            <>
                                <Camera className="h-10 w-10 text-muted-foreground" />
                                <Button onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <p className="text-xs text-muted-foreground">Supports PNG, JPG, WEBP</p>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
