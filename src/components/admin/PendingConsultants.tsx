import React from 'react';
import { Avatar, Button, List, Space, Tag, Tooltip, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Consultant {
  id: string;
  userId: string;
  isVerified: boolean;
  consultantLicense: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  createdAt: string;
}

interface PendingConsultantsProps {
  consultants: Consultant[];
  loading?: boolean;
  onApprove?: (consultantId: string) => void;
  onReject?: (consultantId: string) => void;
  onViewDetails?: (consultantId: string) => void;
}

const PendingConsultants: React.FC<PendingConsultantsProps> = ({
  consultants = [],
  loading = false,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  // فرمت تاریخ درخواست
  const formatCreatedAt = (dateString: string) => {
    return dayjs(dateString).locale('fa').format('YYYY/MM/DD');
  };

  // رویداد تایید مشاور
  const handleApprove = (e: React.MouseEvent, consultantId: string) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(consultantId);
    }
  };

  // رویداد رد کردن مشاور
  const handleReject = (e: React.MouseEvent, consultantId: string) => {
    e.stopPropagation();
    if (onReject) {
      onReject(consultantId);
    }
  };

  // رویداد کلیک روی مشاور
  const handleConsultantClick = (consultantId: string) => {
    if (onViewDetails) {
      onViewDetails(consultantId);
    }
  };

  return (
    <List
      loading={loading}
      dataSource={consultants}
      rowKey="id"
      locale={{ emptyText: 'مشاور در انتظار تایید وجود ندارد' }}
      renderItem={(consultant) => (
        <List.Item
          className="hover:bg-gray-50 cursor-pointer px-4 py-3 transition-colors"
          onClick={() => handleConsultantClick(consultant.id)}
          actions={[
            <Space key="actions">
              <Tooltip title="تایید مشاور">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={(e) => handleApprove(e, consultant.id)}
                />
              </Tooltip>
              <Tooltip title="رد کردن">
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={(e) => handleReject(e, consultant.id)}
                />
              </Tooltip>
            </Space>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={consultant.user.profileImage}
                icon={!consultant.user.profileImage && <UserOutlined />}
              />
            }
            title={
              <div className="flex items-center">
                <span className="ml-2">{consultant.user.fullName}</span>
                <Tag color="orange">در انتظار تایید</Tag>
              </div>
            }
            description={
              <div>
                <Text className="text-xs">{consultant.user.email}</Text>
                <div className="flex flex-col text-xs text-gray-500 md:flex-row">
                  <span>شماره پروانه: {consultant.consultantLicense}</span>
                  <span className="md:before:mx-1 md:before:content-['|']">
                    تاریخ درخواست: {formatCreatedAt(consultant.createdAt)}
                  </span>
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default PendingConsultants;