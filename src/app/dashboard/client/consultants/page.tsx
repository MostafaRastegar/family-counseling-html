'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Rate,
  Row,
  Select,
  Tag,
  Typography,
} from 'antd';
import ConsultantCard from '@/components/consultants/ConsultantCard';
import ConsultantFilters from '@/components/consultants/ConsultantFilters';
import { consultants } from '@/mocks/consultants';

// داده‌های نمونه

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function ConsultantsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // فیلتر کردن مشاوران بر اساس جستجو و تخصص‌ها
  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch =
      !searchQuery ||
      consultant.name.includes(searchQuery) ||
      consultant.bio.includes(searchQuery);

    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some((s) => consultant.specialties.includes(s));

    return matchesSearch && matchesSpecialties;
  });

  return (
    <div className="container mx-auto">
      <Title level={2}>یافتن مشاور</Title>
      <Paragraph className="mb-8 text-gray-500">
        از بین مشاوران متخصص ما، فردی که متناسب با نیازهای شماست را انتخاب کنید.
      </Paragraph>

      {/* جستجو و فیلترها */}
      <Card className="mb-8">
        <div className="mb-4">
          <Input
            placeholder="جستجوی نام مشاور یا تخصص"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
          />
        </div>

        <Button
          type="link"
          icon={<FilterOutlined />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'پنهان کردن فیلترها' : 'نمایش فیلترها'}
        </Button>

        {showFilters && (
          <ConsultantFilters
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
          />
        )}
      </Card>

      {/* لیست مشاوران */}
      {filteredConsultants.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredConsultants.map((consultant) => (
            <Col xs={24} md={12} lg={8} key={consultant.id}>
              <ConsultantCard consultant={consultant} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="هیچ مشاوری با معیارهای جستجوی شما یافت نشد."
          className="my-16"
        />
      )}
    </div>
  );
}
