import type { Client, Consultant } from './session';

// تعریف نوع ساختار نظر
export interface Review {
  id: string;
  consultantId: string;
  clientId: string;
  sessionId: string;
  consultant: Consultant;
  client: Client;
  rating: number;
  comment: string;
  privateComment?: string;
  isAnonymous?: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// تعریف نوع پارامترهای ارسال نظر
export interface ReviewSubmitParams {
  sessionId: string;
  rating: number;
  comment: string;
  privateComment?: string;
  isAnonymous?: boolean;
}

// تعریف نوع پارامترهای فیلتر نظرات
export interface ReviewFilterParams {
  consultantId?: string;
  clientId?: string;
  sessionId?: string;
  minRating?: number;
  maxRating?: number;
  isAnonymous?: boolean;
  startDate?: string;
  endDate?: string;
}

// تعریف نوع نتیجه عملیات ارسال نظر
export interface SubmitReviewResult {
  success: boolean;
  review?: Review;
  error?: string;
}
