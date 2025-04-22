import React from 'react';
import { Card, Table, Tag } from 'antd';
import { Transaction } from '../types/earnings.types';

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions, 
  loading 
}) => {
  const columns = [
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString('fa-IR')
    },
    {
      title: 'مراجع',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'شناسه جلسه',
      dataIndex: 'sessionId',
      key: 'sessionId',
    },
    {
      title: 'مبلغ کل',
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
          'completed': { color: 'green', text: 'پرداخت شده' },
          'pending': { color: 'yellow', text: 'در انتظار' },
          'processing': { color: 'blue', text: 'در حال پردازش' },
          'cancelled': { color: 'red', text: 'لغو شده' }
        };
        
        return (
          <Tag color={statusMap[status].color}>
            {statusMap[status].text}
          </Tag>
        );
      }
    },
  ];

  return (
    <Card title="تراکنش‌های اخیر">
      <Table 
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};