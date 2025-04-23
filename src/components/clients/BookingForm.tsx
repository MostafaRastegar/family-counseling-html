import React from 'react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Typography,
} from 'antd';
import FormActions from '../ui/forms/FormActions';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

interface BookingFormProps {
  consultantName: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionPrice?: number;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  consultantName,
  sessionDate,
  sessionStartTime,
  sessionEndTime,
  sessionPrice = 250000, // Default price in Tomans
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      sessionDate,
      sessionStartTime,
      sessionEndTime,
      consultantName,
      sessionPrice,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        contactMethod: 'telegram',
        additionalParticipants: [],
        acceptTerms: false,
      }}
    >
      <Row gutter={24}>
        <Col xs={24} md={16}>
          {/* Booking details form */}
          <Card className="mb-6">
            <Title level={4}>اطلاعات جلسه مشاوره</Title>
            <Paragraph type="secondary">
              لطفاً اطلاعات مورد نیاز برای جلسه مشاوره را تکمیل کنید.
            </Paragraph>

            <Divider />

            <Form.Item
              name="topic"
              label="موضوع مشاوره"
              rules={[
                { required: true, message: 'لطفاً موضوع مشاوره را وارد کنید' },
              ]}
            >
              <Input placeholder="به طور مختصر موضوع جلسه مشاوره را وارد کنید" />
            </Form.Item>

            <Form.Item name="description" label="توضیحات (اختیاری)">
              <TextArea
                rows={4}
                placeholder="توضیحات بیشتر در مورد موضوع جلسه و انتظارات خود را بنویسید"
              />
            </Form.Item>

            <Form.Item
              name="contactMethod"
              label="روش ارتباطی"
              rules={[
                {
                  required: true,
                  message: 'لطفاً روش ارتباطی را انتخاب کنید',
                },
              ]}
            >
              <Radio.Group>
                <Radio value="telegram">تلگرام</Radio>
                <Radio value="whatsapp">واتساپ</Radio>
                <Radio value="phone">تماس تلفنی</Radio>
                <Radio value="video">تماس تصویری</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.contactMethod !== currentValues.contactMethod
              }
            >
              {({ getFieldValue }) => {
                const contactMethod = getFieldValue('contactMethod');
                return contactMethod === 'telegram' ||
                  contactMethod === 'whatsapp' ? (
                  <Form.Item
                    name="contactId"
                    label={`شناسه ${contactMethod === 'telegram' ? 'تلگرام' : 'واتساپ'}`}
                    rules={[
                      {
                        required: true,
                        message: `لطفاً شناسه ${
                          contactMethod === 'telegram' ? 'تلگرام' : 'واتساپ'
                        } خود را وارد کنید`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={`${
                        contactMethod === 'telegram'
                          ? '@username یا شماره موبایل'
                          : 'شماره موبایل با فرمت 09123456789'
                      }`}
                    />
                  </Form.Item>
                ) : contactMethod === 'phone' || contactMethod === 'video' ? (
                  <Form.Item
                    name="phoneNumber"
                    label="شماره تماس"
                    rules={[
                      {
                        required: true,
                        message: 'لطفاً شماره تماس خود را وارد کنید',
                      },
                      {
                        pattern: /^09\d{9}$/,
                        message: 'شماره تماس نامعتبر است',
                      },
                    ]}
                  >
                    <Input placeholder="شماره تماس با فرمت 09123456789" />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              name="additionalParticipants"
              label="افراد دیگر شرکت‌کننده در جلسه (اختیاری)"
            >
              <Checkbox.Group>
                <Row>
                  <Col span={24}>
                    <Checkbox value="spouse">همسر</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="child">فرزند</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="parent">والدین</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="other">سایر</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                JSON.stringify(prevValues.additionalParticipants) !==
                JSON.stringify(currentValues.additionalParticipants)
              }
            >
              {({ getFieldValue }) => {
                const additionalParticipants =
                  getFieldValue('additionalParticipants') || [];
                return additionalParticipants.includes('other') ? (
                  <Form.Item
                    name="otherParticipantDescription"
                    label="توضیح افراد دیگر"
                    rules={[
                      {
                        required: true,
                        message: 'لطفاً نسبت افراد دیگر را وارد کنید',
                      },
                    ]}
                  >
                    <Input placeholder="مانند: مشاور مدرسه، خواهر و غیره" />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>

            <Form.Item
              name="acceptTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('پذیرش قوانین و مقررات الزامی است'),
                        ),
                },
              ]}
            >
              <Checkbox>
                <Text>قوانین و مقررات را می‌پذیرم</Text>
              </Checkbox>
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          {/* Session summary card */}
          <Card>
            <Title level={4}>خلاصه جلسه</Title>
            <Divider />

            <div className="mb-4">
              <div className="mb-2 flex items-center">
                <UserOutlined className="text-blue-500 ml-2" />
                <Text strong>مشاور: </Text>
                <Text className="mr-1">{consultantName}</Text>
              </div>

              <div className="mb-2 flex items-center">
                <CalendarOutlined className="text-blue-500 ml-2" />
                <Text strong>تاریخ: </Text>
                <Text className="mr-1">{sessionDate}</Text>
              </div>

              <div className="mb-2 flex items-center">
                <ClockCircleOutlined className="text-blue-500 ml-2" />
                <Text strong>ساعت: </Text>
                <Text className="mr-1">
                  {sessionStartTime} - {sessionEndTime}
                </Text>
              </div>
            </div>

            <Divider />

            <div className="price-section">
              <div className="mb-2 flex justify-between">
                <Text>هزینه جلسه:</Text>
                <Text>{sessionPrice.toLocaleString()} تومان</Text>
              </div>

              <div className="mb-2 flex justify-between">
                <Text>مالیات بر ارزش افزوده (۹٪):</Text>
                <Text>
                  {Math.round(sessionPrice * 0.09).toLocaleString()} تومان
                </Text>
              </div>

              <Divider />

              <div className="flex justify-between">
                <Text strong>مبلغ قابل پرداخت:</Text>
                <Text strong className="text-primary-500">
                  {Math.round(sessionPrice * 1.09).toLocaleString()} تومان
                </Text>
              </div>
            </div>

            <Alert
              message="توجه"
              description="مبلغ جلسه پس از تایید رزرو از کیف پول شما کسر خواهد شد."
              type="info"
              showIcon
              className="mt-4"
            />
          </Card>
        </Col>
      </Row>

      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitText="تایید و پرداخت"
        position="center"
      />
    </Form>
  );
};

export default BookingForm;
