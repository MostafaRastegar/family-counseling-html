import React, { useEffect, useState } from 'react';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { specialties as mockSpecialties } from '@/mocks/specialties';

const { Text } = Typography;

interface SpecialtiesSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
  maxTagCount?: number;
  allowAdd?: boolean;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  className?: string;
  error?: string;
}

const SpecialtiesSelect: React.FC<SpecialtiesSelectProps> = ({
  value = [],
  onChange,
  maxCount = 10,
  maxTagCount = 3,
  allowAdd = true,
  placeholder = 'تخصص‌های خود را انتخاب کنید',
  disabled = false,
  loading = false,
  style,
  className = '',
  error,
}) => {
  // استفاده از state برای مدیریت لیست تخصص‌ها
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = React.useRef(null);

  // بارگذاری تخصص‌ها از منبع داده
  useEffect(() => {
    // در حالت واقعی این داده‌ها از API دریافت می‌شوند
    // اما فعلاً از داده‌های نمونه استفاده می‌کنیم
    setSpecialties(mockSpecialties);
  }, []);

  // به‌روزرسانی selectedItems هنگامی که value تغییر می‌کند
  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  // هنگامی که inputVisible فعال می‌شود، روی input فوکوس می‌کنیم
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  // فراخوانی تابع onChange هنگامی که selectedItems تغییر می‌کند
  const triggerChange = (newSelectedItems: string[]) => {
    // مقادیر تکراری را حذف می‌کنیم
    const uniqueItems = Array.from(new Set(newSelectedItems));
    setSelectedItems(uniqueItems);

    if (onChange) {
      onChange(uniqueItems);
    }
  };

  // مدیریت تغییر مقدار در Select
  const handleSelectChange = (selected: string[]) => {
    // بررسی محدودیت تعداد تخصص‌ها
    if (selected.length > maxCount) {
      // اگر از تعداد مجاز بیشتر شد، آخرین مورد را حذف می‌کنیم
      selected = selected.slice(0, maxCount);
    }

    triggerChange(selected);
  };

  // مدیریت افزودن تخصص جدید
  const handleInputConfirm = () => {
    if (inputValue && !specialties.includes(inputValue)) {
      // افزودن تخصص جدید به لیست
      const newSpecialties = [...specialties, inputValue];
      setSpecialties(newSpecialties);

      // افزودن تخصص جدید به موارد انتخاب شده
      if (selectedItems.length < maxCount) {
        triggerChange([...selectedItems, inputValue]);
      }
    }

    setInputVisible(false);
    setInputValue('');
  };

  // نمایش یا مخفی کردن input برای افزودن تخصص جدید
  const showInput = () => {
    setInputVisible(true);
  };

  // فیلتر کردن گزینه‌های Select بر اساس عبارت جستجو شده
  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  };

  // تبدیل آرایه تخصص‌ها به فرمت مورد نیاز Select
  const options = specialties.map((specialty) => ({
    label: specialty,
    value: specialty,
  }));

  return (
    <div className={`specialties-select ${className}`} style={style}>
      <Select
        mode="multiple"
        allowClear
        placeholder={placeholder}
        value={selectedItems}
        onChange={handleSelectChange}
        options={options}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip
            title={
              <div>
                {omittedValues.map((value) => (
                  <Tag key={value} className="m-1">
                    {value}
                  </Tag>
                ))}
              </div>
            }
          >
            <Tag>+{omittedValues.length} مورد دیگر</Tag>
          </Tooltip>
        )}
        filterOption={filterOption}
        disabled={disabled}
        loading={loading}
        style={{ width: '100%' }}
        tagRender={(props) => (
          <Tag
            closable={props.closable}
            onClose={props.onClose}
            className="mb-1 mr-1"
          >
            {props.label}
          </Tag>
        )}
        suffixIcon={<TagOutlined />}
        notFoundContent={
          <div className="py-2 text-center">
            <Text type="secondary">موردی یافت نشد</Text>
          </div>
        }
        dropdownRender={(menu) => (
          <>
            {menu}
            {allowAdd && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ padding: '0 8px 4px' }}>
                  {inputVisible ? (
                    <Space>
                      <Input
                        ref={inputRef}
                        type="text"
                        size="small"
                        style={{ width: 150 }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                      />
                      <Button
                        type="text"
                        size="small"
                        onClick={handleInputConfirm}
                      >
                        افزودن
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      type="text"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={showInput}
                      disabled={selectedItems.length >= maxCount}
                    >
                      افزودن تخصص جدید
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      />

      {error && <div className="text-red-500 mt-1 text-xs">{error}</div>}

      {selectedItems.length >= maxCount && (
        <div className="mt-1 text-xs text-gray-500">
          حداکثر تعداد مجاز ({maxCount} مورد) انتخاب شده است
        </div>
      )}
    </div>
  );
};

export default SpecialtiesSelect;
