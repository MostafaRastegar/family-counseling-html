export type UserRole = 'admin' | 'consultant' | 'client';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
}

export interface UserUpdateData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
}
