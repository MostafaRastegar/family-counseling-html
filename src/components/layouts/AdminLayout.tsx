import React from 'react';
import { Typography } from 'antd';
import DashboardLayout from './DashboardLayout';

const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  currentUser?: {
    fullName: string;
    profileImage?: string;
  } | null;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  currentUser = null,
}) => {
  return (
    <DashboardLayout userRole="admin" currentUser={currentUser}>
      <div className="mb-6">
        <Title level={4} className="m-0">
          {pageTitle}
        </Title>
      </div>
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
