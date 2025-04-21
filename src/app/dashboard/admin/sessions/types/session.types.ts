export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Session {
  id: number;
  consultantName: string;
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

export interface SessionUpdateData {
  status?: SessionStatus;
  notes?: string;
  messengerType?: 'telegram' | 'whatsapp';
  messengerId?: string;
}
