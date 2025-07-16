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

export default function Home() {
  const { transactions, addTransaction, income, expenses, balance } = useTransactions();

  return (
    <main className="bg-background font-body">
      <div className="max-w-xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-6">
        <Header />
        <BalanceSummary income={income} expenses={expenses} balance={balance} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddTransactionDialog type="income" onAddTransaction={addTransaction} />
          <AddTransactionDialog type="expense" onAddTransaction={addTransaction} />
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <SpendingAnalysis transactions={transactions} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <TransactionList transactions={transactions} />
          </TabsContent>
        </Tabs>
        <Separator />
        <SpendingAdvice income={income} transactions={transactions} />
      </div>
    </main>
  );
}
