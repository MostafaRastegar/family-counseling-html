'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOutlined,
  EnvironmentOutlined,
  MailOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SendOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
  Steps,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

// سوالات متداول
const faqs = [
  {
    key: '1',
    question: 'چگونه می‌توانم یک جلسه مشاوره رزرو کنم؟',
    answer:
      'برای رزرو جلسه مشاوره، ابتدا باید در سایت ثبت‌نام کنید. سپس به بخش «مشاوران» بروید و مشاور مورد نظر خود را انتخاب کنید. در صفحه مشاور، می‌توانید زمان‌های در دسترس را مشاهده و یک زمان مناسب را انتخاب کنید. پس از انتخاب زمان، به صفحه پرداخت هدایت می‌شوید و با پرداخت هزینه، جلسه شما رزرو می‌شود.',
    category: 'general',
  },
  {
    key: '2',
    question: 'آیا می‌توانم جلسه مشاوره‌ای که رزرو کرده‌ام را لغو کنم؟',
    answer:
      'بله، می‌توانید جلسه خود را لغو کنید. برای این کار، به بخش «جلسات من» در داشبورد خود بروید و جلسه مورد نظر را پیدا کنید. با کلیک بر روی گزینه «لغو جلسه»، می‌توانید جلسه را لغو کنید. توجه داشته باشید که لغو جلسه کمتر از ۲۴ ساعت قبل از زمان شروع، ممکن است مشمول جریمه شود.',
    category: 'sessions',
  },
  {
    key: '3',
    question: 'پلتفرم‌های برگزاری جلسات آنلاین چیست؟',
    answer:
      'جلسات مشاوره می‌توانند از طریق ویدیو کنفرانس، تماس صوتی یا گفتگوی متنی برگزار شوند. برای جلسات ویدیویی و صوتی، ما از پلتفرم‌های استاندارد مانند زوم، اسکایپ یا گوگل میت استفاده می‌کنیم. برای گفتگوی متنی، می‌توانید از پیام‌رسان‌هایی مانند تلگرام یا واتس‌اپ استفاده کنید. مشاور شما پیش از جلسه، لینک یا اطلاعات لازم برای اتصال را برای شما ارسال خواهد کرد.',
    category: 'technical',
  },
  {
    key: '4',
    question: 'چگونه می‌توانم مشاور مناسب برای نیازهای خود پیدا کنم؟',
    answer:
      'در صفحه «مشاوران»، می‌توانید با استفاده از فیلترهای موجود، مشاوران را بر اساس تخصص، امتیاز و دسترس‌پذیری فیلتر کنید. همچنین می‌توانید پروفایل هر مشاور را بررسی کنید تا اطلاعات بیشتری درباره تخصص‌ها، سوابق و نظرات سایر مراجعان درباره او بدست آورید. اگر هنوز مطمئن نیستید، می‌توانید با پشتیبانی تماس بگیرید تا شما را در انتخاب مشاور مناسب راهنمایی کنند.',
    category: 'consultants',
  },
  {
    key: '5',
    question: 'هزینه جلسات مشاوره چقدر است؟',
    answer:
      'هزینه جلسات مشاوره بسته به تخصص، تجربه و رتبه مشاور متفاوت است. هر مشاور نرخ ساعتی خود را تعیین می‌کند که در پروفایل او قابل مشاهده است. به طور معمول، هزینه یک جلسه ۶۰ دقیقه‌ای بین ۳۰۰,۰۰۰ تا ۸۰۰,۰۰۰ تومان متغیر است. قبل از نهایی کردن رزرو، هزینه دقیق جلسه به شما نمایش داده می‌شود.',
    category: 'payment',
  },
  {
    key: '6',
    question: 'آیا اطلاعات و محتوای جلسات مشاوره محرمانه باقی می‌ماند؟',
    answer:
      'بله، حفظ حریم خصوصی و محرمانگی اطلاعات شما برای ما بسیار مهم است. تمام اطلاعات شخصی و محتوای گفتگوهای شما با مشاور کاملاً محرمانه باقی می‌ماند. مشاوران ما متعهد به رعایت اصول اخلاقی و حرفه‌ای در زمینه محرمانگی هستند. اطلاعات شما تنها در صورت الزام قانونی یا خطر جدی برای خود یا دیگران، ممکن است با مراجع ذی‌صلاح به اشتراک گذاشته شود.',
    category: 'privacy',
  },
  {
    key: '7',
    question: 'چگونه می‌توانم مشاور شوم؟',
    answer:
      'برای پیوستن به تیم مشاوران ما، ابتدا باید در سایت ثبت‌نام کنید و یک حساب کاربری ایجاد کنید. سپس به بخش «ثبت‌نام مشاور» بروید و اطلاعات تخصصی خود شامل مدارک تحصیلی، سوابق کاری، تخصص‌ها و شماره پروانه مشاوره (در صورت وجود) را ارائه دهید. درخواست شما توسط تیم ما بررسی می‌شود و در صورت تأیید، می‌توانید فعالیت خود را به عنوان مشاور آغاز کنید.',
    category: 'consultants',
  },
];
export default function Support() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // فیلتر کردن سوالات متداول
  const filteredFaqs = faqs.filter((faq) => {
    // فیلتر بر اساس متن جستجو
    const matchesSearch =
      !searchText ||
      faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchText.toLowerCase());
    // فیلتر بر اساس دسته‌بندی
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  // ارسال تیکت پشتیبانی
  const handleSubmitTicket = (values) => {
    setLoading(true);
    // شبیه‌سازی ارسال به سرور
    setTimeout(() => {
      console.log('Ticket values:', values);
      message.success(
        'تیکت شما با موفقیت ثبت شد. کارشناسان ما در اسرع وقت پاسخگوی شما خواهند بود.',
      );
      ticketForm.resetFields();
      setLoading(false);
    }, 1500);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Title level={2}>پشتیبانی و راهنما</Title>
        <Paragraph className="mx-auto max-w-2xl text-gray-500">
          در این بخش می‌توانید پاسخ سوالات متداول خود را بیابید، راهنمای استفاده
          از سیستم را مطالعه کنید، یا با تیم پشتیبانی ما در تماس باشید.
        </Paragraph>
      </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined />
              سوالات متداول
            </span>
          }
          key="faq"
        >
          <Card>
            <div className="mb-6">
              <Input
                placeholder="جستجو در سوالات متداول..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </div>

            <div className="mb-6">
              <Space wrap>
                <span>دسته‌بندی:</span>
                <Select
                  defaultValue="all"
                  onChange={setSelectedCategory}
                  style={{ width: 150 }}
                >
                  <Option value="all">همه</Option>
                  <Option value="general">عمومی</Option>
                  <Option value="sessions">جلسات</Option>
                  <Option value="consultants">مشاوران</Option>
                  <Option value="technical">فنی</Option>
                  <Option value="payment">پرداخت</Option>
                  <Option value="privacy">حریم خصوصی</Option>
                </Select>
              </Space>
            </div>

            {filteredFaqs.length > 0 ? (
              <Collapse accordion>
                {filteredFaqs.map((faq) => (
                  <Panel header={faq.question} key={faq.key}>
                    <Paragraph>{faq.answer}</Paragraph>
                    <div className="mt-2">
                      <Tag color="blue">{faq.category}</Tag>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <div className="py-6 text-center">
                <Text type="secondary">
                  هیچ نتیجه‌ای یافت نشد. لطفاً جستجوی خود را تغییر دهید.
                </Text>
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BookOutlined />
              راهنما
            </span>
          }
          key="guides"
        >
          <Card>
            <Title level={4}>راهنمای استفاده از سامانه مشاوره خانواده</Title>

            <div className="my-6">
              <Title level={5}>فرآیند رزرو جلسه مشاوره</Title>
              <Steps direction="vertical" current={-1}>
                <Step
                  title="ثبت‌نام و ورود"
                  description="در صورتی که حساب کاربری ندارید، ابتدا ثبت‌نام کنید و سپس وارد حساب خود شوید."
                />
                <Step
                  title="انتخاب مشاور"
                  description="از بین مشاوران متخصص، فردی که متناسب با نیازهای شماست را انتخاب کنید."
                />
                <Step
                  title="انتخاب زمان جلسه"
                  description="از بین زمان‌های در دسترس مشاور، زمان مناسب خود را انتخاب کنید."
                />
                <Step
                  title="پرداخت هزینه"
                  description="هزینه جلسه را به صورت آنلاین پرداخت کنید."
                />
                <Step
                  title="حضور در جلسه"
                  description="در زمان مقرر، با استفاده از لینک یا اطلاعاتی که برای شما ارسال می‌شود، در جلسه حاضر شوید."
                />
                <Step
                  title="ثبت نظر"
                  description="پس از پایان جلسه، نظر و امتیاز خود را ثبت کنید تا به بهبود خدمات کمک کنید."
                />
              </Steps>
            </div>

            <Divider />

            <div className="my-6">
              <Title level={5}>راهنمای مشاوران</Title>
              <Collapse accordion>
                <Panel header="نحوه تنظیم زمان‌های دردسترس" key="1">
                  <ol className="list-inside list-decimal space-y-2">
                    <li>به داشبورد مشاور خود بروید.</li>
                    <li>بر روی گزینه «زمان‌های دردسترس» کلیک کنید.</li>
                    <li>با استفاده از تقویم، روز مورد نظر را انتخاب کنید.</li>
                    <li>بر روی دکمه «افزودن زمان جدید» کلیک کنید.</li>
                    <li>ساعت شروع و پایان را تعیین کنید.</li>
                    <li>بر روی دکمه «ذخیره» کلیک کنید.</li>
                  </ol>
                </Panel>
                <Panel header="نحوه مدیریت جلسات" key="2">
                  <ol className="list-inside list-decimal space-y-2">
                    <li>به داشبورد مشاور خود بروید.</li>
                    <li>بر روی گزینه «جلسات» کلیک کنید.</li>
                    <li>
                      جلسات آینده، برگزار شده و لغو شده را می‌توانید مشاهده
                      کنید.
                    </li>
                    <li>
                      برای هر جلسه می‌توانید وضعیت را تغییر دهید، یادداشت اضافه
                      کنید یا به مراجع پیام ارسال کنید.
                    </li>
                  </ol>
                </Panel>
                <Panel header="نحوه دریافت درآمد" key="3">
                  <ol className="list-inside list-decimal space-y-2">
                    <li>به داشبورد مشاور خود بروید.</li>
                    <li>بر روی گزینه «مدیریت درآمد» کلیک کنید.</li>
                    <li>
                      در این بخش می‌توانید موجودی قابل برداشت، تراکنش‌ها و
                      گزارش‌های مالی خود را مشاهده کنید.
                    </li>
                    <li>
                      برای برداشت وجه، بر روی دکمه «درخواست برداشت» کلیک کنید.
                    </li>
                    <li>
                      اطلاعات حساب بانکی خود را تکمیل کنید و درخواست را ثبت
                      نمایید.
                    </li>
                    <li>
                      درخواست برداشت شما طی 2 تا 3 روز کاری پردازش خواهد شد.
                    </li>
                  </ol>
                </Panel>
              </Collapse>
            </div>

            <Divider />

            <div className="my-6">
              <Title level={5}>مشاهده ویدیوهای آموزشی</Title>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card hoverable>
                  <div className="mb-2 flex h-40 items-center justify-center rounded bg-gray-200">
                    <PlayCircleOutlined
                      style={{ fontSize: 48, color: '#1890ff' }}
                    />
                  </div>
                  <Title level={5}>آموزش ثبت‌نام و ورود</Title>
                  <Text type="secondary">مدت زمان: 3 دقیقه</Text>
                </Card>

                <Card hoverable>
                  <div className="mb-2 flex h-40 items-center justify-center rounded bg-gray-200">
                    <PlayCircleOutlined
                      style={{ fontSize: 48, color: '#1890ff' }}
                    />
                  </div>
                  <Title level={5}>آموزش رزرو جلسه مشاوره</Title>
                  <Text type="secondary">مدت زمان: 5 دقیقه</Text>
                </Card>

                <Card hoverable>
                  <div className="mb-2 flex h-40 items-center justify-center rounded bg-gray-200">
                    <PlayCircleOutlined
                      style={{ fontSize: 48, color: '#1890ff' }}
                    />
                  </div>
                  <Title level={5}>آموزش استفاده از پلتفرم‌های آنلاین</Title>
                  <Text type="secondary">مدت زمان: 7 دقیقه</Text>
                </Card>
              </div>
            </div>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MessageOutlined />
              ارسال تیکت
            </span>
          }
          key="ticket"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Card>
                <Title level={4}>ارسال تیکت پشتیبانی</Title>
                <Paragraph className="mb-6 text-gray-500">
                  اگر پاسخ سوال خود را در بخش سوالات متداول نیافتید، می‌توانید
                  از طریق فرم زیر با ما در تماس باشید. کارشناسان ما در اسرع وقت
                  پاسخگوی شما خواهند بود.
                </Paragraph>

                <Form
                  form={ticketForm}
                  layout="vertical"
                  onFinish={handleSubmitTicket}
                >
                  <Form.Item
                    name="name"
                    label="نام و نام خانوادگی"
                    rules={[
                      { required: true, message: 'لطفاً نام خود را وارد کنید' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="نام و نام خانوادگی خود را وارد کنید"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="ایمیل"
                    rules={[
                      {
                        required: true,
                        message: 'لطفاً ایمیل خود را وارد کنید',
                      },
                      { type: 'email', message: 'ایمیل وارد شده معتبر نیست' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="موضوع"
                    rules={[
                      { required: true, message: 'لطفاً موضوع را وارد کنید' },
                    ]}
                  >
                    <Input placeholder="موضوع پیام خود را وارد کنید" />
                  </Form.Item>

                  <Form.Item
                    name="category"
                    label="دسته‌بندی"
                    rules={[
                      {
                        required: true,
                        message: 'لطفاً دسته‌بندی را انتخاب کنید',
                      },
                    ]}
                  >
                    <Select placeholder="دسته‌بندی مناسب را انتخاب کنید">
                      <Option value="technical">مشکلات فنی</Option>
                      <Option value="account">حساب کاربری</Option>
                      <Option value="payment">پرداخت و مالی</Option>
                      <Option value="sessions">جلسات مشاوره</Option>
                      <Option value="other">سایر موارد</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="متن پیام"
                    rules={[
                      {
                        required: true,
                        message: 'لطفاً متن پیام خود را وارد کنید',
                      },
                    ]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="توضیحات خود را اینجا بنویسید..."
                    />
                  </Form.Item>

                  <Form.Item name="attachment" label="پیوست (اختیاری)">
                    <Upload
                      maxCount={1}
                      beforeUpload={() => false} // جلوگیری از آپلود خودکار
                    >
                      <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
                    </Upload>
                    <Text type="secondary" className="mt-1 block">
                      حداکثر حجم فایل: 5MB - فرمت‌های مجاز: PDF, JPG, PNG
                    </Text>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SendOutlined />}
                      loading={loading}
                      size="large"
                    >
                      ارسال تیکت
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card>
                <Title level={4}>تماس با ما</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      title: 'شماره تماس',
                      description: '021-12345678',
                      icon: <PhoneOutlined className="text-blue-500" />,
                    },
                    {
                      title: 'ایمیل پشتیبانی',
                      description: 'support@familycounseling.com',
                      icon: <MailOutlined className="text-blue-500" />,
                    },
                    {
                      title: 'آدرس',
                      description: 'تهران، خیابان مثال، پلاک 123',
                      icon: <EnvironmentOutlined className="text-blue-500" />,
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar icon={item.icon} className="bg-blue-50" />
                        }
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />

                <Divider />

                <Title level={5}>ساعات پاسخگویی</Title>
                <Paragraph>
                  شنبه تا چهارشنبه: ۹ صبح تا ۵ بعدازظهر
                  <br />
                  پنجشنبه: ۹ صبح تا ۱ بعدازظهر
                  <br />
                  جمعه: تعطیل
                </Paragraph>

                <Divider />

                <Title level={5}>زمان پاسخگویی</Title>
                <Paragraph>
                  معمولاً به تیکت‌های پشتیبانی در کمتر از ۲۴ ساعت کاری پاسخ
                  می‌دهیم. برای مسائل فوری، لطفاً با شماره تماس ما تماس بگیرید.
                </Paragraph>
              </Card>

              <Card className="mt-4">
                <Title level={4}>تیکت‌های اخیر</Title>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      id: 'T-12345',
                      subject: 'مشکل در پرداخت',
                      date: '1404/02/15',
                      status: 'open',
                    },
                    {
                      id: 'T-12340',
                      subject: 'سوال درباره نحوه رزرو',
                      date: '1404/02/10',
                      status: 'closed',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Link key="view" href={`#ticket-${item.id}`}>
                          <Button type="link" size="small">
                            مشاهده
                          </Button>
                        </Link>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <span>{item.subject}</span>
                            <Tag
                              color={
                                item.status === 'open' ? 'green' : 'default'
                              }
                            >
                              {item.status === 'open' ? 'باز' : 'بسته شده'}
                            </Tag>
                          </Space>
                        }
                        description={`شماره تیکت: ${item.id} - تاریخ: ${item.date}`}
                      />
                    </List.Item>
                  )}
                />
                <div className="mt-4 text-center">
                  <Button type="link">مشاهده همه تیکت‌ها</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
