import React from 'react';
import { Badge, Col, Progress, Row, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface StatusData {
  key: string;
  name: string;
  value: number;
  color: string;
  percent: number;
}

interface SessionsStatusReportProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  loading?: boolean;
}

const SessionsStatusReport: React.FC<SessionsStatusReportProps> = ({
  data,
  loading = false,
}) => {
  // محاسبه کل
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  // اضافه کردن درصد به هر آیتم
  const dataWithPercent: StatusData[] = data.map(item => ({
    key: item.name,
    name: item.name,
    value: item.value,
    color: item.color,
    percent: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  // تعریف ستون‌های جدول
  const columns: ColumnsType<StatusData> = [
    {
      title: 'وضعیت',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Badge color={record.color} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'تعداد',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
    },
    {
      title: 'درصد',
      dataIndex: 'percent',
      key: 'percent',
      align: 'center',
      render: (percent) => `${percent}%`,
    },
    {
      title: 'نمودار',
      dataIndex: 'percent',
      key: 'chart',
      render: (percent, record) => (
        <Progress 
          percent={percent} 
          showInfo={false} 
          strokeColor={record.color}
        />
      ),
    },
  ];

  // اضافه کردن کل به آخر جدول
  const totalRow: StatusData = {
    key: 'total',
    name: 'مجموع',
    value: total,
    color: '#333',
    percent: 100
  };

  // نمایش ساده در قالب کارت‌ها
  return (
    <div className="sessions-status-report">
      <div className="mb-4">
        <Row gutter={[16, 16]}>
          {dataWithPercent.map((item) => (
            <Col xs={12} sm={6} key={item.key}>
              <div 
                className="text-center rounded-lg p-3 shadow-sm border"
                style={{ borderColor: item.color }}
              >
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-sm text-gray-500">{item.name}</div>
                <div 
                  className="text-xs mt-1" 
                  style={{ color: item.color }}
                >
                  {item.percent}%
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={dataWithPercent}
        pagination={false}
        size="small"
        loading={loading}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong>مجموع</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="center">
                <Text strong>{total}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                <Text strong>100%</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default SessionsStatusReport;