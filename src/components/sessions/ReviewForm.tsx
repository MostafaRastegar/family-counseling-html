import React, { useState } from 'react';
import {
  InfoCircleOutlined,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Rate,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import FormActions from '@/components/ui/forms/FormActions';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export interface ReviewFormValues {
  rating: number;
  comment: string;
  privateComment?: string;
  isAnonymous?: boolean;
}

interface ReviewFormProps {
  sessionId: string;
  consultantName: string;
  consultantImage?: string;
  sessionDate: string;
  onSubmit: (values: ReviewFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  initialValues?: Partial<ReviewFormValues>;
  allowAnonymous?: boolean;
  allowPrivateComment?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  sessionId,
  consultantName,
  consultantImage,
  sessionDate,
  onSubmit,
  onCancel,
  loading = false,
  initialValues = {
    rating: 0,
    comment: '',
    privateComment: '',
    isAnonymous: false,
  },
  allowAnonymous = true,
  allowPrivateComment = true,
}) => {
  const [form] = Form.useForm();
  const [showPreview, setShowPreview] = useState(false);
  const [privateCommentEnabled, setPrivateCommentEnabled] = useState(false);

  // Handle form submission
  const handleSubmit = (values: ReviewFormValues) => {
    // Only include private comment if enabled
    const reviewData = {
      ...values,
      privateComment: privateCommentEnabled ? values.privateComment : undefined,
    };

    onSubmit(reviewData);
  };

  // Handle preview toggle
  const handlePreviewToggle = () => {
    // Validate form before showing preview
    form
      .validateFields()
      .then(() => {
        setShowPreview(!showPreview);
      })
      .catch((error) => {
        console.log('Validation failed:', error);
      });
  };

  // Handle private comment toggle
  const handlePrivateCommentToggle = (e: CheckboxChangeEvent) => {
    setPrivateCommentEnabled(e.target.checked);
  };

  // Get rating description based on stars
  const getRatingDescription = (rating: number) => {
    switch (rating) {
      case 1:
        return 'خیلی ضعیف';
      case 2:
        return 'ضعیف';
      case 3:
        return 'متوسط';
      case 4:
        return 'خوب';
      case 5:
        return 'عالی';
      default:
        return '';
    }
  };

  // Preview component
  const renderPreview = () => {
    const formValues = form.getFieldsValue();

    return (
      <div className="review-preview">
        <Alert
          message="پیش‌نمایش نظر"
          description="این پیش‌نمایش نظر شما است که پس از ثبت برای همه قابل مشاهده خواهد بود."
          type="info"
          showIcon
          className="mb-4"
        />

        <Card className="mb-4">
          <div className="flex items-start">
            <Avatar size={40} icon={<UserOutlined />} className="ml-3" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between">
                <Text strong>
                  {formValues.isAnonymous ? 'کاربر ناشناس' : 'شما'}
                </Text>
                <Text type="secondary" className="text-xs">
                  هم‌اکنون
                </Text>
              </div>

              <div className="my-2">
                <Rate disabled value={formValues.rating} />
                <Text className="mr-2 text-sm">
                  {getRatingDescription(formValues.rating)}
                </Text>
              </div>

              <Paragraph>{formValues.comment}</Paragraph>
            </div>
          </div>
        </Card>

        {privateCommentEnabled && formValues.privateComment && (
          <Card className="border-orange-200 bg-orange-50 mb-4">
            <div className="flex items-start">
              <InfoCircleOutlined className="text-orange-500 ml-3 mt-1" />
              <div>
                <Text strong className="text-orange-700">
                  بازخورد خصوصی (فقط قابل مشاهده برای مدیران)
                </Text>
                <Paragraph className="text-orange-800 mt-2">
                  {formValues.privateComment}
                </Paragraph>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          <Button onClick={handlePreviewToggle}>بازگشت به فرم</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
          >
            ثبت نهایی نظر
          </Button>
        </div>
      </div>
    );
  };

  // Form component
  const renderForm = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <div className="mb-6">
          <Space className="mb-4">
            <Avatar
              src={consultantImage}
              icon={!consultantImage && <UserOutlined />}
              size={64}
            />
            <div>
              <Title level={5} className="mb-0">
                {consultantName}
              </Title>
              <Text type="secondary">تاریخ جلسه: {sessionDate}</Text>
            </div>
          </Space>

          <Alert
            message="ثبت نظر"
            description="نظر شما به بهبود کیفیت مشاوره کمک می‌کند و به دیگران در انتخاب مشاور مناسب یاری می‌رساند."
            type="info"
            showIcon
          />
        </div>

        <Form.Item
          name="rating"
          label="امتیاز شما به این جلسه مشاوره"
          rules={[{ required: true, message: 'لطفاً امتیاز خود را مشخص کنید' }]}
        >
          <Rate
            character={<StarFilled />}
            allowHalf={false}
            style={{ fontSize: 32 }}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.rating !== currentValues.rating
          }
        >
          {({ getFieldValue }) => {
            const rating = getFieldValue('rating');
            return rating ? (
              <div className="mb-4">
                <Text>{getRatingDescription(rating)}</Text>
              </div>
            ) : null;
          }}
        </Form.Item>

        <Form.Item
          name="comment"
          label="نظر شما"
          rules={[
            { required: true, message: 'لطفاً نظر خود را بنویسید' },
            { min: 10, message: 'نظر شما باید حداقل 10 کاراکتر باشد' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="نظر خود را درباره این جلسه مشاوره بنویسید..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        {allowAnonymous && (
          <Form.Item name="isAnonymous" valuePropName="checked">
            <Checkbox>نظر به صورت ناشناس ثبت شود</Checkbox>
          </Form.Item>
        )}

        {allowPrivateComment && (
          <>
            <Divider />

            <div className="mb-4">
              <Checkbox onChange={handlePrivateCommentToggle}>
                ارسال بازخورد خصوصی به مدیر سیستم
              </Checkbox>
              <Tooltip title="این بازخورد فقط توسط مدیران سیستم قابل مشاهده است و به مشاور نمایش داده نمی‌شود">
                <InfoCircleOutlined className="mr-1 text-gray-400" />
              </Tooltip>
            </div>

            {privateCommentEnabled && (
              <Form.Item name="privateComment">
                <TextArea
                  rows={3}
                  placeholder="بازخورد خصوصی خود را برای مدیران سیستم بنویسید..."
                  showCount
                  maxLength={300}
                />
              </Form.Item>
            )}
          </>
        )}

        <FormActions
          onCancel={onCancel}
          submitText="پیش‌نمایش و ثبت نظر"
          loading={loading}
          extraActions={
            <Button type="link" onClick={handlePreviewToggle}>
              پیش‌نمایش
            </Button>
          }
        />
      </Form>
    );
  };

  return (
    <div className="review-form">
      <Card title="ثبت نظر برای جلسه مشاوره">
        {showPreview ? renderPreview() : renderForm()}
      </Card>
    </div>
  );
};

export default ReviewForm;
