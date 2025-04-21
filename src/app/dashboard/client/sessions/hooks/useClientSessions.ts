import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { sessions as mockSessions } from '@/mocks/sessions';
import {
  Session,
  SessionCancellation,
  SessionReview,
  SessionStatus,
} from '../types/session.types';

export const useClientSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = () => {
      try {
        // Симуляция загрузки сессий
        setSessions(mockSessions.filter((session) => session.clientId === 5)); // Статический ID клиента
        setLoading(false);
      } catch (error) {
        message.error('خطا در بارگذاری جلسات');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const cancelSession = (
    sessionId: number,
    cancellationData: SessionCancellation,
  ) => {
    setLoading(true);
    try {
      const updatedSessions = sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: 'cancelled' }
          : session,
      );

      setSessions(updatedSessions);
      message.success('جلسه با موفقیت لغو شد');
    } catch (error) {
      message.error('خطا در لغو جلسه');
    } finally {
      setLoading(false);
    }
  };

  const addSessionReview = (sessionId: number, reviewData: SessionReview) => {
    setLoading(true);
    try {
      const updatedSessions = sessions.map((session) =>
        session.id === sessionId ? { ...session, hasReview: true } : session,
      );

      setSessions(updatedSessions);
      message.success('نظر شما با موفقیت ثبت شد');
    } catch (error) {
      message.error('خطا در ثبت نظر');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = useMemo(
    () => ({
      upcoming: sessions.filter(
        (session) =>
          session.status === 'confirmed' || session.status === 'pending',
      ),
      completed: sessions.filter((session) => session.status === 'completed'),
      cancelled: sessions.filter((session) => session.status === 'cancelled'),
    }),
    [sessions],
  );

  return {
    sessions,
    filteredSessions,
    loading,
    cancelSession,
    addSessionReview,
  };
};
