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
import { ReceiptScanner } from "@/components/receipt-scanner";
import { Budgets } from "@/components/budgets";
import { Goals } from "@/components/goals";
import { useBudget } from "@/hooks/use-budget";

export default function Home() {
  const { transactions, addTransaction, deleteTransaction, income, expenses, balance, accounts, activeAccount, setActiveAccount } = useTransactions();
  const { budgets } = useBudget();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "invest") {
      router.push("/invest");
    } else if (value === "debt") {
      router.push("/debt-payoff");
    } else if (value === "budgets") {
      router.push("/budgets");
    } else if (value === "goals") {
      router.push("/goals");
    }
  };

  return (
    <main className="bg-background font-body">
      <div className="max-w-xl mx-auto bg-card text-card-foreground rounded-2xl shadow-xl my-4 sm:my-8 p-6 space-y-6">
        <Header accounts={accounts} activeAccount={activeAccount} setActiveAccount={setActiveAccount} />
        <BalanceSummary income={income} expenses={expenses} balance={balance} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AddTransactionDialog type="income" onAddTransaction={addTransaction} />
          <AddTransactionDialog type="expense" onAddTransaction={addTransaction} />
          <ReceiptScanner onTransactionScanned={addTransaction} />
        </div>
        <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="invest">Invest</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <SpendingAnalysis transactions={transactions} budgets={budgets} />
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
