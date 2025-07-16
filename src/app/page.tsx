"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { Header } from "@/components/header";
import { BalanceSummary } from "@/components/balance-summary";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { SpendingAnalysis } from "@/components/spending-analysis";
import { TransactionList } from "@/components/transaction-list";
import { SpendingAdvice } from "@/components/spending-advice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ArrowRight, Landmark } from "lucide-react";

export default function Home() {
  const { transactions, addTransaction, deleteTransaction, income, expenses, balance } = useTransactions();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "invest") {
      router.push("/invest");
    }
    if (value === "debt") {
        router.push("/debt-payoff");
    }
  };

  return (
    <main className="bg-background font-body">
      <div className="max-w-xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-6">
        <Header />
        <BalanceSummary income={income} expenses={expenses} balance={balance} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddTransactionDialog type="income" onAddTransaction={addTransaction} />
          <AddTransactionDialog type="expense" onAddTransaction={addTransaction} />
        </div>
        <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="invest">
              Investing <ArrowRight className="w-4 h-4 ml-1" />
            </TabsTrigger>
            <TabsTrigger value="debt">
              Debt <Landmark className="w-4 h-4 ml-1" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <SpendingAnalysis transactions={transactions} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
          </TabsContent>
        </Tabs>
        <Separator />
        <SpendingAdvice income={income} transactions={transactions} />
      </div>
    </main>
  );
}
