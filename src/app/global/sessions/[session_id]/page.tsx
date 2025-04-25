'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Modal, notification } from 'antd';
import ReviewForm from '@/components/sessions/ReviewForm';
import SessionDetail from '@/components/sessions/SessionDetail';
import { SessionStatus } from '@/components/sessions/session';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import PageHeader from '@/components/ui/PageHeader';
import { authData } from '@/mocks/auth';
import { sessions } from '@/mocks/sessions';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  console.log('params :>> ', params);
  const sessionId = params.session_id as string;
  console.log('sessionId :>> ', sessionId);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Get current user
  const currentUser = authData.currentUser;
  const userRole = currentUser?.role || 'client';

  // Fetch session data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Find session in mock data
      const foundSession = sessions.find((s) => s.id === sessionId);
      setSession(foundSession || null);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId]);

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

      // If session was completed, show review modal for clients
      if (status === 'completed' && userRole === 'client') {
        setReviewModalVisible(true);
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

  // Handle add review
  const handleAddReview = (sessionId: string) => {
    setReviewModalVisible(true);
  };

  // Handle send message
  const handleSendMessage = (sessionId: string) => {
    // Navigate to messaging page
    router.push(`/dashboard/messaging?sessionId=${sessionId}`);
  };

  // Handle review submission
  const handleReviewSubmit = (values: any) => {
    setActionLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      setActionLoading(false);
      setReviewModalVisible(false);

      // Show success notification
      notification.success({
        message: 'نظر شما ثبت شد',
        description: 'نظر شما با موفقیت ثبت شد. از مشارکت شما متشکریم.',
      });
    }, 1500);
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
            ? `جلسه با ${
                userRole === 'consultant'
                  ? session.client.user.fullName
                  : session.consultant.user.fullName
              } در تاریخ ${formatSessionDate(session.date)}`
            : ''
        }
        backButton={{
          onClick: handleBack,
        }}
      />

      <SessionDetail
        session={session}
        loading={loading}
        error={!session && !loading ? 'جلسه مورد نظر یافت نشد' : undefined}
        userRole={userRole as any}
        onUpdateStatus={handleUpdateStatus}
        onEditNotes={handleEditNotes}
        onAddReview={handleAddReview}
        onSendMessage={handleSendMessage}
      />

      {/* Review Modal */}
      <Modal
        title="ثبت نظر برای جلسه مشاوره"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        width={800}
      >
        {session && (
          <ReviewForm
            sessionId={session.id}
            consultantName={session.consultant.user.fullName}
            consultantImage={session.consultant.user.profileImage}
            sessionDate={formatSessionDate(session.date)}
            onSubmit={handleReviewSubmit}
            onCancel={() => setReviewModalVisible(false)}
            loading={actionLoading}
          />
        )}
      </Modal>
    </div>
  );
}
