'use client';

import { useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Space,
  Steps,
  Typography,
  message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

const BookingForm = ({ consultant, selectedTimeSlot }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    timeSlot: selectedTimeSlot,
    sessionType: 'video',
    notes: '',
  });
  const [form] = Form.useForm();

  // مرحله بعدی
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // مرحله قبلی
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // انتخاب زمان جلسه
  const handleSelectTimeSlot = (timeSlot) => {
    setBookingDetails({
      ...bookingDetails,
      timeSlot,
    });
  };

  // تکمیل فرم اطلاعات جلسه
  const handleSessionInfoComplete = (values) => {
    setBookingDetails({
      ...bookingDetails,
      ...values,
    });
    nextStep();
  };

  // پرداخت و نهایی کردن رزرو
  const handlePayment = () => {
    setLoading(true);

    // شبیه‌سازی پرداخت و ثبت نهایی رزرو
    setTimeout(() => {
      setLoading(false);
      setBookingComplete(true);
      message.success('جلسه مشاوره با موفقیت رزرو شد!');
      nextStep();
    }, 2000);
  };

  // شروع دوباره فرآیند رزرو
  const handleBookAgain = () => {
    setCurrentStep(0);
    setBookingComplete(false);
    setBookingDetails({
      timeSlot: null,
      sessionType: 'video',
      notes: '',
    });
    form.resetFields();
  };

  // نمایش مرحله فعلی
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={4}>انتخاب زمان جلسه</Title>
            <Paragraph className="mb-4 text-gray-500">
              لطفاً زمان مورد نظر خود را برای جلسه مشاوره انتخاب کنید.
            </Paragraph>

            <div className="mb-4">
              {bookingDetails.timeSlot ? (
                <Alert
                  message="زمان انتخاب شده"
                  description={
                    <div>
                      <div>تاریخ: {bookingDetails.timeSlot.date}</div>
                      <div>ساعت: {bookingDetails.timeSlot.time}</div>
                      <div>مدت جلسه: 60 دقیقه</div>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message="لطفاً یک زمان را از تقویم انتخاب کنید"
                  type="info"
                  showIcon
                />
              )}
            </div>

            <div className="text-left">
              <Button
                type="primary"
                onClick={nextStep}
                disabled={!bookingDetails.timeSlot}
              >
                ادامه
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={4}>اطلاعات جلسه</Title>
            <Paragraph className="mb-4 text-gray-500">
              لطفاً اطلاعات تکمیلی جلسه مشاوره را وارد کنید.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                sessionType: bookingDetails.sessionType,
                notes: bookingDetails.notes,
              }}
              onFinish={handleSessionInfoComplete}
            >
              <Form.Item
                name="sessionType"
                label="نوع جلسه"
                rules={[
                  { required: true, message: 'لطفاً نوع جلسه را انتخاب کنید' },
                ]}
              >
                <Radio.Group>
                  <Radio value="video">ویدیو کنفرانس</Radio>
                  <Radio value="voice">تماس صوتی</Radio>
                  <Radio value="text">گفتگوی متنی</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="notes"
                label="توضیحات (اختیاری)"
                help="توضیحات شما درباره موضوع جلسه و مشکلی که نیاز به مشاوره دارید"
              >
                <TextArea
                  rows={4}
                  placeholder="لطفاً توضیحات خود را وارد کنید"
                />
              </Form.Item>

              <Form.Item className="mb-0 text-left">
                <Space>
                  <Button onClick={prevStep}>مرحله قبل</Button>
                  <Button type="primary" htmlType="submit">
                    ادامه
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        );

      case 2:
        return (
          <div>
            <Title level={4}>بررسی و پرداخت</Title>
            <Paragraph className="mb-4 text-gray-500">
              لطفاً اطلاعات جلسه را بررسی کرده و نسبت به پرداخت هزینه اقدام
              کنید.
            </Paragraph>

            <Card className="mb-4">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>مشاور:</Text>
                </Col>
                <Col span={12}>
                  <Text>{consultant.name}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>تاریخ:</Text>
                </Col>
                <Col span={12}>
                  <Text>{bookingDetails.timeSlot?.date}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>ساعت:</Text>
                </Col>
                <Col span={12}>
                  <Text>{bookingDetails.timeSlot?.time}</Text>
                </Col>

                <Col span={12}>
                  <Text strong>مدت جلسه:</Text>
                </Col>
                <Col span={12}>
                  <Text>60 دقیقه</Text>
                </Col>

                <Col span={12}>
                  <Text strong>نوع جلسه:</Text>
                </Col>
                <Col span={12}>
                  <Text>
                    {bookingDetails.sessionType === 'video'
                      ? 'ویدیو کنفرانس'
                      : bookingDetails.sessionType === 'voice'
                        ? 'تماس صوتی'
                        : 'گفتگوی متنی'}
                  </Text>
                </Col>
              </Row>

              {bookingDetails.notes && (
                <>
                  <Divider />
                  <div>
                    <Text strong>توضیحات:</Text>
                    <Paragraph>{bookingDetails.notes}</Paragraph>
                  </div>
                </>
              )}
            </Card>

            <Card className="mb-4">
              <div className="mb-2 flex justify-between">
                <Text>هزینه جلسه (60 دقیقه):</Text>
                <Text>500,000 تومان</Text>
              </div>
              <div className="mb-2 flex justify-between">
                <Text>مالیات بر ارزش افزوده (9%):</Text>
                <Text>45,000 تومان</Text>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text strong>مبلغ قابل پرداخت:</Text>
                <Text strong className="text-lg">
                  545,000 تومان
                </Text>
              </div>
            </Card>

            <div className="bg-yellow-50 mb-4 rounded p-4">
              <Space>
                <InfoCircleOutlined className="text-yellow-500" />
                <Text>
                  پس از پرداخت، اطلاعات تکمیلی جلسه به ایمیل شما ارسال خواهد شد.
                </Text>
              </Space>
            </div>

            <div className="text-left">
              <Space>
                <Button onClick={prevStep}>مرحله قبل</Button>
                <Button
                  type="primary"
                  icon={<CreditCardOutlined />}
                  onClick={handlePayment}
                  loading={loading}
                >
                  پرداخت و نهایی کردن رزرو
                </Button>
              </Space>
            </div>
          </div>
        );

      case 3:
        return (
          <Result
            status="success"
            title="جلسه مشاوره با موفقیت رزرو شد!"
            subTitle={`شماره سفارش: 2023042600123 - تاریخ جلسه: ${bookingDetails.timeSlot?.date}`}
            extra={[
              <Button
                type="primary"
                key="dashboard"
                onClick={() =>
                  (window.location.href = '/dashboard/client/sessions')
                }
              >
                مشاهده جلسات من
              </Button>,
              <Button key="book-again" onClick={handleBookAgain}>
                رزرو جلسه جدید
              </Button>,
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <Steps current={currentStep} className="mb-8">
        <Step title="انتخاب زمان" icon={<CalendarOutlined />} />
        <Step title="اطلاعات جلسه" icon={<UserOutlined />} />
        <Step title="پرداخت" icon={<CreditCardOutlined />} />
        <Step title="تأیید" icon={<CheckCircleOutlined />} />
      </Steps>

      {renderCurrentStep()}
    </Card>
  );
};

export default BookingForm;
