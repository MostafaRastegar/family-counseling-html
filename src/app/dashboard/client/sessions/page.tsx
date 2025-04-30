'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notification } from 'antd';
import SessionsList from '@/components/sessions/SessionsList';
import { SessionStatus } from '@/components/sessions/session';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import { authSamples } from '@/mocks/auth';
import { sessions } from '@/mocks/sessions';

export default function ClientSessionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userSessions, setUserSessions] = useState<any[]>([]);

  // Get current user
  const currentUser = authSamples.client;

  // Fetch sessions data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Filter sessions for client
      const filteredSessions = sessions.filter(
        (s) => s.client.user.id === currentUser?.id,
      );

      setUserSessions(filteredSessions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser?.id]);

  // Handle view session details
  const handleViewSessionDetails = (sessionId: string) => {
    router.push(`/dashboard/sessions/${sessionId}`);
  };

  // Handle update session status
  const handleUpdateSessionStatus = (
    sessionId: string,
    status: SessionStatus,
  ) => {
    // Simulate API call
    setLoading(true);

    setTimeout(() => {
      // Update session status in mock data
      const updatedSessions = userSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      });

      setUserSessions(updatedSessions);
      setLoading(false);

      // Show success notification
      notification.success({
        message: 'وضعیت جلسه به‌روزرسانی شد',
        description: `وضعیت جلسه با موفقیت به "${
          status === 'cancelled'
            ? 'لغو شده'
            : status === 'confirmed'
              ? 'تایید شده'
              : 'انجام شده'
        }" تغییر یافت.`,
      });
    }, 1000);
  };

  // Handle add new session
  const handleAddSession = () => {
    router.push('/consultants');
  };

  return (
    <div className="sessions-page">
      <DashboardBreadcrumb />

      <PageHeader
        title="جلسات مشاوره"
        subtitle="مدیریت و مشاهده جلسات مشاوره خود"
      />

      <SessionsList
        sessions={userSessions}
        loading={loading}
        userRole="client"
        onViewDetails={handleViewSessionDetails}
        onUpdateStatus={handleUpdateSessionStatus}
        onAddSession={handleAddSession}
        showFilters={true}
        showAddButton={true}
      />
    </div>
  );
}
