import { useState } from 'react';
import { message } from 'antd';
import { consultants } from '@/mocks/consultants';
import { Consultant } from '../types/consultant.types';

export const useConsultantManagement = () => {
  const [consultantList, setConsultantList] =
    useState<Consultant[]>(consultants);
  const [loading, setLoading] = useState(false);

  const updateConsultantStatus = (id: number, isVerified: boolean) => {
    setLoading(true);
    try {
      const updatedConsultants = consultantList.map((consultant) =>
        consultant.id === id ? { ...consultant, isVerified } : consultant,
      );

      setConsultantList(updatedConsultants);
      message.success(`مشاور با موفقیت ${isVerified ? 'تأیید' : 'رد'} شد`);
    } catch (error) {
      message.error('خطا در بروزرسانی وضعیت مشاور');
    } finally {
      setLoading(false);
    }
  };

  const deleteConsultant = (id: number) => {
    setLoading(true);
    try {
      const filteredConsultants = consultantList.filter(
        (consultant) => consultant.id !== id,
      );

      setConsultantList(filteredConsultants);
      message.success('مشاور با موفقیت حذف شد');
    } catch (error) {
      message.error('خطا در حذف مشاور');
    } finally {
      setLoading(false);
    }
  };

  return {
    consultantList,
    loading,
    updateConsultantStatus,
    deleteConsultant,
  };
};
