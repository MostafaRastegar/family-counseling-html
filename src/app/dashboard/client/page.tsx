'use client';

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tabs, Typography } from 'antd';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import Notifications, {
  Notification,
} from '@/components/ui/dashboard/Notifications';
import QuickActions from '@/components/ui/dashboard/QuickActions';
import UserStats from '@/components/ui/dashboard/UserStats';
import { authData } from '@/mocks/auth';
import { sessions } from '@/mocks/sessions';

const { Title, Text } = Typography;

export default function ClientDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  // Load user data and other information
  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setLoading(true);

      try {
        // Set current user from auth data (mock)
        setCurrentUser(authData.currentUser);

        // Load sample notifications
        const sampleNotifications: Notification[] = [
          {
            id: '1',
            title: 'رزرو جلسه جدید',
            message: 'جلسه جدیدی برای فردا ساعت ۱۵:۰۰ رزرو شده است.',
            time: '۳۰ دقیقه پیش',
            read: false,
            type: 'info',
            category: 'session',
            link: '/dashboard/sessions',
          },
          {
            id: '2',
            title: 'دریافت نظر جدید',
            message: 'مشاور برای جلسه اخیر شما بازخورد ثبت کرده است.',
            time: '۱ ساعت پیش',
            read: false,
            type: 'success',
            category: 'review',
            link: '/dashboard/reviews',
          },
          {
            id: '3',
            title: 'پرداخت موفق',
            message: 'پرداخت شما با موفقیت انجام شد.',
            time: '۳ ساعت پیش',
            read: true,
            type: 'success',
            category: 'payment',
          },
        ];
        setNotifications(sampleNotifications);

        // Load upcoming sessions (only for client)
        const filteredSessions = sessions.filter(
          (s) =>
            s.client.user.id === currentUser?.id &&
            ['confirmed', 'pending'].includes(s.status),
        );

        // Sort by date
        filteredSessions.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setUpcomingSessions(filteredSessions.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  // Determine welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let timeGreeting;

    if (hour < 12) {
      timeGreeting = 'صبح بخیر';
    } else if (hour < 17) {
      timeGreeting = 'عصر بخیر';
    } else {
      timeGreeting = 'شب بخیر';
    }

    return `${timeGreeting}، ${currentUser?.fullName || 'مراجع عزیز'}`;
  };

  // Tab items for sessions section
  const sessionsTabs = [
    {
      key: 'upcoming',
      label: 'جلسات آینده',
      children: (
        <div>
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <Card
                key={session.id}
                size="small"
                className="mb-3 cursor-pointer hover:shadow-md"
                onClick={() =>
                  (window.location.href = `/dashboard/client/sessions/${session.id}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium">
                        جلسه با {session.consultant.user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <div>
                    {new Date(session.date).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              جلسه آینده‌ای ندارید
            </div>
          )}

          <div className="mt-2 text-center">
            <a
              href="/dashboard/client/sessions"
              className="text-primary-500 hover:underline"
            >
              مشاهده همه جلسات
            </a>
          </div>
        </div>
      ),
    },
    {
      key: 'recent',
      label: 'جلسات اخیر',
      children: (
        <div className="py-4 text-center text-gray-500">جلسه اخیری ندارید</div>
      ),
    },
  ];

  return (
    <div className="client-dashboard-page">
      <DashboardBreadcrumb />

      <div className="mb-6 mt-4">
        <Title level={3}>{getWelcomeMessage()}</Title>
        <Text type="secondary">خلاصه وضعیت و فعالیت‌های اخیر شما</Text>
      </div>

      {/* User Stats Section */}
      <UserStats userRole="client" loading={loading} className="mb-6" />

      {/* Quick Actions Section */}
      <QuickActions userRole="client" className="mb-6" />

      {/* Main Content Area */}
      <Row gutter={[16, 16]}>
        {/* Notifications Column */}
        <Col xs={24} md={16}>
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            loading={loading}
            maxItems={5}
            showViewAll={true}
            className="mb-4"
          />

          {/* Featured Consultants or Recent Reviews section could go here */}
          <Card title="مشاوران پیشنهادی" className="mb-4">
            <div className="flex items-center justify-center py-8 text-gray-500">
              با توجه به علایق شما، می‌توانید از مشاوران زیر کمک بگیرید
            </div>
          </Card>
        </Col>

        {/* Sessions Column */}
        <Col xs={24} md={8}>
          <Card>
            <Tabs defaultActiveKey="upcoming" items={sessionsTabs} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
