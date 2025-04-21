import { useState } from 'react';
import { message } from 'antd';
import { mockUsers } from '@/mocks/users';
import { User, UserUpdateData } from '../types/user.types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const updateUser = (id: number, userData: UserUpdateData) => {
    setLoading(true);
    try {
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, ...userData } : user,
      );

      setUsers(updatedUsers);
      message.success('اطلاعات کاربر با موفقیت بروزرسانی شد');
    } catch (error) {
      message.error('خطا در بروزرسانی کاربر');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (id: number) => {
    setLoading(true);
    try {
      const filteredUsers = users.filter((user) => user.id !== id);

      setUsers(filteredUsers);
      message.success('کاربر با موفقیت حذف شد');
    } catch (error) {
      message.error('خطا در حذف کاربر');
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = (id: number, newPassword: string) => {
    setLoading(true);
    try {
      // در پیاده‌سازی واقعی، این عملیات باید از طریق API انجام شود
      message.success('رمز عبور با موفقیت بازنشانی شد');
    } catch (error) {
      message.error('خطا در بازنشانی رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    updateUser,
    deleteUser,
    resetUserPassword,
  };
};
