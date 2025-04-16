'use client';

import { useEffect, useState } from 'react';
import { Col, Divider, Row, Select } from 'antd';

const { Option } = Select;

// لیست تخصص‌های نمونه
const specialties = [
  'مشاوره خانواده',
  'روابط زناشویی',
  'فرزندپروری',
  'مشاوره تحصیلی',
  'مشاوره قبل از ازدواج',
  'مشکلات ارتباطی',
  'مدیریت استرس',
  'مشکلات رفتاری کودکان',
  'اختلافات خانوادگی',
  'مشاوره طلاق',
];

const ConsultantFilters = ({ selectedSpecialties, setSelectedSpecialties }) => {
  return (
    <div className="mt-4">
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="mb-2">تخصص‌ها:</div>
          <Select
            mode="multiple"
            placeholder="انتخاب تخصص"
            value={selectedSpecialties}
            onChange={setSelectedSpecialties}
            style={{ width: '100%' }}
            className="w-full"
          >
            {specialties.map((specialty) => (
              <Option key={specialty} value={specialty}>
                {specialty}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default ConsultantFilters;
