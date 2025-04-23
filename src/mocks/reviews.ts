export const reviews = [
  {
    id: 'review-001',
    consultantId: 'consultant-001',
    clientId: 'client-002',
    sessionId: 'session-002',
    consultant: {
      id: 'consultant-001',
      user: {
        id: 'user-002',
        fullName: 'دکتر علی محمدی',
      },
    },
    client: {
      id: 'client-002',
      user: {
        id: 'user-002',
        fullName: 'مریم حسینی',
      },
    },
    rating: 5,
    comment:
      'دکتر محمدی بسیار صبور و دلسوز هستند. راهکارهای ایشان به من و همسرم در حل مشکلات ارتباطی‌مان کمک زیادی کرد.',
    createdAt: '2025-04-20T13:30:00Z',
    updatedAt: '2025-04-20T13:30:00Z',
  },
  {
    id: 'review-002',
    consultantId: 'consultant-001',
    clientId: 'client-001',
    sessionId: 'session-001',
    consultant: {
      id: 'consultant-001',
      user: {
        id: 'user-002',
        fullName: 'دکتر علی محمدی',
      },
    },
    client: {
      id: 'client-001',
      user: {
        id: 'user-004',
        fullName: 'محسن کریمی',
      },
    },
    rating: 4,
    comment:
      'جلسه خوبی بود و راهکارهای مفیدی ارائه شد. منتظر نتایج بیشتر در جلسات آینده هستم.',
    createdAt: '2025-04-15T10:45:00Z',
    updatedAt: '2025-04-15T10:45:00Z',
  },
  {
    id: 'review-003',
    consultantId: 'consultant-002',
    clientId: 'client-002',
    sessionId: 'session-004',
    consultant: {
      id: 'consultant-002',
      user: {
        id: 'user-003',
        fullName: 'دکتر سارا رضایی',
      },
    },
    client: {
      id: 'client-002',
      user: {
        id: 'user-005',
        fullName: 'مریم حسینی',
      },
    },
    rating: 3,
    comment:
      'مشاوره خوب بود اما کمی کوتاه به نظر می‌رسید و همه سوالاتم پاسخ داده نشد.',
    createdAt: '2025-04-18T09:20:00Z',
    updatedAt: '2025-04-18T09:20:00Z',
  },
];
