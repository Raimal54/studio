"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Goal } from '@/lib/types';

const GOALS_KEY = 'chai-wallet-goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load goals from localStorage
  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem(GOALS_KEY);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error("Failed to load goals from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals to localStorage", error);
    }
  }, [goals, loading]);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      currentAmount: 0,
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, newValues: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...newValues } : g));
  }, []);
  
  const addContribution = useCallback((id: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  return { 
    goals,
    addGoal, 
    updateGoal,
    addContribution,
    deleteGoal,
    loading 
  };
}
