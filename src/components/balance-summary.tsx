import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Banknote } from "lucide-react";

interface BalanceSummaryProps {
  income: number;
  expenses: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export function BalanceSummary({ income, expenses, balance }: BalanceSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-muted-foreground font-medium">Your Balance</CardTitle>
        <p className="text-4xl font-bold tracking-tighter">{formatCurrency(balance)}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="font-semibold text-lg">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="font-semibold text-lg">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
