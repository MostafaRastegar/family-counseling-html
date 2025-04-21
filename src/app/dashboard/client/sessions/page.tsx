'use client';

import React, { useState } from 'react';
import {
  CalendarOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Alert, Button, Tabs, Typography } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import SessionCard from '@/components/sessions/SessionCard';
import SessionsList from '@/components/sessions/SessionsList';
import { SessionCancelModal } from './components/SessionCancelModal';
import { SessionReviewModal } from './components/SessionReviewModal';
import { useClientSessions } from './hooks/useClientSessions';
import { Session } from './types/session.types';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function ClientSessions() {
  const { filteredSessions, loading, cancelSession, addSessionReview } =
    useClientSessions();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
  };

  const handleCancelSession = (session: Session) => {
    setSelectedSession(session);
    setCancelModalVisible(true);
  };

  const handleReviewSession = (session: Session) => {
    setSelectedSession(session);
    setReviewModalVisible(true);
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="جلسات مشاوره من"
        description="مدیریت جلسات مشاوره، مشاهده تاریخچه و ثبت نظر"
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              جلسات آینده ({filteredSessions.upcoming.length})
            </span>
          }
          key="upcoming"
        >
          {filteredSessions.upcoming.length > 0 ? (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredSessions.upcoming.slice(0, 2).map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    type="client"
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelSession}
                  />
                ))}
              </div>

              <SessionsList
                sessions={filteredSessions.upcoming}
                loading={loading}
                userType="client"
                onViewDetails={handleViewDetails}
                onCancel={handleCancelSession}
              />
            </>
          ) : (
            <Alert
              message="هیچ جلسه آینده‌ای ندارید"
              description="برای رزرو جلسه جدید، به بخش مشاوران مراجعه کنید."
              type="info"
              showIcon
              action={
                <Button type="primary" href="/dashboard/client/consultants">
                  رزرو جلسه جدید
                </Button>
              }
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              جلسات برگزار شده ({filteredSessions.completed.length})
            </span>
          }
          key="completed"
        >
          {filteredSessions.completed.length > 0 ? (
            <>
              <div className="mb-6">
                <Title level={4}>جلساتی که نیاز به ثبت نظر دارند</Title>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredSessions.completed
                    .filter((s) => !s.hasReview)
                    .map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        type="client"
                        onViewDetails={handleViewDetails}
                        onReview={handleReviewSession}
                      />
                    ))}
                </div>
                {filteredSessions.completed.filter((s) => !s.hasReview)
                  .length === 0 && (
                  <Alert
                    message="همه نظرات ثبت شده‌اند"
                    description="برای تمام جلسات برگزار شده، نظر خود را ثبت کرده‌اید"
                    type="success"
                    showIcon
                  />
                )}
              </div>

              <SessionsList
                sessions={filteredSessions.completed}
                loading={loading}
                userType="client"
                onViewDetails={handleViewDetails}
              />
            </>
          ) : (
            <Alert
              message="هنوز هیچ جلسه‌ای برگزار نکرده‌اید"
              type="info"
              showIcon
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <CloseCircleOutlined />
              جلسات لغو شده ({filteredSessions.cancelled.length})
            </span>
          }
          key="cancelled"
        >
          <SessionsList
            sessions={filteredSessions.cancelled}
            loading={loading}
            userType="client"
            onViewDetails={handleViewDetails}
          />
        </TabPane>
      </Tabs>

      <SessionCancelModal
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onSubmit={(cancellationData) => {
          if (selectedSession) {
            cancelSession(selectedSession.id, cancellationData);
          }
        }}
      />

      <SessionReviewModal
        visible={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onSubmit={(reviewData) => {
          if (selectedSession) {
            addSessionReview(selectedSession.id, reviewData);
          }
        }}
      />
    </div>
  );
}
