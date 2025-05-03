'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Modal, notification } from 'antd';
import SessionDetail from '@/components/sessions/SessionDetail';
import { SessionStatus } from '@/components/sessions/session';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { consultants } from '@/mocks/consultants';
import { sessions } from '@/mocks/sessions';

export default function ConsultantSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id as string;
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Get current user
  const currentUser = authData.currentUser;

  // Fetch session data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Find consultant ID for current user
      const consultantId = consultants.find(
        (c) => c.userId === currentUser?.id,
      )?.id;

      // Find session in mock data
      const foundSession = sessions.find((s) => s.id === sessionId);

      // Verify this session belongs to the current consultant
      if (foundSession && foundSession.consultantId === consultantId) {
        setSession(foundSession);
      } else {
        setSession(null);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId, currentUser?.id]);

  // Handle session status update
  const handleUpdateStatus = (sessionId: string, status: SessionStatus) => {
    setActionLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      // Update session status in mock data
      const updatedSession = {
        ...session,
        status,
        updatedAt: new Date().toISOString(),
      };

      setSession(updatedSession);
      setActionLoading(false);

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

      // If session was completed, notify about client review opportunity
      if (status === 'completed') {
        notification.info({
          message: 'جلسه تکمیل شد',
          description: 'مراجع اکنون می‌تواند نظر خود را درباره جلسه ثبت کند.',
        });
      }
    }, 1500);
  };

  // Handle edit notes
  const handleEditNotes = (sessionId: string, notes: string) => {
    setActionLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      // Update session notes in mock data
      const updatedSession = {
        ...session,
        notes,
        updatedAt: new Date().toISOString(),
      };

      setSession(updatedSession);
      setActionLoading(false);

      // Show success notification
      notification.success({
        message: 'یادداشت‌ها به‌روزرسانی شد',
        description: 'یادداشت‌های جلسه با موفقیت به‌روزرسانی شد.',
      });
    }, 1000);
  };

  // Handle send message
  const handleSendMessage = (sessionId: string) => {
    // Navigate to messaging page
    router.push(`/dashboard/messaging?sessionId=${sessionId}`);
  };

  // Handle back button
  const handleBack = () => {
    router.push('/dashboard/sessions');
  };

  // Format session date
  const formatSessionDate = (dateStr: string) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="session-detail-page">
      <DashboardBreadcrumb />

      <PageHeader
        title="جزئیات جلسه مشاوره"
        subtitle={
          session
            ? `جلسه با ${session.client.user.fullName} در تاریخ ${formatSessionDate(session.date)}`
            : ''
        }
        backButton={{
          onClick: handleBack,
        }}
      />

      <SessionDetail
        session={session}
        loading={loading}
        error={
          !session && !loading
            ? 'جلسه مورد نظر یافت نشد یا به این جلسه دسترسی ندارید'
            : undefined
        }
        userRole="consultant"
        onUpdateStatus={handleUpdateStatus}
        onEditNotes={handleEditNotes}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
