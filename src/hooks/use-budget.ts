"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Budget, ExpenseCategory } from '@/lib/types';
import { format } from 'date-fns';

const BUDGET_KEY = 'chai-wallet-budgets';

export function useBudget() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Load budgets from localStorage
  useEffect(() => {
    try {
      const storedBudgets = localStorage.getItem(BUDGET_KEY);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error("Failed to load budgets from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  // Save budgets to localStorage
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error("Failed to save budgets to localStorage", error);
    }
  }, [budgets, loading]);

  const addBudget = useCallback((budget: { category: ExpenseCategory, amount: number }) => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
      month: currentMonth,
    };
    // Replace existing budget for the same category and month, or add new
    setBudgets(prev => {
        const existingIndex = prev.findIndex(b => b.category === newBudget.category && b.month === newBudget.month);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newBudget;
            return updated;
        }
        return [...prev, newBudget];
    });
  }, []);

  const updateBudget = useCallback((id: string, amount: number) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, amount } : b));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);
  
  const getCurrentMonthBudgets = useCallback(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    return budgets.filter(b => b.month === currentMonth);
  }, [budgets]);

  return { 
    budgets: getCurrentMonthBudgets(), 
    allBudgets: budgets,
    addBudget, 
    updateBudget,
    deleteBudget,
    loading 
  };
}
