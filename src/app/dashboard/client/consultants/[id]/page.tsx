'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Comment,
  Divider,
  List,
  Rate,
  Skeleton,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message,
} from 'antd';
import BookingForm from '@/components/clients/BookingForm';
import AvailabilityCalendar from '@/components/consultants/AvailabilityCalendar';
import ReviewsList from '@/components/reviews/ReviewsList';
import { consultants } from '@/mocks/consultants';
// داده‌های نمونه
import { reviews } from '@/mocks/reviews';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function ConsultantDetail({ params }) {
  const [consultant, setConsultant] = useState(null);
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
      <div className="container mx-auto px-4">
        <Card>
          <Skeleton avatar active paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Title level={3}>مشاور مورد نظر یافت نشد</Title>
        <Link href="/dashboard/client/consultants">
          <Button type="primary" className="mt-4">
            بازگشت به لیست مشاوران
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Card>
        <div className="mb-6 flex flex-col items-start md:flex-row md:items-center">
          <Avatar
            size={100}
            src={consultant.image}
            icon={!consultant.image && <UserOutlined />}
            className="mb-4 md:mb-0 md:ml-6"
          />
          <div>
            <Title level={3}>{consultant.name}</Title>
            <div className="mb-3">
              {consultant.specialties.map((specialty, index) => (
                <Tag key={index} color="blue" className="mb-1 ml-1">
                  {specialty}
                </Tag>
              ))}
            </div>
            <div className="mb-3 flex items-center">
              <Rate disabled defaultValue={consultant.rating} />
              <Text className="mr-2">({consultant.reviewCount} نظر)</Text>
            </div>
            {consultant.isVerified && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                مشاور تأیید شده
              </Tag>
            )}
          </div>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                درباره مشاور
              </span>
            }
            key="1"
          >
            <div className="mb-6">
              <Title level={4}>شرح حال</Title>
              <Paragraph>{consultant.bio}</Paragraph>
            </div>

            <div className="mb-6">
              <Title level={4}>تحصیلات و سوابق</Title>
              <Paragraph>{consultant.education}</Paragraph>
            </div>

            <Divider />

            <Title level={4}>تخصص‌ها</Title>
            <div className="mb-6">
              {consultant.specialties.map((specialty, index) => (
                <Tag
                  key={index}
                  color="blue"
                  className="mb-2 ml-2 px-3 py-1 text-base"
                >
                  {specialty}
                </Tag>
              ))}
            </div>

            <Divider />

            <div className="text-center">
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                onClick={() => setActiveTab('2')}
              >
                رزرو جلسه مشاوره
              </Button>
            </div>
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
            <Title level={4}>انتخاب زمان مشاوره</Title>
            <Paragraph className="mb-6">
              لطفاً تاریخ و زمان مورد نظر خود را برای جلسه مشاوره انتخاب کنید.
            </Paragraph>

            <AvailabilityCalendar consultantId={consultant.id} />
            <BookingForm consultant={consultant} />
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
      </Card>
    </div>
  );
}
