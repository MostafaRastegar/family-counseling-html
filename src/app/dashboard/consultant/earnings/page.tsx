'use client';

import React from 'react';
import { Button, Card, Divider, Tabs, Typography } from 'antd';
import { 
  DollarOutlined, 
  DownloadOutlined, 
  FileExcelOutlined, 
  WalletOutlined 
} from '@ant-design/icons';

import PageHeader from '@/components/common/PageHeader';
import { useEarningsManagement } from './hooks/useEarningsManagement';
import { EarningsOverview } from './components/EarningsOverview';
import { TransactionsTable } from './components/TransactionsTable';
import { WithdrawalSection } from './components/WithdrawalSection';
import { WithdrawalHistoryTable } from './components/WithdrawalHistoryTable';

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

export default function ConsultantEarnings() {
  const { 
    transactions, 
    withdrawalHistory, 
    bankAccount,
    loading,
    earningsSummary,
    requestWithdrawal 
  } = useEarningsManagement();

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت درآمد"
        description="مشاهده و مدیریت درآمدها، تراکنش‌ها و گزارش‌های مالی"
      />

      <EarningsOverview summary={earningsSummary} />

      <Tabs defaultActiveKey="1" className="mt-6">
        <TabPane 
          tab={
            <span>
              <DollarOutlined />
              نمای کلی
            </span>
          } 
          key="1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionsTable 
              transactions={transactions} 
              loading={loading} 
            />
            <WithdrawalSection
              availableBalance={earningsSummary.availableBalance}
              bankAccount={bankAccount}
              onRequestWithdrawal={requestWithdrawal}
              loading={loading}
            />
          </div>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <FileExcelOutlined />
              گزارش‌های مالی
            </span>
          } 
          key="2"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                title: 'گزارش ماهانه فروردین', 
                period: '1404/01/01 - 1404/01/31',
                sessions: 12,
                earnings: 4800000
              },
              { 
                title: 'گزارش ماهانه اردیبهشت', 
                period: '1404/02/01 - 1404/02/31',
                sessions: 15,
                earnings: 6000000
              },
              { 
                title: 'گزارش سه‌ماهه بهار', 
                period: '1404/01/01 - 1404/03/31',
                sessions: 42,
                earnings: 16800000
              }
            ].map((report, index) => (
              <Card
                key={index} 
                hoverable
                actions={[
                  <Button
                    key="download" 
                    type="primary" 
                    block 
                    icon={<DownloadOutlined />}
                  >
                    دانلود گزارش
                  </Button>
                ]}
              >
                <div className="flex items-center justify-between mb-4">
                  <Title level={5}>{report.title}</Title>
                  <span>{report.period}</span>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span>تعداد جلسات: {report.sessions}</span>
                  <span>درآمد: {report.earnings.toLocaleString()} تومان</span>
                </div>
              </Card>
            ))}
          </div>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <WalletOutlined />
              تاریخچه برداشت‌ها
            </span>
          } 
          key="3"
        >
          <WithdrawalHistoryTable
            withdrawalHistory={withdrawalHistory}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}