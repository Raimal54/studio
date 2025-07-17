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

export const recurrenceOptions = ["daily", "weekly", "monthly", "yearly"] as const;
export type Recurrence = (typeof recurrenceOptions)[number];

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: TransactionCategory;
  date: string; // ISO string format
  recurrence?: Recurrence;
  accountId: string;
};

export type Account = {
  id: string;
  name: string;
};

export type Budget = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  month: string; // YYYY-MM format
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string format
};
