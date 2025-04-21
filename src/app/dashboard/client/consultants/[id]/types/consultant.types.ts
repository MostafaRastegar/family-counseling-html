export interface Consultant {
  id: number;
  name: string;
  specialties: string[];
  bio: string;
  education: string;
  rating: number;
  reviewCount: number;
  image?: string;
  isVerified: boolean;
}

export interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
