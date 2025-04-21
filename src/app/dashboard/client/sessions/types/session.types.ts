export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  consultantName: string;
  consultantAvatar: string;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
  notes?: string;
  hasReview: boolean;
  messengerType?: 'telegram' | 'whatsapp';
  messengerId?: string;
}

export interface SessionReview {
  rating: number;
  comment: string;
  anonymous?: boolean;
}

export interface SessionCancellation {
  reason: string;
}
