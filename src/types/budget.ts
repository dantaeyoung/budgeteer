export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category?: string;
  date: string;
}

export interface DailyBudget {
  amount: number;
  currency: string;
}

export interface BudgetState {
  dailyBudget: DailyBudget;
  transactions: Transaction[];
  lastSync?: string;
} 