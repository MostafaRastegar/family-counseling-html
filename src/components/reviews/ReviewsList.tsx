'use client';

import { useState } from 'react';
import {
  CalendarOutlined,
  DislikeOutlined,
  FlagOutlined,
  LikeOutlined,
  MessageOutlined,
  MoreOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  List,
  Menu,
  Pagination,
  Rate,
  Space,
  Tag,
  Typography,
} from 'antd';
import ExpandableText from '../common/expandable-text';

const { Text, Paragraph } = Typography;

const ReviewsList = ({
  reviews = [],
  onReply,
  onLike,
  onDislike,
  onReport,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // تبدیل امتیاز به رنگ
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating === 3) return 'warning';
    return 'error';
  };

  // تعداد کل صفحات
  const totalItems = reviews.length;

  // محتوای صفحه فعلی
  const currentReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // منوی آیتم‌های بیشتر
  const getMoreMenu = (review) => (
    <Menu>
      {onReply && (
        <Menu.Item
          key="reply"
          icon={<MessageOutlined />}
          onClick={() => onReply(review)}
        >
          پاسخ به نظر
        </Menu.Item>
      )}
      {onLike && (
        <Menu.Item
          key="like"
          icon={<LikeOutlined />}
          onClick={() => onLike(review)}
        >
          مفید بود
        </Menu.Item>
      )}
      {onDislike && (
        <Menu.Item
          key="dislike"
          icon={<DislikeOutlined />}
          onClick={() => onDislike(review)}
        >
          مفید نبود
        </Menu.Item>
      )}
      {onReport && (
        <Menu.Item
          key="report"
          icon={<FlagOutlined />}
          danger
          onClick={() => onReport(review)}
        >
          گزارش نظر نامناسب
        </Menu.Item>
      )}
    </Menu>
  );

  if (reviews.length === 0) {
    return <Empty description="هیچ نظری یافت نشد" />;
  }

  return (
    <div className="reviews-list">
      <List
        itemLayout="vertical"
        dataSource={currentReviews}
        renderItem={(review) => (
          <List.Item
            key={review.id}
            actions={[
              onReply && (
                <Button
                  key="reply"
                  type="link"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => onReply(review)}
                >
                  پاسخ
                </Button>
              ),
              onLike && (
                <Button
                  key="like"
                  type="text"
                  size="small"
                  icon={<LikeOutlined />}
                  onClick={() => onLike(review)}
                >
                  {review.likes > 0 && review.likes} مفید بود
                </Button>
              ),
              onDislike && (
                <Button
                  key="dislike"
                  type="text"
                  size="small"
                  icon={<DislikeOutlined />}
                  onClick={() => onDislike(review)}
                >
                  مفید نبود
                </Button>
              ),
            ].filter(Boolean)}
            extra={
              (onReply || onLike || onDislike || onReport) && (
                <Dropdown overlay={getMoreMenu(review)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              )
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={review.clientAvatar}
                  icon={!review.clientAvatar && <UserOutlined />}
                />
              }
              title={
                <Space>
                  <span>{review.clientName}</span>
                  <Tag color={getRatingColor(review.rating)}>
                    {review.rating} <StarOutlined />
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Rate
                    disabled
                    defaultValue={review.rating}
                    className="text-sm"
                  />
                  <Space className="text-xs text-gray-500">
                    <CalendarOutlined />
                    <span>{review.date}</span>
                    {review.sessionId && (
                      <Tag size="small">جلسه #{review.sessionId}</Tag>
                    )}
                  </Space>
                </Space>
              }
            />
            <div className="mt-2">
              <ExpandableText
                maxLines={2}
                expandText="نمایش بیشتر"
                collapseText="نمایش کمتر"
              >
                {review.comment}
              </ExpandableText>

              {review.reply && (
                <div className="bg-gray-50 mt-4 rounded p-4">
                  <div className="flex items-start">
                    <Avatar
                      size="small"
                      src={review.consultantAvatar}
                      icon={!review.consultantAvatar && <UserOutlined />}
                      className="ml-2 mt-1"
                    />
                    <div>
                      <Space className="mb-1">
                        <Text strong>
                          {review.consultantName || 'پاسخ مشاور'}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {review.replyDate}
                        </Text>
                      </Space>
                      <ExpandableText
                        maxLines={2}
                        expandText="نمایش بیشتر"
                        collapseText="نمایش کمتر"
                      >
                        {review.reply}
                      </ExpandableText>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </List.Item>
        )}
      />

      {totalItems > pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
