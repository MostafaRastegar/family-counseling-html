export const sessions = [
  {
    id: 'session-001',
    consultantId: 'consultant-001',
    clientId: 'client-001',
    consultant: {
      id: 'consultant-001',
      user: {
        id: 'user-002',
        fullName: 'دکتر علی محمدی',
        email: 'consultant1@example.com',
        profileImage: '/images/avatars/consultant1.jpg',
      },
    },
    client: {
      id: 'client-001',
      user: {
        id: 'user-004',
        fullName: 'محسن کریمی',
        email: 'client1@example.com',
        profileImage: '/images/avatars/client1.jpg',
      },
    },
    date: '2025-04-26T14:00:00Z',
    status: 'confirmed', // تایید شده
    notes: 'جلسه اول - بررسی مشکلات ارتباطی',
    messengerId: 'telegram123456',
    messengerType: 'telegram',
    createdAt: '2025-04-21T10:15:00Z',
    updatedAt: '2025-04-21T11:30:00Z',
  },
  {
    id: 'session-002',
    consultantId: 'consultant-001',
    clientId: 'client-002',
    consultant: {
      id: 'consultant-001',
      user: {
        id: 'user-002',
        fullName: 'دکتر علی محمدی',
        email: 'consultant1@example.com',
        profileImage: '/images/avatars/consultant1.jpg',
      },
    },
    client: {
      id: 'client-002',
      user: {
        id: 'user-005',
        fullName: 'مریم حسینی',
        email: 'client2@example.com',
        profileImage: '/images/avatars/client2.jpg',
      },
    },
    date: '2025-04-20T11:00:00Z',
    status: 'completed', // کامل شده
    notes: 'جلسه پیگیری - تمرین‌های ارتباطی موثر بود',
    messengerId: 'whatsapp987654',
    messengerType: 'whatsapp',
    createdAt: '2025-04-15T09:30:00Z',
    updatedAt: '2025-04-20T12:15:00Z',
  },
  {
    id: 'session-003',
    consultantId: 'consultant-002',
    clientId: 'client-001',
    consultant: {
      id: 'consultant-002',
      user: {
        id: 'user-003',
        fullName: 'دکتر سارا رضایی',
        email: 'consultant2@example.com',
        profileImage: '/images/avatars/consultant2.jpg',
      },
    },
    client: {
      id: 'client-001',
      user: {
        id: 'user-004',
        fullName: 'محسن کریمی',
        email: 'client1@example.com',
        profileImage: '/images/avatars/client1.jpg',
      },
    },
    date: '2025-04-28T16:00:00Z',
    status: 'pending', // در انتظار تایید
    notes: '',
    messengerId: '',
    messengerType: '',
    createdAt: '2025-04-22T14:45:00Z',
    updatedAt: '2025-04-22T14:45:00Z',
  },
  {
    id: 'session-004',
    consultantId: 'consultant-002',
    clientId: 'client-002',
    consultant: {
      id: 'consultant-002',
      user: {
        id: 'user-003',
        fullName: 'دکتر سارا رضایی',
        email: 'consultant2@example.com',
        profileImage: '/images/avatars/consultant2.jpg',
      },
    },
    client: {
      id: 'client-002',
      user: {
        id: 'user-005',
        fullName: 'مریم حسینی',
        email: 'client2@example.com',
        profileImage: '/images/avatars/client2.jpg',
      },
    },
    date: '2025-04-24T09:00:00Z',
    status: 'cancelled', // لغو شده
    notes: 'به دلیل مشکل شخصی لغو شد',
    messengerId: 'telegram654321',
    messengerType: 'telegram',
    createdAt: '2025-04-20T15:30:00Z',
    updatedAt: '2025-04-22T08:45:00Z',
  },
];
