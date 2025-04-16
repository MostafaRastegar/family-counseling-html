'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOutlined,
  CalendarOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReadOutlined,
  SearchOutlined,
  SoundOutlined,
  TagOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
  Pagination,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// داده‌های نمونه برای مقالات
const mockArticles = [
  {
    id: 1,
    title: 'راهنمای کامل تربیت فرزندان در عصر دیجیتال',
    excerpt:
      'در این مقاله به چالش‌های والدین در تربیت فرزندان در عصر فناوری و راهکارهای مناسب برای مدیریت استفاده از فناوری توسط کودکان و نوجوانان می‌پردازیم.',
    author: 'دکتر علی محمدی',
    date: '1404/02/10',
    categories: ['تربیت فرزند', 'فناوری'],
    tags: ['فرزندپروری', 'فضای مجازی', 'کودکان'],
    image: '/assets/images/article1.jpg',
    views: 1250,
    type: 'article',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'چگونه ارتباط موثری با همسر خود داشته باشیم؟',
    excerpt:
      'ارتباط موثر یکی از مهمترین عوامل موفقیت در زندگی زناشویی است. در این مقاله، تکنیک‌های ارتباطی موثر و نحوه حل تعارضات زناشویی بررسی می‌شود.',
    author: 'دکتر سارا احمدی',
    date: '1404/02/05',
    categories: ['روابط زناشویی'],
    tags: ['ارتباط موثر', 'حل تعارض', 'زندگی مشترک'],
    image: '/assets/images/article2.jpg',
    views: 980,
    type: 'article',
    isFeatured: false,
  },
  {
    id: 3,
    title: 'مدیریت استرس و اضطراب در زندگی روزمره',
    excerpt:
      'استرس و اضطراب می‌تواند تاثیر منفی بر سلامت جسمی و روانی ما داشته باشد. در این مقاله، روش‌های عملی برای مدیریت استرس و کاهش اضطراب ارائه می‌شود.',
    author: 'دکتر محمد رضایی',
    date: '1404/01/20',
    categories: ['سلامت روان'],
    tags: ['استرس', 'اضطراب', 'آرامش'],
    image: '/assets/images/article3.jpg',
    views: 1500,
    type: 'article',
    isFeatured: true,
  },
  {
    id: 4,
    title: 'نقش خانواده در شکل‌گیری شخصیت کودکان',
    excerpt:
      'خانواده اولین و مهمترین محیط اجتماعی است که کودک در آن رشد می‌کند. این مقاله به نقش خانواده در شکل‌گیری شخصیت و رفتار کودکان می‌پردازد.',
    author: 'دکتر زهرا کریمی',
    date: '1404/01/15',
    categories: ['تربیت فرزند', 'روانشناسی کودک'],
    tags: ['شخصیت', 'کودکان', 'خانواده'],
    image: '/assets/images/article4.jpg',
    views: 850,
    type: 'article',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'تکنیک‌های آرامش‌بخشی برای کودکان مضطرب',
    excerpt:
      'در این پادکست، روش‌های عملی برای کمک به کودکان در مدیریت اضطراب و استرس معرفی می‌شود.',
    author: 'دکتر فاطمه نجفی',
    date: '1404/02/01',
    categories: ['روانشناسی کودک'],
    tags: ['اضطراب', 'کودکان', 'آرامش'],
    image: '/assets/images/podcast1.jpg',
    duration: '25 دقیقه',
    type: 'podcast',
    isFeatured: false,
  },
  {
    id: 6,
    title: 'آموزش مهارت‌های ارتباطی در خانواده',
    excerpt:
      'این ویدیو آموزشی به شما کمک می‌کند تا مهارت‌های ارتباطی خود را در خانواده تقویت کنید.',
    author: 'دکتر محمد حسینی',
    date: '1404/02/08',
    categories: ['روابط خانوادگی'],
    tags: ['ارتباط موثر', 'مهارت‌های ارتباطی'],
    image: '/assets/images/video1.jpg',
    duration: '45 دقیقه',
    type: 'video',
    isFeatured: true,
  },
];

export default function Resources() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // شبیه‌سازی دریافت داده‌ها از API
    setTimeout(() => {
      setArticles(mockArticles);
      setFilteredArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  // استخراج همه دسته‌بندی‌ها
  const allCategories = [
    ...new Set(mockArticles.flatMap((article) => article.categories)),
  ];

  // استخراج همه انواع محتوا
  const contentTypes = [
    { value: 'article', label: 'مقاله', icon: <ReadOutlined /> },
    { value: 'video', label: 'ویدیو', icon: <VideoCameraOutlined /> },
    { value: 'podcast', label: 'پادکست', icon: <SoundOutlined /> },
  ];

  // اعمال فیلترها
  useEffect(() => {
    if (!articles.length) return;

    let filtered = [...articles];

    // فیلتر بر اساس تب فعال
    if (activeTab === 'articles') {
      filtered = filtered.filter((item) => item.type === 'article');
    } else if (activeTab === 'videos') {
      filtered = filtered.filter((item) => item.type === 'video');
    } else if (activeTab === 'podcasts') {
      filtered = filtered.filter((item) => item.type === 'podcast');
    } else if (activeTab === 'featured') {
      filtered = filtered.filter((item) => item.isFeatured);
    }

    // فیلتر بر اساس متن جستجو
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase()),
          ),
      );
    }

    // فیلتر بر اساس دسته‌بندی
    if (categoryFilter) {
      filtered = filtered.filter((item) =>
        item.categories.includes(categoryFilter),
      );
    }

    // فیلتر بر اساس نوع محتوا
    if (typeFilter) {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    setFilteredArticles(filtered);
    setCurrentPage(1); // بازگشت به صفحه اول پس از اعمال فیلتر
  }, [articles, searchText, categoryFilter, typeFilter, activeTab]);

  // محاسبه محتوای صفحه فعلی
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // آیکون مناسب برای نوع محتوا
  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <ReadOutlined />;
      case 'video':
        return <VideoCameraOutlined />;
      case 'podcast':
        return <SoundOutlined />;
      default:
        return <BookOutlined />;
    }
  };

  // متن مناسب برای نوع محتوا
  const getContentTypeText = (type) => {
    switch (type) {
      case 'article':
        return 'مقاله';
      case 'video':
        return 'ویدیو';
      case 'podcast':
        return 'پادکست';
      default:
        return type;
    }
  };

  // نمایش محتوا
  const renderResourceCard = (item) => {
    return (
      <Card
        hoverable
        cover={
          <div
            className="relative h-48 overflow-hidden bg-gray-200"
            style={{
              backgroundImage: `url(${item.image || '/assets/images/placeholder.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute right-2 top-2">
              <Tag
                color={
                  item.type === 'article'
                    ? 'blue'
                    : item.type === 'video'
                      ? 'green'
                      : item.type === 'podcast'
                        ? 'purple'
                        : 'default'
                }
              >
                <Space>
                  {getContentTypeIcon(item.type)}
                  {getContentTypeText(item.type)}
                </Space>
              </Tag>
            </div>
            {(item.type === 'video' || item.type === 'podcast') && (
              <div className="absolute bottom-2 right-2">
                <Tag color="black">{item.duration}</Tag>
              </div>
            )}
          </div>
        }
      >
        <Title level={5} ellipsis={{ rows: 2 }} className="h-12">
          {item.title}
        </Title>
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <Space>
            <UserOutlined />
            <span>{item.author}</span>
          </Space>
          <Space>
            <CalendarOutlined />
            <span>{item.date}</span>
          </Space>
        </div>
        <Paragraph ellipsis={{ rows: 3 }} className="mb-4 h-16 text-gray-600">
          {item.excerpt}
        </Paragraph>
        <div className="mb-4">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} className="mb-1 mr-1">
              {tag}
            </Tag>
          ))}
          {item.tags.length > 3 && <Tag>+{item.tags.length - 3}</Tag>}
        </div>
        <div className="flex items-center justify-between">
          <Space>
            <EyeOutlined />
            <span>{item.views} بازدید</span>
          </Space>
          <Link href={`/resources/${item.id}`}>
            <Button type="primary">مشاهده</Button>
          </Link>
        </div>
      </Card>
    );
  };

  // نمایش محتوای ویژه
  const renderFeaturedContent = () => {
    const featured = articles.filter((item) => item.isFeatured).slice(0, 3);

    return (
      <Card title="محتوای ویژه" className="mb-6">
        <Row gutter={[16, 16]}>
          {featured.map((item) => (
            <Col xs={24} md={8} key={item.id}>
              <Card
                hoverable
                cover={
                  <div
                    className="h-32 bg-gray-200"
                    style={{
                      backgroundImage: `url(${item.image || '/assets/images/placeholder.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <Space className="w-full">
                      <span className="truncate">{item.title}</span>
                      <Tag
                        color={
                          item.type === 'article'
                            ? 'blue'
                            : item.type === 'video'
                              ? 'green'
                              : item.type === 'podcast'
                                ? 'purple'
                                : 'default'
                        }
                      >
                        {getContentTypeIcon(item.type)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space>
                      <CalendarOutlined />
                      <span className="text-xs">{item.date}</span>
                    </Space>
                  }
                />
                <div className="mt-2">
                  <Link href={`/resources/${item.id}`}>
                    <Button type="link" size="small">
                      ادامه مطلب
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <Title level={2}>منابع و مقالات آموزشی</Title>
        <Paragraph className="mx-auto max-w-2xl text-gray-500">
          در این بخش می‌توانید از مقالات، ویدیوها و پادکست‌های آموزشی استفاده
          کنید. این منابع توسط مشاوران متخصص ما تهیه شده‌اند و می‌توانند به شما
          در مسائل مختلف خانوادگی کمک کنند.
        </Paragraph>
      </div>

      {renderFeaturedContent()}

      <Card>
        <div className="mb-6">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <BookOutlined /> همه
                </span>
              }
              key="all"
            />
            <TabPane
              tab={
                <span>
                  <ReadOutlined /> مقالات
                </span>
              }
              key="articles"
            />
            <TabPane
              tab={
                <span>
                  <VideoCameraOutlined /> ویدیوها
                </span>
              }
              key="videos"
            />
            <TabPane
              tab={
                <span>
                  <SoundOutlined /> پادکست‌ها
                </span>
              }
              key="podcasts"
            />
            <TabPane
              tab={
                <span>
                  <TagOutlined /> برگزیده‌ها
                </span>
              }
              key="featured"
            />
          </Tabs>
        </div>

        <div className="mb-6 flex flex-wrap items-center">
          <div className="mb-4 w-full md:mb-0 md:w-1/2 md:pl-4 lg:w-1/3">
            <Input
              placeholder="جستجو در منابع آموزشی..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <div className="flex w-full flex-wrap md:w-1/2 lg:w-2/3">
            <div className="mb-4 w-full sm:mb-0 sm:w-1/2 sm:pl-2 lg:w-1/3">
              <Select
                placeholder="دسته‌بندی"
                style={{ width: '100%' }}
                onChange={setCategoryFilter}
                allowClear
              >
                {allCategories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 lg:pl-2">
              <Select
                placeholder="نوع محتوا"
                style={{ width: '100%' }}
                onChange={setTypeFilter}
                allowClear
              >
                {contentTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    <Space>
                      {type.icon}
                      {type.label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {paginatedArticles.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {paginatedArticles.map((item) => (
                <Col xs={24} sm={12} md={8} key={item.id}>
                  {renderResourceCard(item)}
                </Col>
              ))}
            </Row>

            <div className="mt-6 text-center">
              <Pagination
                current={currentPage}
                total={filteredArticles.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <Title level={4} className="text-gray-500">
              هیچ محتوایی یافت نشد!
            </Title>
            <Paragraph className="text-gray-500">
              لطفاً معیارهای جستجوی خود را تغییر دهید.
            </Paragraph>
          </div>
        )}
      </Card>

      <Card className="mt-6">
        <Title level={4}>دانلود کتاب‌های الکترونیکی رایگان</Title>
        <Paragraph className="text-gray-500">
          کتاب‌های الکترونیکی رایگان ما حاوی اطلاعات ارزشمندی درباره موضوعات
          مختلف خانوادگی هستند.
        </Paragraph>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card hoverable className="text-center">
            <BookOutlined
              style={{ fontSize: 48, color: '#1890ff' }}
              className="mb-4"
            />
            <Title level={5}>راهنمای جامع تربیت فرزند</Title>
            <Paragraph className="h-12 text-gray-500">
              این کتاب شامل تکنیک‌های عملی برای تربیت فرزندان در سنین مختلف است.
            </Paragraph>
            <Button type="primary" icon={<DownloadOutlined />}>
              دانلود رایگان
            </Button>
          </Card>

          <Card hoverable className="text-center">
            <BookOutlined
              style={{ fontSize: 48, color: '#52c41a' }}
              className="mb-4"
            />
            <Title level={5}>ارتباط موثر در زندگی زناشویی</Title>
            <Paragraph className="h-12 text-gray-500">
              روش‌های بهبود ارتباط و حل تعارضات در زندگی مشترک.
            </Paragraph>
            <Button type="primary" icon={<DownloadOutlined />}>
              دانلود رایگان
            </Button>
          </Card>

          <Card hoverable className="text-center">
            <BookOutlined
              style={{ fontSize: 48, color: '#722ed1' }}
              className="mb-4"
            />
            <Title level={5}>تکنیک‌های مدیریت استرس</Title>
            <Paragraph className="h-12 text-gray-500">
              روش‌های عملی برای کاهش استرس و ایجاد آرامش درونی.
            </Paragraph>
            <Button type="primary" icon={<DownloadOutlined />}>
              دانلود رایگان
            </Button>
          </Card>
        </div>
      </Card>
    </div>
  );
}
