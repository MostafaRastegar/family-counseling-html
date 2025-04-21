import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { sessions } from '@/mocks/sessions';
import {
  Session,
  SessionMessage,
  SessionNotes,
  SessionStatus,
  SessionStatusUpdate,
} from '../types/session.types';

export const useConsultantSessions = (consultantId: number) => {
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = () => {
      try {
        const consultantSessions = sessions.filter(
          (session) => session.consultantId === consultantId,
        );
        setAllSessions(consultantSessions);
      } catch (error) {
        message.error('خطا در بارگذاری جلسات');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [consultantId]);

  const updateSessionStatus = (
    sessionId: number,
    update: SessionStatusUpdate,
  ) => {
    setLoading(true);
    try {
      const updatedSessions = allSessions.map((session) =>
        session.id === sessionId ? { ...session, ...update } : session,
      );

      setAllSessions(updatedSessions);
      message.success('وضعیت جلسه با موفقیت بروزرسانی شد');
    } catch (error) {
      message.error('خطا در بروزرسانی وضعیت جلسه');
    } finally {
      setLoading(false);
    }
  };

  const addSessionNotes = (sessionId: number, notes: SessionNotes) => {
    setLoading(true);
    try {
      const updatedSessions = allSessions.map((session) =>
        session.id === sessionId ? { ...session, ...notes } : session,
      );

      setAllSessions(updatedSessions);
      message.success('یادداشت جلسه با موفقیت ثبت شد');
    } catch (error) {
      message.error('خطا در ثبت یادداشت');
    } finally {
      setLoading(false);
    }
  };

  const sendSessionMessage = (
    sessionId: number,
    messageData: SessionMessage,
  ) => {
    setLoading(true);
    try {
      // در پیاده‌سازی واقعی، این عملیات باید از طریق API انجام شود
      message.success('پیام با موفقیت ارسال شد');
    } catch (error) {
      message.error('خطا در ارسال پیام');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = useMemo(() => {
    return {
      upcoming: allSessions.filter(
        (session) =>
          session.status === 'confirmed' || session.status === 'pending',
      ),
      completed: allSessions.filter(
        (session) => session.status === 'completed',
      ),
      cancelled: allSessions.filter(
        (session) => session.status === 'cancelled',
      ),
    };
  }, [allSessions]);

  return {
    sessions: allSessions,
    filteredSessions,
    loading,
    updateSessionStatus,
    addSessionNotes,
    sendSessionMessage,
  };
};
