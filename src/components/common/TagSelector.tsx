'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { CloseOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space, Tag, Tooltip, Typography } from 'antd';

const { Text } = Typography;
const { Option } = Select;

export interface TagOption {
  value: string;
  label: string;
  color?: string;
  disabled?: boolean;
}

export interface TagSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: TagOption[];
  maxTags?: number;
  minTags?: number;
  allowCustom?: boolean;
  customValidator?: (value: string) => { valid: boolean; message?: string };
  placeholder?: string;
  tagPlaceholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  tagRender?: (tag: TagOption, onClose: () => void) => ReactNode;
  className?: string;
  mode?: 'default' | 'compact' | 'inline';
  size?: 'small' | 'middle' | 'large';
  colors?: string[];
  showColorPicker?: boolean;
  onExceed?: () => void;
  error?: string;
  warning?: string;
  help?: string | ReactNode;
  label?: string | ReactNode;
  required?: boolean;
  layout?: 'horizontal' | 'vertical';
  sortable?: boolean;
  removeIcon?: ReactNode;
  addText?: string;
  noOptionsText?: string;
  maxLength?: number;
}

/**
 * TagSelector - A component for selecting and managing tags
 *
 * This component provides a user-friendly interface for selecting predefined tags
 * or creating custom ones, with various customization options.
 */
const TagSelector: React.FC<TagSelectorProps> = ({
  value = [],
  onChange,
  options = [],
  maxTags,
  minTags,
  allowCustom = true,
  customValidator,
  placeholder = 'انتخاب یا افزودن تگ',
  tagPlaceholder = 'افزودن تگ جدید',
  disabled = false,
  readonly = false,
  tagRender,
  className = '',
  mode = 'default',
  size = 'middle',
  colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ],
  showColorPicker = false,
  onExceed,
  error,
  warning,
  help,
  label,
  required = false,
  layout = 'horizontal',
  sortable = false,
  removeIcon,
  addText = 'افزودن',
  noOptionsText = 'موردی یافت نشد',
  maxLength,
}) => {
  // State for new tag input
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [inputRef, setInputRef] = useState<Input | null>(null);
  const [selectRef, setSelectRef] = useState<HTMLElement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Focus on input when it becomes visible
  useEffect(() => {
    if (inputVisible) {
      inputRef?.focus();
    }
  }, [inputVisible, inputRef]);

  // Focus on select when it's rendered
  useEffect(() => {
    if (selectRef) {
      selectRef.focus();
    }
  }, [selectRef]);

  // Get all available options with color
  const getTagOptions = () => {
    return options.map((option) => ({
      ...option,
      color: option.color || selectedColor,
    }));
  };

  // Get available options that haven't been selected yet
  const getAvailableOptions = () => {
    return getTagOptions().filter((option) => !value.includes(option.value));
  };

  // Find an option by its value
  const findOption = (tagValue: string) => {
    return getTagOptions().find((option) => option.value === tagValue);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle input confirmation
  const handleInputConfirm = () => {
    if (inputValue && inputValue.trim() !== '') {
      // Check if we're at max tags
      if (maxTags && value.length >= maxTags) {
        onExceed?.();
        return;
      }

      // Validate custom tag if validator provided
      if (customValidator) {
        const result = customValidator(inputValue);
        if (!result.valid) {
          // Could show an error message here
          return;
        }
      }

      // If we're editing an existing tag
      if (editingIndex !== null) {
        const newTags = [...value];
        newTags[editingIndex] = inputValue;
        onChange?.(newTags);
        setEditingIndex(null);
      } else {
        // Add new tag if it doesn't exist
        if (!value.includes(inputValue)) {
          onChange?.([...value, inputValue]);
        }
      }
    }

    setInputVisible(false);
    setInputValue('');
  };

  // Handle tag removal
  const handleTagClose = (removedTag: string) => {
    const newTags = value.filter((tag) => tag !== removedTag);
    onChange?.(newTags);
  };

  // Handle tag edit
  const handleTagEdit = (tagValue: string, index: number) => {
    if (!readonly && !disabled) {
      setEditingIndex(index);
      setInputValue(tagValue);
      setInputVisible(true);
    }
  };

  // Show input for adding new tag
  const showInput = () => {
    setInputVisible(true);
  };

  // Handle selecting an option from dropdown
  const handleOptionSelect = (optionValue: string) => {
    if (maxTags && value.length >= maxTags) {
      onExceed?.();
      return;
    }

    if (!value.includes(optionValue)) {
      onChange?.([...value, optionValue]);
    }
  };

  // Calculate tag size based on component size
  const getTagSize = () => {
    switch (size) {
      case 'large':
        return 'default';
      case 'small':
        return 'small';
      default:
        return 'default';
    }
  };

  // Render a tag with color and close button
  const renderTag = (tagValue: string, index: number) => {
    const option = findOption(tagValue);
    const tagColor = option?.color || colors[index % colors.length];

    if (tagRender) {
      return tagRender(
        { value: tagValue, label: option?.label || tagValue, color: tagColor },
        () => handleTagClose(tagValue),
      );
    }

    return (
      <Tag
        key={tagValue}
        color={tagColor}
        closable={!readonly && !disabled}
        onClose={() => handleTagClose(tagValue)}
        style={{ margin: '2px 4px 2px 0' }}
        className={`tag-item ${mode === 'compact' ? 'px-1 py-0' : ''}`}
        closeIcon={removeIcon || <CloseOutlined />}
      >
        <span
          className={!readonly && !disabled ? 'cursor-pointer' : ''}
          onClick={() =>
            !readonly && !disabled && handleTagEdit(tagValue, index)
          }
        >
          {option?.label || tagValue}
        </span>
      </Tag>
    );
  };

  // Render add button or input field for new tag
  const renderAddInput = () => {
    if (readonly || disabled || (maxTags && value.length >= maxTags)) {
      return null;
    }

    if (inputVisible) {
      return (
        <Input
          ref={(ref) => setInputRef(ref)}
          type="text"
          size={size}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          style={{ width: mode === 'compact' ? 100 : 120 }}
          placeholder={tagPlaceholder}
          maxLength={maxLength}
        />
      );
    }

    // If we have options, show a Select
    if (options.length > 0) {
      const availableOptions = getAvailableOptions();

      if (availableOptions.length === 0 && !allowCustom) {
        return null;
      }

      return (
        <Select
          ref={(ref) => setSelectRef(ref)}
          placeholder={placeholder}
          style={{ width: mode === 'compact' ? 120 : 150 }}
          size={size}
          disabled={disabled}
          onSelect={handleOptionSelect}
          allowClear
          dropdownRender={(menu) => (
            <div>
              {menu}
              {allowCustom && (
                <>
                  <div
                    style={{ borderTop: '1px solid #e8e8e8', padding: '8px' }}
                  >
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={showInput}
                      size={size}
                    >
                      {addText}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          dropdownStyle={{ minWidth: 200 }}
          notFoundContent={noOptionsText}
        >
          {availableOptions.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              <Tag color={option.color} style={{ marginRight: 4 }}>
                {option.label}
              </Tag>
            </Option>
          ))}
        </Select>
      );
    }

    // If there are no options and custom tags are allowed, show add button
    if (allowCustom) {
      return (
        <Button
          size={size === 'large' ? 'middle' : size}
          icon={<PlusOutlined />}
          onClick={showInput}
          type="dashed"
          className={mode === 'compact' ? 'h-7 px-1' : ''}
        >
          {mode !== 'compact' && addText}
        </Button>
      );
    }

    return null;
  };

  // Main render
  const renderContent = () => {
    return (
      <>
        <div className={`tag-selector-container ${mode} ${className}`}>
          <div
            className={`tags-container ${mode === 'inline' ? 'flex flex-wrap items-center' : ''}`}
          >
            {value.map((tag, index) => (
              <span key={`${tag}-${index}`}>{renderTag(tag, index)}</span>
            ))}

            {mode === 'inline' ? (
              <span className="inline-block">{renderAddInput()}</span>
            ) : (
              <div className="mt-2">{renderAddInput()}</div>
            )}
          </div>
        </div>

        {(error || warning || help) && (
          <div className="mt-1">
            {error && <Text type="danger">{error}</Text>}
            {warning && <Text type="warning">{warning}</Text>}
            {help && (
              <div className="tag-selector-help text-gray-500">
                {typeof help === 'string' ? (
                  <Text type="secondary">{help}</Text>
                ) : (
                  help
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // If it has a label, render with label
  if (label) {
    return (
      <div className={`tag-selector-with-label ${layout}`}>
        <div
          className={`tag-selector-label ${layout === 'horizontal' ? 'mb-0 ml-2' : 'mb-1'}`}
        >
          {typeof label === 'string' ? (
            <Text strong>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Text>
          ) : (
            label
          )}
        </div>
        <div className="tag-selector-wrapper">{renderContent()}</div>
      </div>
    );
  }

  // Render without label
  return renderContent();
};

export default TagSelector;
