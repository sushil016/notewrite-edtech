'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import { MovingButton } from '@/components/ui/moving-border';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { RazorpayScript } from '@/components/payment/RazorpayScript';

export default function CourseEnrollment({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/courses/${params.courseId}/preview`);
      setCourse(response.data.data);
    } catch (error) {
      toast.error('Error fetching course details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handlePayment = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/payments/capture', {
        courseId: params.courseId
      });

      if (course?.price === 0) {
        if (response.data.success) {
          toast.success('Successfully enrolled in the course!');
          router.push('/dashboard/my-courses');
        }
        return;
      }

      // For paid courses, handle Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.data.data.amount,
        currency: response.data.data.currency,
        name: "NoteWrite",
        description: `Enrollment for ${course?.courseName}`,
        order_id: response.data.data.orderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: params.courseId
            });

            toast.success('Successfully enrolled in the course!');
            router.push('/dashboard/my-courses');
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          email: user?.email,
          name: `${user?.firstName} ${user?.lastName}`
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      toast.error('Error processing enrollment');
      console.error(error);
    }
  }, [course, params.courseId, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-red-500">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RazorpayScript />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-8">Enrollment Confirmation</h1>
            
            <div className="space-y-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Course</h2>
                <p className="text-gray-300">{course.courseName}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Instructor</h2>
                <p className="text-gray-300">
                  {course.teacher?.firstName} {course.teacher?.lastName}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Price</h2>
                <p className="text-2xl font-bold text-green-400">
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <MovingButton
                onClick={handlePayment}
                className="w-full"
              >
                {course.price > 0 ? 'Proceed to Payment' : 'Enroll Now'}
              </MovingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 