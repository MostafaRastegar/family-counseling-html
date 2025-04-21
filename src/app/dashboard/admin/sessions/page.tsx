'use client';

import React, { useState } from 'react';
import { Button } from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import SessionStatusBadge from '@/components/sessions/SessionStatusBadge';
import { SessionDetailModal } from './components/SessionDetailModal';
import { SessionEditModal } from './components/SessionEditModal';
import { useAdminSessions } from './hooks/useAdminSessions';
import { Session } from './types/session.types';

export default function AdminSessions() {
  const { sessions, loading, updateSession } = useAdminSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const columns = [
    {
      title: 'مشاور',
      dataIndex: 'consultantName',
      key: 'consultantName',
    },
    {
      title: 'مراجع',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'ساعت',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <SessionStatusBadge status={status} />,
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      options: [
        { value: 'pending', label: 'در انتظار تأیید' },
        { value: 'confirmed', label: 'تأیید شده' },
        { value: 'completed', label: 'برگزار شده' },
        { value: 'cancelled', label: 'لغو شده' },
      ],
    },
    {
      key: 'dateRange',
      label: 'بازه زمانی',
      type: 'dateRange',
      placeholder: 'انتخاب تاریخ',
    },
  ];

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setDetailModalVisible(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setEditModalVisible(true);
  };

  const handleUpdateSession = (updateData: any) => {
    if (selectedSession) {
      updateSession(selectedSession.id, updateData);
    }
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت جلسات"
        description="نمایش و مدیریت تمامی جلسات مشاوره در سیستم"
      />

      <DataTable
        title="لیست جلسات"
        dataSource={sessions}
        columns={columns}
        rowKey="id"
        loading={loading}
        filterOptions={filterOptions}
        searchPlaceholder="جستجوی نام مشاور یا مراجع"
        renderActions={(session) => (
          <>
            <Button onClick={() => handleViewDetails(session)}>جزئیات</Button>
            <Button onClick={() => handleEditSession(session)}>ویرایش</Button>
          </>
        )}
        tabs={{
          items: [
            { key: 'all', label: 'همه جلسات' },
            { key: 'pending', label: 'در انتظار تأیید' },
            { key: 'confirmed', label: 'تأیید شده' },
            { key: 'completed', label: 'برگزار شده' },
            { key: 'cancelled', label: 'لغو شده' },
          ],
          onChange: (key) => {
            // Логика фильтрации по табам будет добавлена в компоненте DataTable
          },
        }}
      />

      <SessionDetailModal
        visible={detailModalVisible}
        session={selectedSession}
        onCancel={() => setDetailModalVisible(false)}
      />

      <SessionEditModal
        visible={editModalVisible}
        session={selectedSession}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleUpdateSession}
      />
    </div>
  );
}
