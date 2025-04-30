import React, { useState } from 'react';
import { CheckOutlined, FilterOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Radio,
  Rate,
  Slider,
  Space,
  Tag,
  Typography,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import SpecialtiesSelect from '../../../components/consultants/SpecialtiesSelect';

const { Panel } = Collapse;
const { Text, Title } = Typography;

export interface ConsultantFilterValues {
  specialties: string[];
  minRating: number;
  availability: string | null;
  priceRange: [number, number];
  isVerified: boolean;
  sortBy: string;
}

export const defaultFilterValues: ConsultantFilterValues = {
  specialties: [],
  minRating: 0,
  availability: null,
  priceRange: [0, 1000000],
  isVerified: false,
  sortBy: 'rating',
};

interface ConsultantSearchFilterProps {
  onFilterChange: (filters: ConsultantFilterValues) => void;
  filters: ConsultantFilterValues;
  availabilityOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  loading?: boolean;
  onReset?: () => void;
  mobile?: boolean;
}

const ConsultantSearchFilter: React.FC<ConsultantSearchFilterProps> = ({
  onFilterChange,
  filters,
  availabilityOptions = [],
  sortOptions = [],
  loading = false,
  onReset,
  mobile = false,
}) => {
  const [localFilters, setLocalFilters] =
    useState<ConsultantFilterValues>(filters);
  const [expanded, setExpanded] = useState<boolean>(!mobile);

  const defaultAvailabilityOptions = [
    { value: 'today', label: 'امروز' },
    { value: 'tomorrow', label: 'فردا' },
    { value: 'this_week', label: 'این هفته' },
    { value: 'next_week', label: 'هفته آینده' },
    { value: 'weekend', label: 'آخر هفته' },
  ];

  const defaultSortOptions = [
    { value: 'rating', label: 'بیشترین امتیاز' },
    { value: 'reviews', label: 'بیشترین نظرات' },
    { value: 'price_low', label: 'کمترین قیمت' },
    { value: 'price_high', label: 'بیشترین قیمت' },
    { value: 'availability', label: 'زودترین زمان در دسترس' },
  ];

  const actualAvailabilityOptions = availabilityOptions.length
    ? availabilityOptions
    : defaultAvailabilityOptions;

  const actualSortOptions = sortOptions.length
    ? sortOptions
    : defaultSortOptions;

  const handleSpecialtiesChange = (value: string[]) => {
    updateFilter('specialties', value);
  };

  const handleRatingChange = (value: number) => {
    updateFilter('minRating', value);
  };

  const handleAvailabilityChange = (e: RadioChangeEvent) => {
    updateFilter('availability', e.target.value);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    updateFilter('priceRange', value);
  };

  const handleVerifiedChange = (e: { target: { checked: boolean } }) => {
    updateFilter('isVerified', e.target.checked);
  };

  const handleSortChange = (e: RadioChangeEvent) => {
    updateFilter('sortBy', e.target.value);
  };

  const updateFilter = (key: keyof ConsultantFilterValues, value: any) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleReset = () => {
    setLocalFilters(defaultFilterValues);
    onFilterChange(defaultFilterValues);
    if (onReset) {
      onReset();
    }
  };

  const renderAvailabilityFilter = () => (
    <div className="filter-section">
      <Title level={5}>زمان مشاوره</Title>
      <Radio.Group
        onChange={handleAvailabilityChange}
        value={localFilters.availability}
      >
        <Space direction="vertical">
          {actualAvailabilityOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
          <Radio value={null}>همه زمان‌ها</Radio>
        </Space>
      </Radio.Group>
    </div>
  );

  const renderPriceFilter = () => (
    <div className="filter-section">
      <Title level={5}>محدوده قیمت (تومان)</Title>
      <Slider
        range
        min={0}
        max={1000000}
        step={50000}
        value={localFilters.priceRange}
        onChange={handlePriceRangeChange}
        tipFormatter={(value) => `${value?.toLocaleString()}`}
      />
      <div className="mt-2 flex justify-between">
        <Text className="text-sm">
          {localFilters.priceRange[0].toLocaleString()} تومان
        </Text>
        <Text className="text-sm">
          {localFilters.priceRange[1].toLocaleString()} تومان
        </Text>
      </div>
    </div>
  );

  const renderRatingFilter = () => (
    <div className="filter-section">
      <Title level={5}>حداقل امتیاز</Title>
      <div>
        <Rate
          allowHalf
          value={localFilters.minRating}
          onChange={handleRatingChange}
        />
        {localFilters.minRating > 0 && (
          <Tag className="mr-2">{localFilters.minRating} ستاره و بالاتر</Tag>
        )}
      </div>
    </div>
  );

  const renderVerifiedFilter = () => (
    <div className="filter-section">
      <Checkbox
        checked={localFilters.isVerified}
        onChange={handleVerifiedChange}
      >
        <Space>
          <CheckOutlined className="text-green-500" />
          <span>فقط مشاوران تایید شده</span>
        </Space>
      </Checkbox>
    </div>
  );

  const renderSortOptions = () => (
    <div className="filter-section">
      <Title level={5}>مرتب‌سازی بر اساس</Title>
      <Radio.Group onChange={handleSortChange} value={localFilters.sortBy}>
        <Space direction="vertical">
          {actualSortOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );

  const renderSpecialtiesFilter = () => (
    <div className="filter-section">
      <Title level={5}>تخصص‌ها</Title>
      <SpecialtiesSelect
        value={localFilters.specialties}
        onChange={handleSpecialtiesChange}
        maxCount={5}
        placeholder="جستجوی تخصص‌ها"
        loading={loading}
      />
    </div>
  );

  const filterContent = (
    <>
      {renderSpecialtiesFilter()}
      <Divider />
      {renderRatingFilter()}
      <Divider />
      {renderAvailabilityFilter()}
      <Divider />
      {renderPriceFilter()}
      <Divider />
      {renderVerifiedFilter()}
      <Divider />
      {renderSortOptions()}

      <div className="mt-6">
        <Button
          onClick={handleReset}
          block
          className="hover:bg-gray-50 border-gray-300 text-gray-500"
        >
          پاک کردن فیلترها
        </Button>
      </div>
    </>
  );

  return (
    <>
      {mobile ? (
        <div className="mb-4">
          <Collapse
            activeKey={expanded ? ['1'] : []}
            onChange={() => setExpanded(!expanded)}
          >
            <Panel
              header={
                <div className="flex items-center">
                  <FilterOutlined className="mr-2" />
                  <span>فیلترها و مرتب‌سازی</span>
                  {Object.values(localFilters).some(
                    (val) =>
                      (Array.isArray(val) && val.length > 0) ||
                      (typeof val === 'boolean' && val) ||
                      (typeof val === 'number' && val > 0) ||
                      (val !== null && !Array.isArray(val) && val !== 'rating'),
                  ) && (
                    <Tag className="mr-2" color="blue">
                      فیلتر فعال
                    </Tag>
                  )}
                </div>
              }
              key="1"
            >
              {filterContent}
            </Panel>
          </Collapse>
        </div>
      ) : (
        <Card className="consultant-search-filter">{filterContent}</Card>
      )}
    </>
  );
};

export default ConsultantSearchFilter;
