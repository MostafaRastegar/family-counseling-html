import React from 'react';
import { Card, Table, Badge } from 'antd';
import { WithdrawalRequest } from '../types/earnings.types';

interface WithdrawalHistoryTableProps {
  withdrawalHistory: WithdrawalRequest[];
  loading: boolean;
}

export const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({ 
  withdrawalHistory, 
  loading 
}) => {
  const columns = [
    {
      title: 'تاریخ درخواست',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date) => new Date(date).toLocaleDateString('fa-IR')
    },
    {
      title: 'مبلغ',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()} تومان`
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'pending': { status: 'warning', text: 'در انتظار' },
          'processing': { status: 'processing', text: 'در حال پردازش' },
          'completed': { status: 'success', text: 'انجام شده' }
        };
        
        return (
          <Badge 
            status={statusMap[status].status} 
            text={statusMap[status].text} 
          />
        );
      }
    },
    {
      title: 'تاریخ واریز',
      dataIndex: 'paidDate',
      key: 'paidDate',
      render: (date) => date ? new Date(date).toLocaleDateString('fa-IR') : '-'
    },
  ];

  return (
    <Card title="تاریخچه برداشت‌ها">
      <Table 
        columns={columns}
        dataSource={withdrawalHistory}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};