'use client';

import React, { useState } from 'react';
import {
  CalendarOutlined,
  CommentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Tabs, Typography, message } from 'antd';
import LoadingState from '@/components/common/LoadingState';
import { ConsultantAvailability } from './components/ConsultantAvailability';
import { ConsultantProfile } from './components/ConsultantProfile';
import { ConsultantReviews } from './components/ConsultantReviews';
import { useConsultantDetail } from './hooks/useConsultantDetail';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function ConsultantDetail({
  params,
}: {
  params: { id: string };
}) {
  const consultantId = parseInt(params.id);
  const { consultant, consultantReviews, loading } =
    useConsultantDetail(consultantId);
  const [activeTab, setActiveTab] = useState('1');

  if (loading) {
    return <LoadingState fullPage />;
  }

  if (!consultant) {
    message.error('مشاور مورد نظر یافت نشد');
    return null;
  }

  return (
    <div className="container mx-auto">
      <Title level={2}>پروفایل مشاور</Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              درباره مشاور
            </span>
          }
          key="1"
        >
          <ConsultantProfile consultant={consultant} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              رزرو جلسه
            </span>
          }
          key="2"
        >
          <ConsultantAvailability consultantId={consultantId} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CommentOutlined />
              نظرات ({consultantReviews.length})
            </span>
          }
          key="3"
        >
          <ConsultantReviews reviews={consultantReviews} />
        </TabPane>
      </Tabs>
    </div>
  );
}
