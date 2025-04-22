import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { 
  Transaction, 
  WithdrawalRequest, 
  BankAccount,
  EarningsSummary 
} from '../types/earnings.types';

// Mock data (would typically come from an API)
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2025-04-01',
    clientName: 'محمد رضایی',
    sessionId: 'S-12345',
    amount: 450000,
    commissionRate: 20,
    commission: 90000,
    finalAmount: 360000,
    status: 'completed',
    paidAt: '2025-04-03',
  },
  // More mock transactions...
];

const mockWithdrawalHistory: WithdrawalRequest[] = [
  {
    id: 1,
    requestDate: '1404/02/15',
    amount: 1200000,
    status: 'completed',
    paidDate: '1404/02/17',
    description: 'تسویه حساب ماهانه',
  },
  // More mock withdrawal requests...
];

export const useEarningsManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = () => {
      try {
        // Simulate API call
        setTransactions(mockTransactions);
        setWithdrawalHistory(mockWithdrawalHistory);
        setBankAccount({
          accountHolder: 'علی محمدی',
          accountNumber: '1234-5678-9012-3456',
          bankName: 'بانک ملت',
          ibanNumber: 'IR123456789012345678901234',
        });
        setLoading(false);
      } catch (error) {
        message.error('خطا در بارگذاری اطلاعات مالی');
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  const calculateEarningsSummary = useMemo((): EarningsSummary => {
    const completedTransactions = transactions.filter(
      tx => tx.status === 'completed'
    );

    const totalEarnings = completedTransactions.reduce(
      (sum, tx) => sum + tx.finalAmount, 0
    );

    const pendingTransactions = transactions.filter(
      tx => tx.status === 'pending' || tx.status === 'processing'
    );

    const pendingAmount = pendingTransactions.reduce(
      (sum, tx) => sum + tx.finalAmount, 0
    );

    return {
      totalEarnings,
      pendingAmount,
      completedAmount: totalEarnings,
      availableBalance: 750000, // Mock available balance
    };
  }, [transactions]);

  const requestWithdrawal = (amount: number) => {
    setLoading(true);
    try {
      // Simulate withdrawal request
      const newWithdrawalRequest: WithdrawalRequest = {
        id: Date.now(),
        requestDate: new Date().toISOString().split('T')[0],
        amount,
        status: 'pending',
      };

      setWithdrawalHistory(prev => [newWithdrawalRequest, ...prev]);
      message.success('درخواست برداشت با موفقیت ثبت شد');
    } catch (error) {
      message.error('خطا در ثبت درخواست برداشت');
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    withdrawalHistory,
    bankAccount,
    loading,
    earningsSummary: calculateEarningsSummary,
    requestWithdrawal,
  };
};