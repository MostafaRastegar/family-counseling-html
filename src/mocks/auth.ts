export const authData = {
  currentUser: {
    id: 'user-002',
    email: 'consultant1@example.com',
    fullName: 'دکتر علی محمدی',
    role: 'consultant',
    phoneNumber: '09123456790',
    profileImage: '/images/avatars/consultant1.jpg',
  },
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnN1bHRhbnQxQGV4YW1wbGUuY29tIiwic3ViIjoidXNlci0wMDIiLCJyb2xlIjoiY29uc3VsdGFudCIsImlhdCI6MTY4MTIzNDU2N30.sample_token',
};

// نمونه‌های مختلف برای تست حالت‌های مختلف
export const authSamples = {
  admin: {
    id: 'user-001',
    email: 'admin@example.com',
    fullName: 'مدیر سیستم',
    role: 'admin',
    phoneNumber: '09123456789',
    profileImage: '/images/avatars/admin.jpg',
    token: 'admin.sample.token',
  },
  consultant: {
    id: 'user-002',
    email: 'consultant1@example.com',
    fullName: 'دکتر علی محمدی',
    role: 'consultant',
    phoneNumber: '09123456790',
    profileImage: '/images/avatars/consultant1.jpg',
    token: 'consultant.sample.token',
  },
  client: {
    id: 'user-004',
    email: 'client1@example.com',
    fullName: 'محسن کریمی',
    role: 'client',
    phoneNumber: '09123456792',
    profileImage: '/images/avatars/client1.jpg',
    token: 'client.sample.token',
  },
};
