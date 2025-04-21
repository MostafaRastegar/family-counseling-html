'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Modal,
  Space,
  Typography,
} from 'antd';
import FormBuilder, { FormField, FormSection } from './FormBuilder';

const { Title, Text } = Typography;

export type FormModalProps = {
  /**
   * Title of the modal
   */
  title: string;
  /**
   * Subtitle or description
   */
  description?: ReactNode;
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Called when the modal is closed
   */
  onCancel: () => void;
  /**
   * Called when the form is submitted
   */
  onSubmit: (values: any) => void;
  /**
   * Submit button text
   */
  submitText?: string;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Form fields
   */
  fields?: FormField[];
  /**
   * Form sections
   */
  sections?: FormSection[];
  /**
   * Initial values for the form
   */
  initialValues?: Record<string, any>;
  /**
   * Whether the form is submitting
   */
  loading?: boolean;
  /**
   * Width of the modal
   */
  width?: number | string;
  /**
   * Whether to center the modal vertically
   */
  centered?: boolean;
  /**
   * Whether the modal can be closed by clicking the mask
   */
  maskClosable?: boolean;
  /**
   * Whether to destroy the modal when it is closed
   */
  destroyOnClose?: boolean;
  /**
   * Form layout
   */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /**
   * External form instance
   */
  form?: FormInstance;
  /**
   * Additional footer content
   */
  footer?: ReactNode;
  /**
   * Confirmation message before closing with unsaved changes
   */
  confirmCloseMessage?: string;
  /**
   * Whether to show a confirmation when closing with unsaved changes
   */
  confirmClose?: boolean;
  /**
   * Whether to disable the submit button when form is pristine
   */
  disableSubmitWhenPristine?: boolean;
  /**
   * Extra content to display before the form
   */
  beforeForm?: ReactNode;
  /**
   * Extra content to display after the form
   */
  afterForm?: ReactNode;
  /**
   * Extra buttons to display in the modal footer
   */
  extraButtons?: ReactNode;
  /**
   * Class name for the modal
   */
  className?: string;
  /**
   * Class name for the form
   */
  formClassName?: string;
  /**
   * Custom render function for the form
   */
  renderForm?: (formInstance: FormInstance) => ReactNode;
  /**
   * Custom render function for the modal footer
   */
  renderFooter?: (formInstance: FormInstance) => ReactNode;
  /**
   * Called when the form field values change
   */
  onValuesChange?: (changedValues: any, allValues: any) => void;
  /**
   * Whether to show a divider between the form and the footer
   */
  showFooterDivider?: boolean;
  /**
   * Form columns layout
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
};

/**
 * A reusable modal with a form inside
 */
const FormModal: React.FC<FormModalProps> = ({
  title,
  description,
  visible,
  onCancel,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  fields,
  sections,
  initialValues = {},
  loading = false,
  width = 600,
  centered = true,
  maskClosable = false,
  destroyOnClose = true,
  layout = 'vertical',
  form: externalForm,
  footer,
  confirmCloseMessage = 'You have unsaved changes. Are you sure you want to close this form?',
  confirmClose = true,
  disableSubmitWhenPristine = false,
  beforeForm,
  afterForm,
  extraButtons,
  className = '',
  formClassName = '',
  renderForm,
  renderFooter,
  onValuesChange,
  showFooterDivider = true,
  columns,
}) => {
  // Create form instance if not provided externally
  const [form] = Form.useForm(externalForm);
  const [formChanged, setFormChanged] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Reset the form when the modal becomes visible
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(initialValues);
      setFormChanged(false);
    }
  }, [visible, form, initialValues]);

  // Handle form values change to detect if the form is dirty
  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormChanged(true);
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
  };

  // Handle form submission
  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  // Handle modal cancel with confirmation if needed
  const handleCancel = () => {
    if (confirmClose && formChanged) {
      setConfirmVisible(true);
    } else {
      onCancel();
    }
  };

  // Handle confirmation dialog
  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };

  const handleConfirmOk = () => {
    setConfirmVisible(false);
    onCancel();
  };

  // Render the form or custom content
  const renderFormContent = () => {
    if (renderForm) {
      return renderForm(form);
    }

    return (
      <FormBuilder
        form={form}
        fields={fields}
        sections={sections}
        initialValues={initialValues}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        layout={layout}
        showSubmitButton={false}
        showCancelButton={false}
        withCard={false}
        className={formClassName}
        columns={columns}
      />
    );
  };

  // Render custom footer or default buttons
  const renderModalFooter = () => {
    if (renderFooter) {
      return renderFooter(form);
    }

    if (footer) {
      return footer;
    }

    return (
      <div className="modal-footer">
        <Space>
          <Button onClick={handleCancel}>{cancelText}</Button>
          {extraButtons}
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            disabled={disableSubmitWhenPristine && !formChanged}
          >
            {submitText}
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={
          <>
            <div className="modal-title">
              {typeof title === 'string' ? (
                <Title level={4}>{title}</Title>
              ) : (
                title
              )}
              {description && <Text type="secondary">{description}</Text>}
            </div>
          </>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={width}
        centered={centered}
        maskClosable={maskClosable}
        destroyOnClose={destroyOnClose}
        className={className}
      >
        {beforeForm}

        {renderFormContent()}

        {afterForm}

        {showFooterDivider && <Divider />}

        {renderModalFooter()}
      </Modal>

      {/* Confirmation modal */}
      <Modal
        title="Confirm"
        open={confirmVisible}
        onCancel={handleConfirmCancel}
        onOk={handleConfirmOk}
        okText="Yes, close"
        cancelText="No, keep editing"
      >
        <p>{confirmCloseMessage}</p>
      </Modal>
    </>
  );
};

export default FormModal;
