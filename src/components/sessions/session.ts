// تعریف انواع وضعیت جلسات
export enum SessionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// تعریف نوع ساختار یک کاربر
export interface User {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

// تعریف نوع ساختار مشاور
export interface Consultant {
  id: string;
  user: User;
}

// تعریف نوع ساختار مراجع
export interface Client {
  id: string;
  user: User;
}

// تعریف نوع ساختار جلسه مشاوره
export interface Session {
  id: string;
  consultantId: string;
  clientId: string;
  consultant: Consultant;
  client: Client;
  date: string; // ISO string
  status: SessionStatus | string;
  notes?: string;
  messengerId?: string;
  messengerType?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// تعریف نوع پارامترهای فیلتر جلسات
export interface SessionFilterParams {
  status?: SessionStatus | string;
  startDate?: string;
  endDate?: string;
  search?: string;
  consultantId?: string;
  clientId?: string;
}

// تعریف نوع نتیجه عملیات به‌روزرسانی وضعیت جلسه
export interface UpdateSessionStatusResult {
  success: boolean;
  session?: Session;
  error?: string;
}
