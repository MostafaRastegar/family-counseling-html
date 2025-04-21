export interface Consultant {
  id: number;
  name: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  image?: string;
  bio: string;
  education: string;
}

export type ConsultantStatus = 'verified' | 'unverified';
export type ConsultantAction = 'view' | 'edit' | 'verify' | 'delete';
