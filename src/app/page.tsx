'use client';

import Link from 'next/link';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Rate,
  Row,
  Typography,
} from 'antd';

const { Title, Paragraph } = Typography;

// داده‌های نمونه برای مشاوران ویژه
const featuredConsultants = [
  {
    id: 1,
    name: 'دکتر علی محمدی',
    specialties: ['مشاوره خانواده', 'روابط زناشویی'],
    bio: 'دارای 15 سال سابقه کار در زمینه مشاوره خانواده و روابط زوجین',
    rating: 4.8,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'دکتر سارا احمدی',
    specialties: ['فرزندپروری', 'مشاوره تحصیلی'],
    bio: 'متخصص در زمینه مشکلات رفتاری کودکان و نوجوانان',
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'دکتر محمد حسینی',
    specialties: ['مشاوره قبل از ازدواج', 'مهارت‌های ارتباطی'],
    bio: 'مشاور ارشد در زمینه مشاوره قبل از ازدواج و بهبود روابط',
    rating: 4.7,
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
  },
];

// داده‌های نمونه برای نظرات
const testimonials = [
  {
    id: 1,
    name: 'فاطمه رضایی',
    text: 'جلسات مشاوره با دکتر محمدی واقعاً به ما کمک کرد تا مشکلات ارتباطی خود را حل کنیم و رابطه بهتری داشته باشیم.',
    rating: 5,
  },
  {
    id: 2,
    name: 'امیر حسینی',
    text: 'برای مشکلات رفتاری فرزندم با دکتر احمدی مشورت کردم و نتایج فوق‌العاده‌ای گرفتم. بسیار ممنونم!',
    rating: 5,
  },
  {
    id: 3,
    name: 'سارا مرادی',
    text: 'مشاوره قبل از ازدواج با دکتر حسینی، به من و همسرم کمک کرد تا با دید بازتری وارد زندگی مشترک شویم.',
    rating: 4,
  },
];

export default function Home() {
  return (
    <div>
      {/* بخش هدر */}
      <section className="from-blue-500 to-purple-600 bg-gradient-to-r py-20 ">
        <div className="container mx-auto px-4 text-center">
          <Title className="mb-6 ">سامانه مشاوره آنلاین خانواده</Title>
          <Paragraph className="mx-auto mb-8 max-w-2xl text-lg">
            مشاوره آنلاین با بهترین متخصصان حوزه خانواده، ازدواج و فرزندپروری در
            هر زمان و هر مکان که هستید
          </Paragraph>
          <Link href="/dashboard/client/consultants">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              شروع مشاوره
            </Button>
          </Link>
        </div>
      </section>

      {/* بخش ویژگی‌های سامانه */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Title level={2} className="mb-12 text-center">
            چرا سامانه مشاوره خانواده؟
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="h-full text-center transition-shadow hover:shadow-md">
                <TeamOutlined className="text-blue-500 mb-4 text-5xl" />
                <Title level={4}>مشاوران متخصص</Title>
                <Paragraph>
                  دسترسی به بهترین مشاوران و روانشناسان با تخصص‌های مختلف در
                  حوزه خانواده
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="h-full text-center transition-shadow hover:shadow-md">
                <CalendarOutlined className="text-blue-500 mb-4 text-5xl" />
                <Title level={4}>انعطاف‌پذیری زمانی</Title>
                <Paragraph>
                  رزرو جلسات در زمان‌های دلخواه شما و امکان مشاوره آنلاین از هر
                  مکان
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="h-full text-center transition-shadow hover:shadow-md">
                <CheckCircleOutlined className="text-blue-500 mb-4 text-5xl" />
                <Title level={4}>محرمانگی کامل</Title>
                <Paragraph>
                  تضمین حفظ حریم خصوصی و اطلاعات شخصی شما در تمامی مراحل مشاوره
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* بخش مشاوران ویژه */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Title level={2} className="mb-12 text-center">
            مشاوران ویژه ما
          </Title>

          <Row gutter={[24, 24]}>
            {featuredConsultants.map((consultant) => (
              <Col xs={24} sm={12} md={8} key={consultant.id}>
                <Card
                  hoverable
                  className="flex h-full flex-col"
                  cover={
                    <div className="pt-4 text-center">
                      <Avatar
                        size={100}
                        src={consultant.image}
                        className="mx-auto"
                      />
                    </div>
                  }
                >
                  <div className="text-center">
                    <Title level={4}>{consultant.name}</Title>
                    <div className="mb-2">
                      {consultant.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 mb-1 mr-1 inline-block rounded-full px-2 py-1 text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <Paragraph className="mb-4">{consultant.bio}</Paragraph>
                    <Rate disabled defaultValue={consultant.rating} />
                    <div className="mt-4">
                      <Link
                        href={`/dashboard/client/consultants/${consultant.id}`}
                      >
                        <Button type="primary">مشاهده پروفایل</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-10 text-center">
            <Link href="/dashboard/client/consultants">
              <Button type="default" size="large">
                مشاهده همه مشاوران <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* بخش نظرات کاربران */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Title level={2} className="mb-12 text-center">
            نظرات کاربران
          </Title>

          <Carousel autoplay dotPosition="bottom">
            {testimonials.map((item) => (
              <div key={item.id} className="px-4">
                <Card className="mx-auto max-w-2xl p-8 text-center">
                  <Rate disabled defaultValue={item.rating} className="mb-4" />
                  <Paragraph className="mb-6 text-lg italic">
                    "{item.text}"
                  </Paragraph>
                  <Title level={5}>{item.name}</Title>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* بخش CTA */}
      <section className="bg-blue-600 py-16 ">
        <div className="container mx-auto px-4 text-center">
          <Title className="mb-6 ">آماده شروع مشاوره هستید؟</Title>
          <Paragraph className="mx-auto mb-8 max-w-2xl text-lg">
            همین امروز با بهترین مشاوران ما در ارتباط باشید و برای بهبود زندگی
            خانوادگی خود قدم بردارید.
          </Paragraph>
          <Link href="/auth/register">
            <Button
              type="default"
              size="large"
              className="text-blue-600 mx-2 bg-white"
            >
              ثبت نام کنید
            </Button>
          </Link>
          <Link href="/dashboard/client/consultants">
            <Button
              type="primary"
              size="large"
              className="hover:bg-blue-700 mx-2 border-white"
            >
              جستجوی مشاوران
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
