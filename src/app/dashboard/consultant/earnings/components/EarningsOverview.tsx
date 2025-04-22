import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  DollarOutlined, 
  RiseOutlined, 
  FallOutlined 
} from '@ant-design/icons';
import { EarningsSummary } from '../types/earnings.types';

interface EarningsOverviewProps {
  summary: EarningsSummary;
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({ summary }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="درآمد کل"
            value={summary.totalEarnings}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<RiseOutlined />}
            suffix="تومان"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="در انتظار پرداخت"
            value={summary.pendingAmount}
            precision={0}
            valueStyle={{ color: '#faad14' }}
            prefix={<DollarOutlined />}
            suffix="تومان"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="موجودی قابل برداشت"
            value={summary.availableBalance}
            precision={0}
            valueStyle={{ color: '#1890ff' }}
            prefix={<DollarOutlined />}
            suffix="تومان"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="درآمد ماه جاری"
            value={summary.completedAmount}
            precision={0}
            valueStyle={{ color: '#722ed1' }}
            prefix={<FallOutlined />}
            suffix="تومان"
          />
        </Card>
      </Col>
    </Row>
  );
};