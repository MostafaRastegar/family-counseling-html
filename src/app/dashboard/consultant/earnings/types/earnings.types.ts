export interface Transaction {
  id: number;
  date: string;
  clientName: string;
  sessionId: string;
  amount: number;
  commissionRate: number;
  commission: number;
  finalAmount: number;
  status: 'completed' | 'pending' | 'processing' | 'cancelled';
  paidAt?: string;
}

export interface WithdrawalRequest {
  id: number;
  requestDate: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  paidDate?: string;
  description?: string;
}

export interface BankAccount {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  ibanNumber: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingAmount: number;
  completedAmount: number;
  availableBalance: number;
}