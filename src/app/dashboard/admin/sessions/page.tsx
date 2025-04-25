'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Modal, 
  Typography, 
  notification,
  Row,
  Col,
  Tabs,
  Badge
} from 'antd';
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
  UserOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SessionTable from '@/components/admin/SessionTable';
import DashboardBreadcrumb from '@/components/ui/DashboardBreadcrumb';
import ConfirmDialog from '@/components/ui/modals/ConfirmDialog';
import StatCard from '@/components/ui/card/StatCard';
import { consultants as mockConsultants } from '@/mocks/consultants';

const { Text } = Typography;
const { TabPane } = Tabs;

export default function AdminConsultantsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  return <></>
}