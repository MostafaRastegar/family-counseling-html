'use client';

import { useEffect, useState } from 'react';
import {
  BarChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  FallOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  LineChartOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// داده‌های نمونه برای تراکنش‌های مالی
const mockTransactions = [
  {
    id: 1,
    date: '2025-04-01',
    clientName: 'محمد رضایی',
    sessionId: 'S-12345',
    amount: 450000,
    commissionRate: 20,
    commission: 90000,
    finalAmount: 360000,
    status: 'completed',
    paidAt: '2025-04-03',
  },
  {
    id: 2,
    date: '2025-04-05',
    clientName: 'زهرا اکبری',
    sessionId: 'S-12346',
    amount: 550000,
    commissionRate: 20,
    commission: 110000,
    finalAmount: 440000,
    status: 'completed',
    paidAt: '2025-04-08',
  },
  {
    id: 3,
    date: '2025-04-10',
    clientName: 'علی محمدی',
    sessionId: 'S-12347',
    amount: 500000,
    commissionRate: 20,
    commission: 100000,
    finalAmount: 400000,
    status: 'pending',
    paidAt: null,
  },
  {
    id: 4,
    date: '2025-04-15',
    clientName: 'فاطمه حسینی',
    sessionId: 'S-12348',
    amount: 450000,
    commissionRate: 20,
    commission: 90000,
    finalAmount: 360000,
    status: 'processing',
    paidAt: null,
  },
  {
    id: 5,
    date: '2025-04-18',
    clientName: 'رضا کریمی',
    sessionId: 'S-12349',
    amount: 550000,
    commissionRate: 20,
    commission: 110000,
    finalAmount: 440000,
    status: 'cancelled',
    paidAt: null,
  },
];

// داده‌های نمونه برای درآمد ماهانه
const mockMonthlyEarnings = [
  { month: 'فروردین', income: 1200000 },
  { month: 'اردیبهشت', income: 1500000 },
  { month: 'خرداد', income: 1800000 },
  { month: 'تیر', income: 1600000 },
  { month: 'مرداد', income: 2000000 },
  { month: 'شهریور', income: 2200000 },
];

export default function ConsultantEarnings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // اعمال فیلترها
  useEffect(() => {
    if (!transactions.length) return;

    let filtered = [...transactions];

    // فیلتر بر اساس تاریخ
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');

      filtered = filtered.filter((transaction) => {
        const txDate = dayjs(transaction.date);
        return txDate.isAfter(startDate) && txDate.isBefore(endDate);
      });
    }

    // فیلتر بر اساس وضعیت
    if (statusFilter) {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter,
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, dateRange, statusFilter]);

  // محاسبه آمار درآمد
  const calculateEarningStats = () => {
    if (!filteredTransactions.length)
      return {
        totalEarnings: 0,
        pendingAmount: 0,
        completedAmount: 0,
        avgPerSession: 0,
      };

    const completed = filteredTransactions.filter(
      (tx) => tx.status === 'completed',
    );
    const pending = filteredTransactions.filter(
      (tx) => tx.status === 'pending' || tx.status === 'processing',
    );

    const totalEarnings = completed.reduce(
      (sum, tx) => sum + tx.finalAmount,
      0,
    );
    const pendingAmount = pending.reduce((sum, tx) => sum + tx.finalAmount, 0);
    const completedAmount = totalEarnings;
    const avgPerSession = completed.length
      ? totalEarnings / completed.length
      : 0;

    return {
      totalEarnings,
      pendingAmount,
      completedAmount,
      avgPerSession,
    };
  };

  const stats = calculateEarningStats();

  // ستون‌های جدول تراکنش‌ها
  const columns = [
    {
      title: 'تاریخ',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => dayjs(date).format('YYYY/MM/DD'),
    },
    {
      title: 'مراجع',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'شناسه جلسه',
      dataIndex: 'sessionId',
      key: 'sessionId',
    },
    {
      title: 'مبلغ کل (تومان)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: 'کمیسیون',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      render: (rate) => `${rate}%`,
    },
    {
      title: 'مبلغ خالص (تومان)',
      dataIndex: 'finalAmount',
      key: 'finalAmount',
      sorter: (a, b) => a.finalAmount - b.finalAmount,
      render: (amount) => amount.toLocaleString(),
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color, text;
        switch (status) {
          case 'completed':
            color = 'success';
            text = 'پرداخت شده';
            break;
          case 'pending':
            color = 'warning';
            text = 'در انتظار';
            break;
          case 'processing':
            color = 'processing';
            text = 'در حال پردازش';
            break;
          case 'cancelled':
            color = 'error';
            text = 'لغو شده';
            break;
          default:
            color = 'default';
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'تاریخ پرداخت',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (date) => (date ? dayjs(date).format('YYYY/MM/DD') : '-'),
    },
  ];

  // نمایش نمودار درآمد ماهانه
  const renderMonthlyChart = () => {
    // در این پیاده‌سازی ساده، فقط یک نمایش داده‌ای از نمودار را نشان می‌دهیم
    // در حالت واقعی، می‌توان از کتابخانه‌های نمودار مانند Recharts استفاده کرد
    return (
      <div className="bg-gray-50 rounded p-4">
        <div className="mb-4 flex justify-between">
          <Title level={5}>درآمد ماهانه - سال 1404</Title>
          <Space>
            <Button type="text" icon={<BarChartOutlined />} />
            <Button type="text" icon={<LineChartOutlined />} />
          </Space>
        </div>

        <div
          className="chart-placeholder"
          style={{ height: '200px', position: 'relative' }}
        >
          {mockMonthlyEarnings.map((item, index) => {
            const height = (item.income / 2500000) * 100; // Convert to percentage of max height
            return (
              <div
                key={index}
                className="bg-blue-500 hover:bg-blue-600 absolute cursor-pointer rounded-t-md transition-all"
                style={{
                  left: `${
                    (index / (mockMonthlyEarnings.length - 1)) * 90 + 5
                  }%`,
                  bottom: '0',
                  height: `${height}%`,
                  width: '24px',
                  transform: 'translateX(-50%)',
                }}
                title={`${item.month}: ${item.income.toLocaleString()} تومان`}
              />
            );
          })}
        </div>

        <div className="mt-2 flex justify-between">
          {mockMonthlyEarnings.map((item, index) => (
            <div
              key={index}
              className="text-center text-xs"
              style={{ width: `${100 / mockMonthlyEarnings.length}%` }}
            >
              {item.month}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <Title level={2}>مدیریت درآمد</Title>
      <Paragraph className="mb-8 text-gray-500">
        مشاهده و مدیریت درآمد، تراکنش‌ها و گزارش‌های مالی.
      </Paragraph>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              نمای کلی
            </span>
          }
          key="overview"
        >
          <Spin spinning={loading}>
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="درآمد کل"
                    value={stats.totalEarnings}
                    precision={0}
                    formatter={(value) => `${value.toLocaleString()} تومان`}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<RiseOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="در انتظار پرداخت"
                    value={stats.pendingAmount}
                    precision={0}
                    formatter={(value) => `${value.toLocaleString()} تومان`}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="پرداخت شده"
                    value={stats.completedAmount}
                    precision={0}
                    formatter={(value) => `${value.toLocaleString()} تومان`}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="میانگین هر جلسه"
                    value={stats.avgPerSession}
                    precision={0}
                    formatter={(value) => `${value.toLocaleString()} تومان`}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {renderMonthlyChart()}

            <Card title="تراکنش‌های اخیر" className="mt-6">
              <div className="mb-4 flex flex-wrap justify-between">
                <Space className="mb-2">
                  <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    allowClear={false}
                  />
                  <Select
                    placeholder="وضعیت"
                    style={{ width: 140 }}
                    onChange={setStatusFilter}
                    allowClear
                  >
                    <Option value="completed">پرداخت شده</Option>
                    <Option value="pending">در انتظار</Option>
                    <Option value="processing">در حال پردازش</Option>
                    <Option value="cancelled">لغو شده</Option>
                  </Select>
                </Space>

                <Space className="mb-2">
                  <Button icon={<DownloadOutlined />}>دانلود گزارش</Button>
                </Space>
              </div>

              <Table
                columns={columns}
                dataSource={filteredTransactions}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 'max-content' }}
              />
            </Card>
          </Spin>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileExcelOutlined />
              گزارش‌های مالی
            </span>
          }
          key="reports"
        >
          <Card>
            <Title level={4}>گزارش‌های مالی</Title>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <Title level={5}>گزارش ماهانه فروردین</Title>
                    <Text type="secondary">1404/01/01 - 1404/01/31</Text>
                  </div>
                  <FilePdfOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span>تعداد جلسات: 12</span>
                  <span>درآمد: 4,800,000 تومان</span>
                </div>
                <Button
                  className="mt-4"
                  type="primary"
                  block
                  icon={<DownloadOutlined />}
                >
                  دانلود گزارش
                </Button>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <Title level={5}>گزارش ماهانه اردیبهشت</Title>
                    <Text type="secondary">1404/02/01 - 1404/02/31</Text>
                  </div>
                  <FilePdfOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span>تعداد جلسات: 15</span>
                  <span>درآمد: 6,000,000 تومان</span>
                </div>
                <Button
                  className="mt-4"
                  type="primary"
                  block
                  icon={<DownloadOutlined />}
                >
                  دانلود گزارش
                </Button>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <Title level={5}>گزارش سه‌ماهه بهار</Title>
                    <Text type="secondary">1404/01/01 - 1404/03/31</Text>
                  </div>
                  <FilePdfOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span>تعداد جلسات: 42</span>
                  <span>درآمد: 16,800,000 تومان</span>
                </div>
                <Button
                  className="mt-4"
                  type="primary"
                  block
                  icon={<DownloadOutlined />}
                >
                  دانلود گزارش
                </Button>
              </Card>
            </div>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DollarOutlined />
              تسویه حساب
            </span>
          }
          key="withdrawal"
        >
          <Card>
            <Title level={4}>درخواست تسویه حساب</Title>

            <div className="mb-6">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card className="bg-blue-50">
                    <Statistic
                      title="موجودی قابل برداشت"
                      value={750000}
                      precision={0}
                      formatter={(value) => `${value.toLocaleString()} تومان`}
                      valueStyle={{ color: '#3f8600' }}
                    />
                    <Button type="primary" className="mt-4" block>
                      درخواست برداشت
                    </Button>
                  </Card>
                </Col>

                <Col xs={24} md={16}>
                  <Alert
                    message="اطلاعیه تسویه حساب"
                    description="درخواست‌های تسویه حساب در روزهای شنبه تا چهارشنبه پردازش می‌شوند. حداقل مبلغ قابل برداشت 500,000 تومان است. لطفاً اطلاعات حساب بانکی خود را در بخش تنظیمات به‌روز نگه دارید."
                    type="info"
                    showIcon
                  />

                  <div className="mt-4">
                    <Title level={5}>اطلاعات حساب بانکی</Title>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="نام صاحب حساب">
                        علی محمدی
                      </Descriptions.Item>
                      <Descriptions.Item label="شماره حساب">
                        1234-5678-9012-3456
                      </Descriptions.Item>
                      <Descriptions.Item label="نام بانک">
                        بانک ملت
                      </Descriptions.Item>
                      <Descriptions.Item label="شماره شبا">
                        IR123456789012345678901234
                      </Descriptions.Item>
                    </Descriptions>
                    <Button type="link" className="mt-2">
                      ویرایش اطلاعات حساب
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider orientation="left">تاریخچه برداشت‌ها</Divider>

            <Table
              columns={[
                {
                  title: 'تاریخ درخواست',
                  dataIndex: 'requestDate',
                  key: 'requestDate',
                },
                {
                  title: 'مبلغ (تومان)',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (amount) => amount.toLocaleString(),
                },
                {
                  title: 'وضعیت',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    let color, text;
                    switch (status) {
                      case 'completed':
                        color = 'success';
                        text = 'انجام شده';
                        break;
                      case 'processing':
                        color = 'processing';
                        text = 'در حال پردازش';
                        break;
                      case 'pending':
                        color = 'warning';
                        text = 'در انتظار تأیید';
                        break;
                      default:
                        color = 'default';
                        text = status;
                    }
                    return <Badge status={color} text={text} />;
                  },
                },
                {
                  title: 'تاریخ واریز',
                  dataIndex: 'paidDate',
                  key: 'paidDate',
                  render: (date) => date || '-',
                },
                {
                  title: 'توضیحات',
                  dataIndex: 'description',
                  key: 'description',
                },
              ]}
              dataSource={[
                {
                  key: '1',
                  requestDate: '1404/02/15',
                  amount: 1200000,
                  status: 'completed',
                  paidDate: '1404/02/17',
                  description: 'تسویه حساب ماهانه',
                },
                {
                  key: '2',
                  requestDate: '1404/01/18',
                  amount: 900000,
                  status: 'completed',
                  paidDate: '1404/01/20',
                  description: 'تسویه حساب ماهانه',
                },
                {
                  key: '3',
                  requestDate: '1403/12/15',
                  amount: 750000,
                  status: 'completed',
                  paidDate: '1403/12/18',
                  description: 'تسویه حساب ماهانه',
                },
              ]}
              pagination={false}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
