export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
  notes?: string;
  messengerType?: 'telegram' | 'whatsapp';
  consultantId: number;
  clientId: number;
}

export interface SessionStatusUpdate {
  status: SessionStatus;
  reason?: string;
}

export interface SessionNotes {
  notes: string;
}

export interface SessionMessage {
  messageType: 'telegram' | 'whatsapp';
  message: string;
}
