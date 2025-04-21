'use client';

import React, { useState } from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Button, Tabs, Typography } from 'antd';
import PageHeader from '@/components/common/PageHeader';
import SessionsList from '@/components/sessions/SessionsList';
import { SessionMessageModal } from './components/SessionMessageModal';
import { SessionNotesModal } from './components/SessionNotesModal';
import { SessionStatusModal } from './components/SessionStatusModal';
import { useConsultantSessions } from './hooks/useConsultantSessions';
import { Session } from './types/session.types';

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

export default function ConsultantSessions() {
  const consultantId = 1; // در محیط واقعی از کانتکست یا استور دریافت می‌شود
  const {
    sessions,
    filteredSessions,
    loading,
    updateSessionStatus,
    addSessionNotes,
    sendSessionMessage,
  } = useConsultantSessions(consultantId);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
  };

  const handleStatusChange = (session: Session) => {
    setSelectedSession(session);
    setStatusModalVisible(true);
  };

  const handleAddNotes = (session: Session) => {
    setSelectedSession(session);
    setNotesModalVisible(true);
  };

  const handleSendMessage = (session: Session) => {
    setSelectedSession(session);
    setMessageModalVisible(true);
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت جلسات مشاوره"
        description="در این بخش می‌توانید جلسات مشاوره خود را مدیریت کنید"
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
          <SessionsList
            sessions={filteredSessions.upcoming}
            loading={loading}
            userType="consultant"
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onAddNotes={handleAddNotes}
            onSendMessage={handleSendMessage}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <ClockCircleOutlined />
              جلسات برگزار شده ({filteredSessions.completed.length})
            </span>
          }
          key="completed"
        >
          <SessionsList
            sessions={filteredSessions.completed}
            loading={loading}
            userType="consultant"
            onViewDetails={handleViewDetails}
            onAddNotes={handleAddNotes}
          />
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
            userType="consultant"
            onViewDetails={handleViewDetails}
          />
        </TabPane>
      </Tabs>

      <SessionStatusModal
        visible={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onSubmit={(status, reason) => {
          if (selectedSession) {
            updateSessionStatus(selectedSession.id, { status, reason });
          }
        }}
      />

      <SessionNotesModal
        visible={notesModalVisible}
        initialNotes={selectedSession?.notes}
        onCancel={() => setNotesModalVisible(false)}
        onSubmit={(notes) => {
          if (selectedSession) {
            addSessionNotes(selectedSession.id, { notes });
          }
        }}
      />

      <SessionMessageModal
        visible={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        onSubmit={(messageType, message) => {
          if (selectedSession) {
            sendSessionMessage(selectedSession.id, {
              messageType,
              message,
            });
          }
        }}
      />
    </div>
  );
}
