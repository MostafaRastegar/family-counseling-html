'use client';

import { useEffect, useState } from 'react';
import {
  CalendarOutlined,
  DislikeOutlined,
  FilterOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Empty,
  List,
  Menu,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { reviews } from '@/mocks/reviews';

// داده‌های نمونه

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function ConsultantReviews() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [allReviews, setAllReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterRating, setFilterRating] = useState(null);

  // شبیه‌سازی آماده شدن داده‌ها
  useEffect(() => {
    setTimeout(() => {
      // در حالت واقعی، فقط نظرات مشاور فعلی را می‌گیریم
      const consultantId = 1; // ID مشاور فعلی
      const consultantReviews = reviews.filter(
        (review) => review.consultantId === consultantId,
      );

      setAllReviews(consultantReviews);
      setSortedReviews(consultantReviews);
      setLoading(false);
    }, 1000);
  }, []);

  // اعمال فیلتر و مرتب‌سازی
  useEffect(() => {
    let filteredReviews = [...allReviews];

    // فیلتر بر اساس تب فعال
    if (activeTab === 'positive') {
      filteredReviews = filteredReviews.filter((review) => review.rating >= 4);
    } else if (activeTab === 'negative') {
      filteredReviews = filteredReviews.filter((review) => review.rating < 3);
    }

    // فیلتر بر اساس امتیاز
    if (filterRating) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === filterRating,
      );
    }

    // مرتب‌سازی
    filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setSortedReviews(filteredReviews);
  }, [allReviews, activeTab, sortBy, filterRating]);

  // محاسبه آمار نظرات
  const calculateStats = () => {
    if (allReviews.length === 0) return { avgRating: 0, ratingCounts: [] };

    // میانگین امتیازها
    const avgRating =
      allReviews.reduce((sum, review) => sum + review.rating, 0) /
      allReviews.length;

    // تعداد هر امتیاز
    const ratingCounts = [0, 0, 0, 0, 0]; // برای امتیازهای 1 تا 5
    allReviews.forEach((review) => {
      ratingCounts[review.rating - 1]++;
    });

    // درصد هر امتیاز
    const ratingPercentages = ratingCounts.map(
      (count) => (count / allReviews.length) * 100,
    );

    return {
      avgRating: parseFloat(avgRating.toFixed(1)),
      ratingCounts,
      ratingPercentages,
    };
  };

  const stats = calculateStats();

  // نمایش درصد هر امتیاز
  const renderRatingDistribution = () => {
    return (
      <div className="mb-6">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="mb-2 flex items-center">
            <div className="w-14 text-left">
              <Space>
                <span>{rating}</span>
                <StarOutlined className="text-yellow-400" />
              </Space>
            </div>
            <div className="mx-4 flex-1">
              <Progress
                percent={stats?.ratingPercentages?.[rating - 1]}
                showInfo={false}
                strokeColor={
                  rating >= 4 ? '#52c41a' : rating === 3 ? '#faad14' : '#ff4d4f'
                }
              />
            </div>
            <div className="w-14 text-left">
              {stats.ratingCounts[rating - 1]} نظر
            </div>
          </div>
        ))}
      </div>
    );
  };

  // منوی مرتب‌سازی
  const sortMenu = (
    <Menu
      selectedKeys={[sortBy]}
      onClick={({ key }) => setSortBy(key)}
      items={[
        {
          key: 'date_desc',
          label: 'جدیدترین',
          icon: <SortDescendingOutlined />,
        },
        {
          key: 'date_asc',
          label: 'قدیمی‌ترین',
          icon: <SortAscendingOutlined />,
        },
        {
          key: 'rating_desc',
          label: 'بالاترین امتیاز',
          icon: <SortDescendingOutlined />,
        },
        {
          key: 'rating_asc',
          label: 'پایین‌ترین امتیاز',
          icon: <SortAscendingOutlined />,
        },
      ]}
    />
  );

  return (
    <div className="container mx-auto">
      <Title level={2}>نظرات دریافتی</Title>
      <Paragraph className="mb-8 text-gray-500">
        مشاهده و مدیریت نظرات دریافتی از مراجعان.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <div className="text-center">
              <Title level={2} className="mb-2">
                {stats.avgRating}
              </Title>
              <Rate disabled defaultValue={stats.avgRating} />
              <Paragraph className="mt-2">
                از مجموع {allReviews.length} نظر
              </Paragraph>
            </div>

            <Divider />

            {renderRatingDistribution()}
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            loading={loading}
            title={
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                  { key: 'all', label: `همه نظرات (${allReviews.length})` },
                  {
                    key: 'positive',
                    label: `نظرات مثبت (${allReviews.filter((r) => r.rating >= 4).length})`,
                  },
                  {
                    key: 'negative',
                    label: `نظرات منفی (${allReviews.filter((r) => r.rating < 3).length})`,
                  },
                ]}
              />
            }
            extra={
              <Space>
                <Select
                  placeholder="فیلتر امتیاز"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => setFilterRating(value)}
                >
                  <Option value={5}>5 ستاره</Option>
                  <Option value={4}>4 ستاره</Option>
                  <Option value={3}>3 ستاره</Option>
                  <Option value={2}>2 ستاره</Option>
                  <Option value={1}>1 ستاره</Option>
                </Select>

                <Dropdown overlay={sortMenu} placement="bottomRight">
                  <Button icon={<FilterOutlined />}>مرتب‌سازی</Button>
                </Dropdown>
              </Space>
            }
          >
            {sortedReviews.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={sortedReviews}
                renderItem={(review) => (
                  <List.Item
                    key={review.id}
                    actions={[
                      <Button
                        key="reply"
                        type="link"
                        size="small"
                        icon={<MessageOutlined />}
                      >
                        پاسخ
                      </Button>,
                      <Button
                        key="like"
                        type="text"
                        size="small"
                        icon={<LikeOutlined />}
                      >
                        مفید بود
                      </Button>,
                      <Button
                        key="dislike"
                        type="text"
                        size="small"
                        icon={<DislikeOutlined />}
                      >
                        مفید نبود
                      </Button>,
                    ]}
                    extra={
                      <Dropdown
                        overlay={
                          <Menu
                            items={[
                              {
                                key: 'flag',
                                label: 'گزارش نظر نامناسب',
                                danger: true,
                              },
                            ]}
                          />
                        }
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <span>{review.clientName}</span>
                          <Tag
                            color={
                              review.rating >= 4
                                ? 'success'
                                : review.rating === 3
                                  ? 'warning'
                                  : 'error'
                            }
                          >
                            {review.rating} ستاره
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Rate disabled defaultValue={review.rating} />
                          <Text type="secondary">
                            <CalendarOutlined className="mr-1" />
                            {review.date}
                          </Text>
                        </Space>
                      }
                    />
                    <div className="mt-2">
                      <Paragraph>{review.comment}</Paragraph>

                      {review.reply && (
                        <div className="bg-gray-50 mt-4 rounded p-4">
                          <div className="mb-2 flex items-center">
                            <Avatar size="small" className="mr-2" />
                            <Text strong>پاسخ شما:</Text>
                          </div>
                          <Paragraph>{review.reply}</Paragraph>
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
                pagination={{
                  onChange: (page) => {
                    window.scrollTo(0, 0);
                  },
                  pageSize: 5,
                }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  filterRating
                    ? `هیچ نظری با امتیاز ${filterRating} یافت نشد`
                    : 'هیچ نظری یافت نشد'
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
