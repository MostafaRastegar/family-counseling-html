# لندینگ پیج سیستم مشاوره‌ای کامپلیکیتد

## 🎯 هدف پروژه
ساخت یک لندینگ پیج برای پلتفرم مشاوره‌ای که کاربران بتوانند مشاور/درمانگر مناسب خود را پیدا کنند.

## 📋 فهرست فیچرها

### 1. سیستم رنگی (Color Palette)
- رنگ‌های اصلی: آبی، قهوه‌ای، سبز
- رنگ‌های ثانویه: طوسی، زمینه‌ای
- تعریف variables در Tailwind config

### 2. کامپوننت‌های اصلی

#### 2.1 Navigation Bar
- لوگو
- منوی ناوبری
- دکمه CTA (Call to Action)
- Responsive hamburger menu

#### 2.2 Hero Section
- تیتر اصلی: "Life is complicated. Finding a therapist shouldn't be."
- توضیح کوتاه
- آمار (9/10 found their therapist, 95% recommend us, ...)
- دکمه‌های اقدام اولیه

#### 2.3 Blog/Articles Section
- کارت‌های قسمتی از وبلاگ
- تصاویر placeholder
- تیتر و خلاصه مقالات
- لینک "Read the article"

#### 2.4 Therapists Directory
- کارت‌های مشاورین
- تصاویر profile
- تخصص‌ها و مهارت‌ها
- قیمت و موقعیت
- دکمه‌های تماس

#### 2.5 Features Section
- Free matching service
- Affordable Therapy
- Built by therapists
- با آیکون‌ها و توضیحات

#### 2.6 Footer
- لینک‌های ناوبری
- اطلاعات تماس
- شبکه‌های اجتماعی

## 🛠️ اصول توسعه

### 1. Component-Based Architecture
```
components/
  ├── ui/
  │   ├── Button.tsx
  │   ├── Card.tsx
  │   ├── Typography.tsx
  └── sections/
      ├── Navbar.tsx
      ├── Hero.tsx
      ├── Blog.tsx
      ├── Directory.tsx
      ├── Features.tsx
      └── Footer.tsx
```

### 2. Design Principles
- **SOLID**: هر کامپوننت یک مسئولیت دارد
- **DRY**: استفاده مجدد از کامپوننت‌ها
- **Responsive**: Grid-based layout
- **Minimal Code**: حداقل کد برای رسیدن به هدف

### 3. Styling System
- Tailwind utility classes
- Custom color palette
- Responsive breakpoints
- Consistent spacing

## 📦 Assets Requirements
- Placeholder images for all visuals
- Icons from Lucide React
- No additional images

## 🚀 Development Flow
1. تعریف سیستم رنگی
2. ساخت UI components پایه
3. توسعه sections اصلی
4. اتصال همه بخش‌ها
5. تست responsive
6. بهینه‌سازی نهایی

## 📱 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px