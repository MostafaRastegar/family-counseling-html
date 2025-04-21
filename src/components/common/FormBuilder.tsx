'use client';

import React, { ReactNode, useEffect } from 'react';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { FormInstance, Rule } from 'antd/es/form';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;

// Define all possible field types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'checkboxGroup'
  | 'radio'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'time'
  | 'timeRange'
  | 'upload'
  | 'password'
  | 'email'
  | 'tel'
  | 'custom';

// Base field interface with common properties
export interface BaseFormField {
  name: string;
  label?: string | ReactNode;
  type: FieldType;
  placeholder?: string;
  rules?: Rule[];
  required?: boolean;
  disabled?: boolean;
  help?: string | ReactNode;
  extra?: string | ReactNode;
  tooltip?: string | ReactNode;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  hidden?: boolean;
  initialValue?: any;
  dependencies?: string[];
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showWhen?: (values: any) => boolean;
}

// Field interfaces for specific types with their unique properties
export interface TextField extends BaseFormField {
  type: 'text' | 'email' | 'tel' | 'password';
  addonBefore?: string | ReactNode;
  addonAfter?: string | ReactNode;
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
  allowClear?: boolean;
  autoComplete?: string;
  maxLength?: number;
  size?: 'large' | 'middle' | 'small';
}

export interface TextAreaField extends BaseFormField {
  type: 'textarea';
  rows?: number;
  allowClear?: boolean;
  showCount?: boolean;
  maxLength?: number;
  autoSize?: boolean | { minRows: number; maxRows: number };
}

export interface NumberField extends BaseFormField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  addonBefore?: string | ReactNode;
  addonAfter?: string | ReactNode;
  controls?: boolean;
  size?: 'large' | 'middle' | 'small';
}

export interface SelectField extends BaseFormField {
  type: 'select' | 'multiselect';
  options: Array<{
    label: string | ReactNode;
    value: string | number;
    disabled?: boolean;
    children?: Array<{ label: string | ReactNode; value: string | number }>;
  }>;
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
  filterOption?: boolean | ((input: string, option: any) => boolean);
  optionFilterProp?: string;
  loading?: boolean;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  maxTagCount?: number;
  notFoundContent?: ReactNode;
}

export interface CheckboxField extends BaseFormField {
  type: 'checkbox';
  text?: string | ReactNode;
}

export interface CheckboxGroupField extends BaseFormField {
  type: 'checkboxGroup';
  options: Array<{
    label: string | ReactNode;
    value: string | number;
    disabled?: boolean;
  }>;
}

export interface RadioField extends BaseFormField {
  type: 'radio';
  options: Array<{
    label: string | ReactNode;
    value: string | number;
    disabled?: boolean;
  }>;
  buttonStyle?: 'outline' | 'solid';
  optionType?: 'default' | 'button';
}

export interface SwitchField extends BaseFormField {
  type: 'switch';
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  size?: 'default' | 'small';
}

export interface DateField extends BaseFormField {
  type: 'date' | 'dateRange';
  format?: string;
  showTime?: boolean;
  disabledDate?: RangePickerProps['disabledDate'];
  disabledTime?: any;
  showToday?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  size?: 'large' | 'middle' | 'small';
}

export interface TimeField extends BaseFormField {
  type: 'time' | 'timeRange';
  format?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  use12Hours?: boolean;
  size?: 'large' | 'middle' | 'small';
}

export interface UploadField extends BaseFormField {
  type: 'upload';
  action?: string;
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  maxCount?: number;
  multiple?: boolean;
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<any>;
  onChange?: (info: any) => void;
  buttonText?: string;
  buttonIcon?: ReactNode;
  showUploadList?:
    | boolean
    | {
        showPreviewIcon?: boolean;
        showRemoveIcon?: boolean;
        showDownloadIcon?: boolean;
      };
}

export interface CustomField extends BaseFormField {
  type: 'custom';
  render: (props: {
    field: CustomField;
    form: FormInstance;
    values: any;
  }) => ReactNode;
}

// Union type for all field types
export type FormField =
  | TextField
  | TextAreaField
  | NumberField
  | SelectField
  | CheckboxField
  | CheckboxGroupField
  | RadioField
  | SwitchField
  | DateField
  | TimeField
  | UploadField
  | CustomField;

export interface FormSection {
  title?: string | ReactNode;
  description?: string | ReactNode;
  fields: FormField[];
  className?: string;
  key?: string;
  divider?: boolean;
  showWhen?: (values: any) => boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormBuilderProps {
  form: FormInstance;
  sections?: FormSection[];
  fields?: FormField[];
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  initialValues?: Record<string, any>;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  formClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  requiredMark?: boolean | 'optional';
  scrollToFirstError?: boolean;
  submitButton?: {
    text?: string;
    icon?: ReactNode;
    position?: 'left' | 'center' | 'right';
    className?: string;
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    size?: 'large' | 'middle' | 'small';
    block?: boolean;
    loading?: boolean;
    hide?: boolean;
  };
  resetButton?: {
    text?: string;
    onClick?: () => void;
    position?: 'left' | 'center' | 'right';
    className?: string;
    hide?: boolean;
  };
  footer?: ReactNode;
  gutter?: number | [number, number];
  colon?: boolean;
  preserve?: boolean;
  validateMessages?: Record<string, any>;
  validateTrigger?: string | string[];
}

/**
 * FormBuilder - A component for building dynamic forms from configuration
 *
 * This component generates Ant Design forms based on a configuration object,
 * supporting various field types, layouts, and validations.
 */
const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  sections,
  fields,
  onFinish,
  onFinishFailed,
  onValuesChange,
  initialValues,
  layout = 'horizontal',
  labelCol = { span: 6 },
  wrapperCol = { span: 18 },
  formClassName = '',
  loading = false,
  disabled = false,
  size = 'middle',
  requiredMark = true,
  scrollToFirstError = true,
  submitButton = {
    text: 'ذخیره',
    position: 'right',
    type: 'primary',
  },
  resetButton = {
    text: 'انصراف',
    position: 'right',
    hide: true,
  },
  footer,
  gutter = [16, 16],
  colon = true,
  preserve = true,
  validateMessages,
  validateTrigger,
}) => {
  // Set initial values when they change
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // Helper function to generate field rules
  const getFieldRules = (field: FormField): Rule[] => {
    const rules: Rule[] = field.rules || [];

    // Add required rule if specified
    if (field.required) {
      rules.unshift({
        required: true,
        message: `لطفاً ${field.label || field.name} را وارد کنید`,
      });
    }

    // Add email validation if field type is email
    if (field.type === 'email') {
      rules.push({
        type: 'email',
        message: 'لطفاً یک ایمیل معتبر وارد کنید',
      });
    }

    return rules;
  };

  // Render a single form field based on its type
  const renderField = (field: FormField, formValues: any) => {
    // Check if field should be shown based on showWhen condition
    if (field.showWhen && !field.showWhen(formValues)) {
      return null;
    }

    // Mark field as hidden if specified
    if (field.hidden) {
      return (
        <Form.Item key={field.name} name={field.name} hidden>
          <Input />
        </Form.Item>
      );
    }

    // Parse label with optional tooltip
    const labelWithTooltip = field.tooltip ? (
      <span>
        {field.label}{' '}
        <Tooltip title={field.tooltip}>
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
    ) : (
      field.label
    );

    // Common Form.Item props
    const formItemProps = {
      key: field.name,
      name: field.name,
      label: labelWithTooltip,
      rules: getFieldRules(field),
      initialValue: field.initialValue,
      help: field.help,
      extra: field.extra,
      dependencies: field.dependencies,
      labelCol: field.labelCol || labelCol,
      wrapperCol: field.wrapperCol || wrapperCol,
      className: `form-item ${field.className || ''}`,
      hidden: field.hidden,
    };

    // Render different field types
    let fieldComponent: ReactNode;

    switch (field.type) {
      case 'text':
      case 'password':
      case 'email':
      case 'tel':
        const inputField = field as TextField;
        fieldComponent = (
          <Input
            placeholder={inputField.placeholder}
            disabled={disabled || inputField.disabled}
            addonBefore={inputField.addonBefore}
            addonAfter={inputField.addonAfter}
            prefix={inputField.prefix}
            suffix={inputField.suffix}
            allowClear={inputField.allowClear}
            autoComplete={inputField.autoComplete}
            maxLength={inputField.maxLength}
            size={inputField.size || size}
            type={inputField.type === 'password' ? 'password' : 'text'}
          />
        );
        break;

      case 'textarea':
        const textareaField = field as TextAreaField;
        fieldComponent = (
          <TextArea
            placeholder={textareaField.placeholder}
            disabled={disabled || textareaField.disabled}
            rows={textareaField.rows || 4}
            allowClear={textareaField.allowClear}
            showCount={textareaField.showCount}
            maxLength={textareaField.maxLength}
            autoSize={textareaField.autoSize}
          />
        );
        break;

      case 'number':
        const numberField = field as NumberField;
        fieldComponent = (
          <InputNumber
            placeholder={numberField.placeholder}
            disabled={disabled || numberField.disabled}
            min={numberField.min}
            max={numberField.max}
            step={numberField.step}
            precision={numberField.precision}
            addonBefore={numberField.addonBefore}
            addonAfter={numberField.addonAfter}
            controls={numberField.controls}
            size={numberField.size || size}
            style={{ width: '100%' }}
          />
        );
        break;

      case 'select':
      case 'multiselect':
        const selectField = field as SelectField;
        fieldComponent = (
          <Select
            placeholder={selectField.placeholder}
            disabled={disabled || selectField.disabled}
            mode={field.type === 'multiselect' ? 'multiple' : selectField.mode}
            showSearch={selectField.showSearch}
            filterOption={selectField.filterOption}
            optionFilterProp={selectField.optionFilterProp}
            loading={selectField.loading}
            allowClear={selectField.allowClear}
            size={selectField.size || size}
            maxTagCount={selectField.maxTagCount}
            notFoundContent={selectField.notFoundContent}
            style={{ width: '100%' }}
          >
            {selectField.options.map((option) =>
              option.children ? (
                <Select.OptGroup key={option.value} label={option.label}>
                  {option.children.map((child) => (
                    <Select.Option
                      key={child.value}
                      value={child.value}
                      disabled={child.disabled}
                    >
                      {child.label}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ) : (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </Select.Option>
              ),
            )}
          </Select>
        );
        break;

      case 'checkbox':
        const checkboxField = field as CheckboxField;
        fieldComponent = (
          <Checkbox disabled={disabled || checkboxField.disabled}>
            {checkboxField.text}
          </Checkbox>
        );
        break;

      case 'checkboxGroup':
        const checkboxGroupField = field as CheckboxGroupField;
        fieldComponent = (
          <CheckboxGroup
            options={checkboxGroupField.options}
            disabled={disabled || checkboxGroupField.disabled}
          />
        );
        break;

      case 'radio':
        const radioField = field as RadioField;
        fieldComponent = (
          <RadioGroup
            disabled={disabled || radioField.disabled}
            buttonStyle={radioField.buttonStyle}
            optionType={radioField.optionType}
          >
            {radioField.options.map((option) =>
              radioField.optionType === 'button' ? (
                <Radio.Button
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </Radio.Button>
              ) : (
                <Radio
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </Radio>
              ),
            )}
          </RadioGroup>
        );
        break;

      case 'switch':
        const switchField = field as SwitchField;
        fieldComponent = (
          <Switch
            disabled={disabled || switchField.disabled}
            checkedChildren={switchField.checkedChildren}
            unCheckedChildren={switchField.unCheckedChildren}
            size={switchField.size}
          />
        );
        break;

      case 'date':
        const dateField = field as DateField;
        fieldComponent = (
          <DatePicker
            placeholder={dateField.placeholder}
            disabled={disabled || dateField.disabled}
            format={dateField.format}
            showTime={dateField.showTime}
            disabledDate={dateField.disabledDate}
            disabledTime={dateField.disabledTime}
            showToday={dateField.showToday}
            picker={dateField.picker}
            size={dateField.size || size}
            style={{ width: '100%' }}
          />
        );
        break;

      case 'dateRange':
        const dateRangeField = field as DateField;
        fieldComponent = (
          <RangePicker
            placeholder={
              dateRangeField.placeholder
                ? [dateRangeField.placeholder, dateRangeField.placeholder]
                : undefined
            }
            disabled={disabled || dateRangeField.disabled}
            format={dateRangeField.format}
            showTime={dateRangeField.showTime}
            disabledDate={dateRangeField.disabledDate}
            disabledTime={dateRangeField.disabledTime}
            picker={dateRangeField.picker}
            size={dateRangeField.size || size}
            style={{ width: '100%' }}
          />
        );
        break;

      case 'time':
        const timeField = field as TimeField;
        fieldComponent = (
          <TimePicker
            placeholder={timeField.placeholder}
            disabled={disabled || timeField.disabled}
            format={timeField.format}
            hourStep={timeField.hourStep}
            minuteStep={timeField.minuteStep}
            secondStep={timeField.secondStep}
            use12Hours={timeField.use12Hours}
            size={timeField.size || size}
            style={{ width: '100%' }}
          />
        );
        break;

      case 'timeRange':
        const timeRangeField = field as TimeField;
        fieldComponent = (
          <TimePicker.RangePicker
            placeholder={
              timeRangeField.placeholder
                ? [timeRangeField.placeholder, timeRangeField.placeholder]
                : undefined
            }
            disabled={disabled || timeRangeField.disabled}
            format={timeRangeField.format}
            hourStep={timeRangeField.hourStep}
            minuteStep={timeRangeField.minuteStep}
            secondStep={timeRangeField.secondStep}
            use12Hours={timeRangeField.use12Hours}
            size={timeRangeField.size || size}
            style={{ width: '100%' }}
          />
        );
        break;

      case 'upload':
        const uploadField = field as UploadField;
        fieldComponent = (
          <Upload
            disabled={disabled || uploadField.disabled}
            action={uploadField.action}
            accept={uploadField.accept}
            listType={uploadField.listType}
            maxCount={uploadField.maxCount}
            multiple={uploadField.multiple}
            beforeUpload={uploadField.beforeUpload}
            onChange={uploadField.onChange}
            showUploadList={uploadField.showUploadList}
          >
            <Button
              icon={uploadField.buttonIcon || <UploadOutlined />}
              disabled={disabled || uploadField.disabled}
            >
              {uploadField.buttonText || 'آپلود فایل'}
            </Button>
          </Upload>
        );
        break;

      case 'custom':
        const customField = field as CustomField;
        fieldComponent = customField.render({
          field: customField,
          form,
          values: formValues,
        });
        break;

      default:
        fieldComponent = <Input />;
        break;
    }

    return <Form.Item {...formItemProps}>{fieldComponent}</Form.Item>;
  };

  // Render form sections or individual fields
  const renderFormContent = (formValues: any) => {
    // If sections are provided, render them
    if (sections && sections.length > 0) {
      return sections.map((section, index) => {
        // Skip section if showWhen condition is not met
        if (section.showWhen && !section.showWhen(formValues)) {
          return null;
        }

        return (
          <div
            key={section.key || `section-${index}`}
            className={`form-section ${section.className || ''}`}
          >
            {section.title && (
              <Title level={5} className="form-section-title mb-2">
                {section.title}
              </Title>
            )}

            {section.description && (
              <div className="form-section-description mb-4">
                {typeof section.description === 'string' ? (
                  <Text type="secondary">{section.description}</Text>
                ) : (
                  section.description
                )}
              </div>
            )}

            <Row gutter={gutter}>
              {section.fields.map((field) => {
                const colProps = field.colProps || {
                  xs: 24,
                  sm: 24,
                  md: 12,
                  lg: 12,
                };

                return (
                  <Col
                    key={field.name}
                    xs={colProps.xs}
                    sm={colProps.sm}
                    md={colProps.md}
                    lg={colProps.lg}
                    xl={colProps.xl}
                  >
                    {renderField(field, formValues)}
                  </Col>
                );
              })}
            </Row>

            {index < sections.length - 1 && section.divider !== false && (
              <Divider className="my-4" />
            )}
          </div>
        );
      });
    }

    // If individual fields are provided without sections
    if (fields && fields.length > 0) {
      return (
        <Row gutter={gutter}>
          {fields.map((field) => {
            const colProps = field.colProps || {
              xs: 24,
              sm: 24,
              md: 12,
              lg: 12,
            };

            return (
              <Col
                key={field.name}
                xs={colProps.xs}
                sm={colProps.sm}
                md={colProps.md}
                lg={colProps.lg}
                xl={colProps.xl}
              >
                {renderField(field, formValues)}
              </Col>
            );
          })}
        </Row>
      );
    }

    return null;
  };

  // Render form footer with submit and reset buttons
  const renderFooter = () => {
    if (footer) {
      return <div className="form-footer">{footer}</div>;
    }

    const submitPos = submitButton.position || 'right';
    const resetPos = resetButton.position || 'right';

    const submitBtnComponent = !submitButton.hide && (
      <Button
        type={submitButton.type || 'primary'}
        htmlType="submit"
        icon={submitButton.icon}
        loading={loading || submitButton.loading}
        size={submitButton.size || size}
        block={submitButton.block}
        className={submitButton.className}
      >
        {submitButton.text || 'ذخیره'}
      </Button>
    );

    const resetBtnComponent = !resetButton.hide && (
      <Button
        onClick={resetButton.onClick || form.resetFields}
        className={resetButton.className}
      >
        {resetButton.text || 'انصراف'}
      </Button>
    );

    return (
      <div
        className={`form-footer flex ${
          submitPos === 'center'
            ? 'justify-center'
            : submitPos === 'left'
              ? 'justify-start'
              : 'justify-end'
        }`}
      >
        <Space>
          {submitPos === 'left' && submitBtnComponent}
          {resetPos === 'left' && resetBtnComponent}

          {submitPos === 'center' && submitBtnComponent}
          {resetPos === 'center' && resetBtnComponent}

          {submitPos === 'right' && submitBtnComponent}
          {resetPos === 'right' && resetBtnComponent}
        </Space>
      </div>
    );
  };

  return (
    <Form
      form={form}
      name="dynamicForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      initialValues={initialValues}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      className={`dynamic-form ${formClassName}`}
      disabled={disabled}
      size={size}
      requiredMark={requiredMark}
      scrollToFirstError={scrollToFirstError}
      colon={colon}
      preserve={preserve}
      validateMessages={validateMessages}
      validateTrigger={validateTrigger}
    >
      <Form.Item noStyle shouldUpdate>
        {() => renderFormContent(form.getFieldsValue(true))}
      </Form.Item>

      {renderFooter()}
    </Form>
  );
};

export default FormBuilder;
