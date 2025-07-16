export const categories = {
  income: ["Salary", "Interest", "Gifts", "Other"],
  expense: [
    "Rent",
    "Groceries",
    "Bills",
    "Transport",
    "Entertainment",
    "Health",
    "Shopping",
    "Other",
  ],
} as const;

export type IncomeCategory = (typeof categories.income)[number];
export type ExpenseCategory = (typeof categories.expense)[number];
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: TransactionCategory;
  date: string; // ISO string format
};
