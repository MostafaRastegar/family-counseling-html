import React from 'react';
import { Badge, Col, Progress, Rate, Row, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface RatingData {
  key: string;
  name: string;
  value: number;
  rating: number;
  color: string;
  percent: number;
}

interface RatingsReportProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  loading?: boolean;
}

const RatingsReport: React.FC<RatingsReportProps> = ({
  data,
  loading = false,
}) => {
  // محاسبه کل
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  // محاسبه میانگین امتیاز
  let averageRating = 0;
  if (total > 0) {
    let weightedSum = 0;
    data.forEach((item, index) => {
      // استخراج عدد امتیاز از نام (مثلا "۱ ستاره" -> 1)
      const rating = index + 1;
      weightedSum += item.value * rating;
    });
    averageRating = weightedSum / total;
  }
  
  // اضافه کردن درصد و امتیاز به هر آیتم
  const dataWithPercent: RatingData[] = data.map((item, index) => {
    // استخراج عدد امتیاز از نام
    const rating = index + 1;
    
    return {
      key: item.name,
      name: item.name,
      value: item.value,
      rating: rating,
      color: item.color,
      percent: total > 0 ? Math.round((item.value / total) * 100) : 0
    };
  });

  // تعریف ستون‌های جدول
  const columns: ColumnsType<RatingData> = [
    {
      title: 'امتیاز',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} count={rating} />,
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

  return (
    <div className="ratings-report">
      <div className="mb-4 p-4 text-center bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-500">میانگین امتیاز</Text>
        <div className="mt-2">
          <Rate allowHalf disabled value={averageRating} />
          <div className="text-xl font-bold mt-2">{averageRating.toFixed(1)} از 5</div>
          <div className="text-xs text-gray-500 mt-1">از مجموع {total} نظر</div>
        </div>
      </div>
      
      <div className="mb-4">
        <Row gutter={[16, 16]}>
          {dataWithPercent.map((item) => (
            <Col xs={12} sm={6} md={4} key={item.key}>
              <div 
                className="text-center rounded-lg p-3 shadow-sm border"
                style={{ borderColor: item.color }}
              >
                <Rate disabled value={item.rating} count={item.rating} />
                <div className="text-lg font-bold mt-2">{item.value}</div>
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
        dataSource={dataWithPercent.reverse()} // نمایش از 5 ستاره به 1 ستاره
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

export default RatingsReport;