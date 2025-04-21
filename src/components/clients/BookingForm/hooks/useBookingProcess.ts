import { useState } from 'react';
import { message } from 'antd';
import {
  BookingFormData,
  PaymentDetails,
  TimeSlot,
} from '../types/booking.types';

export const useBookingProcess = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    timeSlot: null,
    sessionType: 'video',
    notes: '',
    anonymous: false,
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (data: Partial<BookingFormData>) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const calculatePaymentDetails = (timeSlot: TimeSlot): PaymentDetails => {
    const sessionDuration = 60; // Default 60 minutes
    const basePrice = 500000; // 500,000 تومان
    const taxRate = 0.09; // 9% مالیات بر ارزش افزوده

    return {
      sessionDuration,
      basePrice,
      tax: basePrice * taxRate,
      totalPrice: basePrice * (1 + taxRate),
    };
  };

  const submitBooking = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success('جلسه مشاوره با موفقیت رزرو شد');
      return true;
    } catch (error) {
      message.error('خطا در رزرو جلسه');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetBooking = () => {
    setCurrentStep(0);
    setBookingData({
      timeSlot: null,
      sessionType: 'video',
      notes: '',
      anonymous: false,
    });
  };

  return {
    currentStep,
    bookingData,
    loading,
    updateFormData,
    calculatePaymentDetails,
    submitBooking,
    nextStep,
    prevStep,
    resetBooking,
  };
};
