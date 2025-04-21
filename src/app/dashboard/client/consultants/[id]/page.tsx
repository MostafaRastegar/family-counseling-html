'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Tabs, Tag, Typography, message } from 'antd';
import BookingForm from '@/components/clients/BookingForm';
import DetailView from '@/components/common/DetailView';
import AvailabilityCalendar from '@/components/consultants/AvailabilityCalendar';
import ReviewsList from '@/components/reviews/ReviewsList';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';

const { TabPane } = Tabs;

export default function ConsultantDetail({ params }) {
  const [consultant, setConsultant] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const searchParams = useSearchParams();
  const showBooking = searchParams.get('booking') === 'true';

  useEffect(() => {
    if (showBooking) {
      setActiveTab('2'); // تب رزرو جلسه
    }
  }, [showBooking]);

  useEffect(() => {
    // شبیه‌سازی دریافت اطلاعات مشاور از API
    setTimeout(() => {
      const foundConsultant = consultants.find(
        (c) => c.id.toString() === params.id,
      );
      if (foundConsultant) {
        setConsultant(foundConsultant);
      } else {
        message.error('مشاور مورد نظر یافت نشد!');
      }
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const consultantReviews = reviews.filter(
    (review) => review.consultantId.toString() === params.id,
  );

  if (loading) {
    return (
      <DetailView
        loading={true}
        sections={[
          {
            title: 'در حال بارگذاری...',
            fields: [],
          },
        ]}
      />
    );
  }

  if (!consultant) {
    return (
      <DetailView
        sections={[
          {
            title: 'خطا',
            fields: [
              {
                label: 'پیغام',
                value: 'مشاور مورد نظر یافت نشد',
              },
            ],
          },
        ]}
        actions={[
          {
            key: 'back',
            label: 'بازگشت به لیست مشاوران',
            onClick: () =>
              (window.location.href = '/dashboard/client/consultants'),
            type: 'primary',
          },
        ]}
      />
    );
  }

  return (
    <DetailView
      header={{
        title: consultant?.name,
        subtitle: consultant?.specialties?.join(', '),
        avatar: {
          src: consultant?.image,
          icon: <UserOutlined />,
        },
        tags: [
          consultant?.isVerified && (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              مشاور تأیید شده
            </Tag>
          ),
        ].filter(Boolean),
      }}
      sections={[
        {
          title: 'اطلاعات شخصی',
          fields: [
            {
              label: 'شرح حال',
              value: consultant?.bio,
            },
            {
              label: 'تحصیلات و سوابق',
              value: consultant?.education,
            },
            {
              label: 'امتیاز',
              value: (
                <div className="flex items-center">
                  <span>{consultant?.rating}</span>
                  <StarOutlined className="text-yellow-500 mr-2" />
                  <span>({consultant?.reviewCount} نظر)</span>
                </div>
              ),
            },
          ],
        },
        {
          title: 'تخصص‌ها',
          fields: [
            {
              label: 'حوزه‌های تخصصی',
              value: consultant?.specialties.map((specialty, index) => (
                <Tag key={index} color="blue" className="mb-1 ml-1">
                  {specialty}
                </Tag>
              )),
            },
          ],
        },
      ]}
      actions={[
        {
          key: 'book-session',
          label: 'رزرو جلسه مشاوره',
          icon: <CalendarOutlined />,
          onClick: () => setActiveTab('2'),
          type: 'primary',
        },
      ]}
      footer={
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                درباره مشاور
              </span>
            }
            key="1"
          />
          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                رزرو جلسه
              </span>
            }
            key="2"
          >
            <Card>
              <AvailabilityCalendar
                consultantId={consultant?.id}
                onSelectTimeSlot={undefined}
              />
              <BookingForm
                consultant={consultant}
                selectedTimeSlot={undefined}
              />
            </Card>
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
            <ReviewsList reviews={consultantReviews} />
          </TabPane>
        </Tabs>
      }
    />
  );
}
