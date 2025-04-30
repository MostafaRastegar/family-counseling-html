'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Result, Steps } from 'antd';
import dayjs from 'dayjs';
import BookingCalendar from '@/components/clients/BookingCalendar';
import BookingForm from '@/components/clients/BookingForm';
import PageHeader from '@/components/ui/PageHeader';
import LoadingState from '@/components/ui/states/LoadingState';
import { availabilities } from '@/mocks/availabilities';
import { consultants } from '@/mocks/consultants';

// Define steps
enum BookingStep {
  SELECT_TIME = 0,
  FILL_FORM = 1,
  CONFIRMATION = 2,
}

export default function BookConsultantPage() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [consultant, setConsultant] = useState<any>(null);
  const [consultantAvailabilities, setConsultantAvailabilities] = useState<
    any[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    BookingStep.SELECT_TIME,
  );
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>('');

  // Fetch consultant data and availabilities
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      // Find consultant in mock data
      const foundConsultant = consultants.find((c) => c.id === consultantId);
      if (foundConsultant) {
        setConsultant(foundConsultant);

        // Find availabilities for this consultant
        const consultantAvailabilities = availabilities
          .filter((a) => a.consultantId === consultantId)
          .map((a) => ({
            id: a.id,
            startTime: a.startTime,
            endTime: a.endTime,
            isAvailable: a.isAvailable,
          }));

        setConsultantAvailabilities(consultantAvailabilities);
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [consultantId]);

  // Handle time slot selection
  const handleTimeSlotSelect = (
    timeSlotId: string,
    date: string,
    startTime: string,
    endTime: string,
  ) => {
    setSelectedTimeSlot({
      id: timeSlotId,
      date,
      startTime,
      endTime,
    });

    // Move to next step
    setCurrentStep(BookingStep.FILL_FORM);
  };

  // Handle form submission
  const handleFormSubmit = (values: any) => {
    setSubmitLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      // Generate a random booking reference
      const reference = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      setBookingReference(reference);

      // Move to confirmation step
      setCurrentStep(BookingStep.CONFIRMATION);
      setBookingComplete(true);
      setSubmitLoading(false);
    }, 2000);
  };

  // Handle date change
  const handleDateChange = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep === BookingStep.FILL_FORM) {
      setCurrentStep(BookingStep.SELECT_TIME);
    } else {
      router.back();
    }
  };

  // Handle finish
  const handleFinish = () => {
    router.push('/dashboard/sessions');
  };

  // Handle cancel
  const handleCancel = () => {
    router.push(`/consultants/${consultantId}`);
  };

  // If still loading
  if (loading) {
    return <LoadingState fullPage={false} />;
  }

  // If consultant not found
  if (!consultant) {
    return (
      <div className="my-20 text-center">
        <h2 className="mb-2 text-2xl font-semibold">مشاور یافت نشد</h2>
        <p className="text-gray-500">
          مشاور مورد نظر یافت نشد یا ممکن است حذف شده باشد.
        </p>
        <Button
          type="primary"
          onClick={() => router.push('/consultants')}
          className="mt-4"
        >
          بازگشت به لیست مشاوران
        </Button>
      </div>
    );
  }

  // Content for each step
  const stepContent = () => {
    switch (currentStep) {
      case BookingStep.SELECT_TIME:
        return (
          <BookingCalendar
            consultantId={consultantId}
            consultantName={consultant.user.fullName}
            availableTimeSlots={consultantAvailabilities}
            onSelectTimeSlot={handleTimeSlotSelect}
            loading={loading}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        );

      case BookingStep.FILL_FORM:
        if (!selectedTimeSlot) {
          return null;
        }

        return (
          <BookingForm
            consultantName={consultant.user.fullName}
            sessionDate={selectedTimeSlot.date}
            sessionStartTime={selectedTimeSlot.startTime}
            sessionEndTime={selectedTimeSlot.endTime}
            sessionPrice={250000} // Fixed price for demo
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            loading={submitLoading}
          />
        );

      case BookingStep.CONFIRMATION:
        return (
          <Card>
            <Result
              status="success"
              title="رزرو جلسه مشاوره با موفقیت انجام شد"
              subTitle={`شماره پیگیری: ${bookingReference}`}
              extra={[
                <Button type="primary" key="console" onClick={handleFinish}>
                  مشاهده جلسات من
                </Button>,
                <Button key="buy" onClick={() => router.push('/consultants')}>
                  رزرو جلسه دیگر
                </Button>,
              ]}
            />
          </Card>
        );
    }
  };

  return (
    <div className="booking-page">
      <PageHeader
        title={`رزرو وقت مشاوره با ${consultant.user.fullName}`}
        subtitle="زمان مورد نظر خود را انتخاب کنید و اطلاعات لازم را تکمیل کنید"
        backButton={{
          onClick: handleBack,
        }}
      />

      {/* Steps */}
      <Card className="mb-6">
        <Steps
          current={currentStep}
          items={[
            {
              title: 'انتخاب زمان',
              description: 'تاریخ و ساعت جلسه',
            },
            {
              title: 'تکمیل اطلاعات',
              description: 'اطلاعات جلسه و پرداخت',
            },
            {
              title: 'تایید نهایی',
              description: 'رزرو جلسه مشاوره',
            },
          ]}
        />
      </Card>

      {/* Step content */}
      {stepContent()}
    </div>
  );
}
