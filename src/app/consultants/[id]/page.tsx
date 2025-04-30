'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  StarOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TabsProps } from 'antd';
import PageHeader from '@/components/ui/PageHeader';
import ReviewCard from '@/components/ui/card/ReviewCard';
import LoadingState from '@/components/ui/states/LoadingState';
import { consultants } from '@/mocks/consultants';
import { reviews } from '@/mocks/reviews';

const { Title, Text, Paragraph } = Typography;

export default function ConsultantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  const [consultantReviews, setConsultantReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('about');

  // Fetch consultant data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Find consultant in mock data
      const foundConsultant = consultants.find((c) => c.id === consultantId);
      if (foundConsultant) {
        setConsultant(foundConsultant);

        // Find reviews for this consultant
        const consultantReviews = reviews.filter(
          (r) => r.consultantId === consultantId,
        );
        setConsultantReviews(consultantReviews);
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [consultantId]);

  // Handle booking appointment
  const handleBookAppointment = () => {
    router.push(`/consultants/${consultantId}/book`);
  };

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // If still loading
  if (loading) {
    return <LoadingState fullPage={false} />;
  }

  // If consultant not found
  if (!consultant) {
    return (
      <div className="my-20 text-center">
        <h2 className="mb-2 text-2xl font-semibold">مشاور یافت نشد</h2>
        <p className="text-gray-500">
          مشاور مورد نظر یافت نشد یا ممکن است حذف شده باشد.
        </p>
        <Button type="primary" onClick={handleBack} className="mt-4">
          بازگشت به لیست مشاوران
        </Button>
      </div>
    );
  }

  // Tab items for consultant profile
  const tabItems: TabsProps['items'] = [
    {
      key: 'about',
      label: 'درباره مشاور',
      children: (
        <div className="consultant-bio">
          <Paragraph className="text-justify">{consultant.bio}</Paragraph>

          <Divider />

          <Title level={5}>تحصیلات</Title>
          <Paragraph className="whitespace-pre-line">
            {consultant.education}
          </Paragraph>

          <Divider />

          <Title level={5}>تخصص‌ها</Title>
          <div className="mb-4">
            {consultant.specialties.map((specialty: string) => (
              <Tag key={specialty} className="mb-2 ml-2">
                <TagOutlined className="ml-1" />
                {specialty}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: `نظرات (${consultantReviews.length})`,
      children: (
        <div className="consultant-reviews">
          {consultantReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {consultantReviews.map((review: any) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Text type="secondary">هنوز نظری ثبت نشده است</Text>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="consultant-detail-page">
      <PageHeader
        title={consultant.user.fullName}
        subtitle={consultant.specialties.slice(0, 3).join(' • ')}
        backButton={{
          onClick: handleBack,
        }}
        actions={[
          {
            key: 'book',
            text: 'رزرو وقت مشاوره',
            icon: <CalendarOutlined />,
            onClick: handleBookAppointment,
            type: 'primary',
          },
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* Consultant profile info card */}
        <Col xs={24} md={8}>
          <Card className="consultant-profile-card">
            <div className="flex flex-col items-center text-center">
              <Avatar
                size={120}
                src={consultant.user.profileImage}
                icon={!consultant.user.profileImage && <UserOutlined />}
                className="mb-4"
              />

              <Title level={4} className="mb-1">
                {consultant.user.fullName}
              </Title>

              {consultant.isVerified && (
                <Tag
                  color="success"
                  icon={<CheckCircleOutlined />}
                  className="mb-2"
                >
                  مشاور تایید شده
                </Tag>
              )}

              <div className="mb-4">
                <Rate disabled defaultValue={consultant.rating} />
                <div>
                  <Text>
                    <StarOutlined className="text-yellow-500 ml-1" />
                    {consultant.rating} از {consultant.reviewCount} نظر
                  </Text>
                </div>
              </div>

              <Divider />

              <Space direction="vertical" className="w-full">
                <div className="flex items-center">
                  <MessageOutlined className="text-blue-500 ml-2" />
                  <Text>شماره پروانه: {consultant.consultantLicense}</Text>
                </div>

                {consultant.user.email && (
                  <div className="flex items-center">
                    <MessageOutlined className="text-blue-500 ml-2" />
                    <Text>{consultant.user.email}</Text>
                  </div>
                )}
              </Space>

              <Divider />

              <Title level={5}>تعرفه مشاوره</Title>
              <div className="price-section bg-gray-50 w-full rounded-lg p-4">
                <div className="mb-2">
                  <Text>هر جلسه ۶۰ دقیقه‌ای</Text>
                </div>
                <Title level={4} className="text-green-600">
                  ۲۵۰,۰۰۰ تومان
                </Title>
              </div>

              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={handleBookAppointment}
                size="large"
                block
                className="mt-4"
              >
                رزرو وقت مشاوره
              </Button>
            </div>
          </Card>
        </Col>

        {/* Consultant details tab content */}
        <Col xs={24} md={16}>
          <Card>
            <Tabs
              defaultActiveKey="about"
              items={tabItems}
              onChange={setActiveTab}
            />
          </Card>

          {/* Available appointment times - This would be a separate component in a real implementation */}
          <Card className="mt-6">
            <Title level={5}>
              <ClockCircleOutlined className="ml-2" />
              زمان‌های در دسترس
            </Title>
            <div className="bg-gray-50 rounded-lg p-4">
              <Text>
                برای مشاهده زمان‌های در دسترس این مشاور و رزرو وقت، روی دکمه زیر
                کلیک کنید.
              </Text>
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={handleBookAppointment}
                className="mt-4"
              >
                مشاهده زمان‌های در دسترس
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
