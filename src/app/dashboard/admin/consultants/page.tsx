'use client';

import React, { useMemo } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Rate, Space, Tag, Typography } from 'antd';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { ConsultantActionsMenu } from './components/ConsultantActionsMenu';
import { useConsultantManagement } from './hooks/useConsultantManagement';

const { Text } = Typography;

export default function AdminConsultants() {
  const { consultantList, loading, updateConsultantStatus, deleteConsultant } =
    useConsultantManagement();

  const columns = useMemo(
    () => [
      {
        title: 'نام و نام خانوادگی',
        dataIndex: 'name',
        render: (text, record) => (
          <Space>
            <Avatar
              src={record.image}
              icon={!record.image && <UserOutlined />}
            />
            <span>{text}</span>
          </Space>
        ),
      },
      {
        title: 'تخصص‌ها',
        dataIndex: 'specialties',
        render: (specialties) => (
          <Space>
            {specialties.slice(0, 2).map((specialty) => (
              <Tag key={specialty} color="blue">
                {specialty}
              </Tag>
            ))}
            {specialties.length > 2 && <Tag>+{specialties.length - 2}</Tag>}
          </Space>
        ),
      },
      {
        title: 'امتیاز',
        dataIndex: 'rating',
        render: (rating, record) => (
          <Space>
            <Rate disabled defaultValue={rating} style={{ fontSize: '14px' }} />
            <Text>({record.reviewCount})</Text>
          </Space>
        ),
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: 'وضعیت تأیید',
        dataIndex: 'isVerified',
        render: (isVerified) => (
          <Tag color={isVerified ? 'success' : 'error'}>
            {isVerified ? 'تأیید شده' : 'تأیید نشده'}
          </Tag>
        ),
      },
    ],
    [],
  );

  const filterOptions = [
    {
      key: 'specialties',
      label: 'تخصص',
      type: 'select',
      mode: 'multiple',
      options: [
        { value: 'مشاوره خانواده', label: 'مشاوره خانواده' },
        { value: 'روابط زناشویی', label: 'روابط زناشویی' },
        { value: 'فرزندپروری', label: 'فرزندپروری' },
      ],
    },
  ];

  return (
    <div className="container mx-auto">
      <PageHeader
        title="مدیریت مشاوران"
        description="مدیریت تمامی مشاوران فعال در سیستم"
      />

      <DataTable
        title="لیست مشاوران"
        dataSource={consultantList}
        columns={columns}
        rowKey="id"
        loading={loading}
        filterOptions={filterOptions}
        searchPlaceholder="جستجو بر اساس نام یا تخصص"
        renderActions={(consultant) => (
          <ConsultantActionsMenu
            consultant={consultant}
            onVerify={updateConsultantStatus}
            onDelete={deleteConsultant}
          />
        )}
      />
    </div>
  );
}
