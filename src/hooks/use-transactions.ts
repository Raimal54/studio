"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Transaction, Account, Recurrence } from '@/lib/types';
import { add, isBefore, parseISO, format, endOfDay, startOfMonth } from 'date-fns';

const TRANSACTIONS_KEY = 'chai-wallet-transactions';
const ACCOUNTS_KEY = 'chai-wallet-accounts';

const DEFAULT_ACCOUNTS: Account[] = [
  { id: '1', name: 'Primary Wallet' },
  { id: '2', name: 'Savings' },
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<string>('1');
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
      const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);

      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
      const loadedAccounts = storedAccounts ? JSON.parse(storedAccounts) : DEFAULT_ACCOUNTS;
      setAccounts(loadedAccounts);
      
      if (loadedAccounts.length > 0) {
        setActiveAccount(loadedAccounts[0].id);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setAccounts(DEFAULT_ACCOUNTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Process recurring transactions on load
  useEffect(() => {
    if (loading) return;
    
    const recurringTransactions = transactions.filter(t => t.recurrence);
    let updatedTransactions = [...transactions];
    let hasChanges = false;

    recurringTransactions.forEach(t => {
      let nextDate = parseISO(t.date);
      const now = new Date();

      while(isBefore(nextDate, now)) {
        const periodMap: Record<Recurrence, Duration> = {
          'daily': { days: 1 },
          'weekly': { weeks: 1 },
          'monthly': { months: 1 },
          'yearly': { years: 1 },
        }
        nextDate = add(nextDate, periodMap[t.recurrence!]);
        
        if(isBefore(nextDate, now)) {
          const newTransaction: Transaction = {
            ...t,
            id: crypto.randomUUID(),
            date: format(nextDate, 'yyyy-MM-dd'), // Keep only date part to avoid time issues
            recurrence: undefined, // The new instance is not recurring itself
          };
          if (!updatedTransactions.some(existing => existing.date.startsWith(newTransaction.date) && existing.amount === newTransaction.amount && existing.category === newTransaction.category)) {
             updatedTransactions.push(newTransaction);
             hasChanges = true;
          }
        }
      }
    });

    if (hasChanges) {
        setTransactions(updatedTransactions);
    }
  }, [loading]);

  // Save data to localStorage
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [transactions, accounts, loading]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'accountId'> & { accountId?: string }) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID(), accountId: activeAccount };
    setTransactions(prev => [newTransaction, ...prev]);
  }, [activeAccount]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.accountId === activeAccount);
  }, [transactions, activeAccount]);

  const { income, expenses, balance } = useMemo(() => {
    const currentMonthStart = startOfMonth(new Date());

    const income = filteredTransactions
      .filter(t => t.type === 'income' && parseISO(t.date) >= currentMonthStart)
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense' && parseISO(t.date) >= currentMonthStart)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalBalance = filteredTransactions.reduce((acc, t) => {
        return acc + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
    
    return { income, expenses, balance: totalBalance };
  }, [filteredTransactions]);

  return { 
    transactions: filteredTransactions, 
    addTransaction, 
    deleteTransaction, 
    income, 
    expenses, 
    balance,
    accounts,
    activeAccount,
    setActiveAccount,
    loading
  };
}
