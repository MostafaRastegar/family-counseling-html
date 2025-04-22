import React, { useState } from 'react';
import { Card, Form, InputNumber, Button, Alert } from 'antd';
import { BankAccount } from '../types/earnings.types';

interface WithdrawalSectionProps {
  availableBalance: number;
  bankAccount: BankAccount | null;
  onRequestWithdrawal: (amount: number) => void;
  loading: boolean;
}

export const WithdrawalSection: React.FC<WithdrawalSectionProps> = ({
  availableBalance,
  bankAccount,
  onRequestWithdrawal,
  loading
}) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | null>(null);

  const handleSubmit = () => {
    if (withdrawalAmount && withdrawalAmount <= availableBalance) {
      onRequestWithdrawal(withdrawalAmount);
    }
  };

  return (
    <Card title="درخواست برداشت">
      {bankAccount ? (
        <Form layout="vertical">
          <Form.Item label="مبلغ برداشت">
            <InputNumber
              min={500000}
              max={availableBalance}
              value={withdrawalAmount}
              onChange={(value) => setWithdrawalAmount(value)}
              formatter={(value) => `${value?.toLocaleString() || ''} تومان`}
              parser={(value) => parseInt(value?.replace(/\D/g, '') || '0')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={!withdrawalAmount || withdrawalAmount < 500000}
            loading={loading}
          >
            درخواست برداشت
          </Button>

          <Alert
            message="توجه"
            description="حداقل مبلغ برداشت 500,000 تومان است. درخواست‌های برداشت طی 2-3 روز کاری پردازش می‌شوند."
            type="info"
            showIcon
            className="mt-4"
          />
        </Form>
      ) : (
        <Alert
          message="اطلاعات حساب بانکی تکمیل نشده است"
          description="لطفاً ابتدا اطلاعات حساب بانکی خود را در تنظیفات پروفایل تکمیل کنید."
          type="warning"
          showIcon
        />
      )}
    </Card>
  );
};