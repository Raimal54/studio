"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Trash2, Repeat } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

type SortKey = keyof Transaction;

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (aValue < bValue) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                  <div className="flex items-center">Date {renderSortArrow('date')}</div>
                </TableHead>
                <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                  <div className="flex items-center">Category {renderSortArrow('category')}</div>
                </TableHead>
                <TableHead onClick={() => handleSort('amount')} className="text-right cursor-pointer">
                   <div className="flex items-center justify-end">Amount {renderSortArrow('amount')}</div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Badge variant="secondary">{transaction.category}</Badge>
                    {transaction.recurrence && <Repeat className="h-4 w-4 text-muted-foreground" title={`Recurring ${transaction.recurrence}`} />}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"} ₹{transaction.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete transaction</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No transactions yet.</p>
            <p className="text-sm">Add an income or expense to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
