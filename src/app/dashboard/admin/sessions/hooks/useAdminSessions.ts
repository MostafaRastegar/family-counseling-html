import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { sessions } from '@/mocks/sessions';
import {
  Session,
  SessionStatus,
  SessionUpdateData,
} from '../types/session.types';

export const useAdminSessions = () => {
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = () => {
      try {
        setAllSessions(sessions);
        setLoading(false);
      } catch (error) {
        message.error('خطا در بارگذاری جلسات');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const updateSession = (sessionId: number, updateData: SessionUpdateData) => {
    setLoading(true);
    try {
      const updatedSessions = allSessions.map((session) =>
        session.id === sessionId ? { ...session, ...updateData } : session,
      );

      setAllSessions(updatedSessions);
      message.success('جلسه با موفقیت بروزرسانی شد');
    } catch (error) {
      message.error('خطا در بروزرسانی جلسه');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = (sessionId: number) => {
    setLoading(true);
    try {
      const filteredSessions = allSessions.filter(
        (session) => session.id !== sessionId,
      );

      setAllSessions(filteredSessions);
      message.success('جلسه با موفقیت حذف شد');
    } catch (error) {
      message.error('خطا در حذف جلسه');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = useMemo(
    () => ({
      all: allSessions,
      pending: allSessions.filter((session) => session.status === 'pending'),
      confirmed: allSessions.filter(
        (session) => session.status === 'confirmed',
      ),
      completed: allSessions.filter(
        (session) => session.status === 'completed',
      ),
      cancelled: allSessions.filter(
        (session) => session.status === 'cancelled',
      ),
    }),
    [allSessions],
  );

  return {
    sessions: allSessions,
    filteredSessions,
    loading,
    updateSession,
    deleteSession,
  };
};
