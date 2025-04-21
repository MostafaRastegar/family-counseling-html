export interface Consultant {
  id: number;
  name: string;
}

export interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface BookingFormData {
  timeSlot: TimeSlot;
  sessionType: 'video' | 'voice' | 'text';
  notes?: string;
  anonymous?: boolean;
}

export interface BookingStepProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export interface PaymentDetails {
  sessionDuration: number;
  basePrice: number;
  tax: number;
  totalPrice: number;
}
