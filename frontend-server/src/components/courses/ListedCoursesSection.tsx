import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Course } from '@/types/course';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CourseCard } from './CourseCard';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { MovingButton } from '../ui/moving-border';
import { RazorpayScript } from '../payment/RazorpayScript';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export const ListedCoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/courses?page=${page}&limit=9&category=${selectedCategory}&search=${searchTerm}`);
        if (page === 1) {
          setCourses(response.data.data);
        } else {
          setCourses(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.hasMore);
      } catch (error) {
        toast.error('Error fetching courses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page, selectedCategory, searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories/all');
        setCategories(response.data.data.map((cat: any) => cat.name));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleEnroll = async (courseId: string, price: number) => {
    try {
      if (!user) {
        toast.error('Please login to enroll in courses');
        return;
      }

      const response = await axiosInstance.post('/api/v1/payments/capture', {
        courseId
      });

      // For free courses, enrollment is handled directly
      if (price === 0) {
        if (response.data.success) {
          toast.success('Successfully enrolled in the course!');
          // Optionally refresh the UI or redirect
          return;
        }
      }

      // For paid courses, handle Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.data.data.amount,
        currency: response.data.data.currency,
        name: "NoteWrite",
        description: "Course Enrollment",
        order_id: response.data.data.orderId,
        handler: async (response: any) => {
          try {
            await axiosInstance.post('/api/v1/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId
            });

            toast.success('Successfully enrolled in the course!');
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      toast.error('Error enrolling in course');
      console.error(error);
    }
  };

  const handlePreview = (courseId: string) => {
    router.push(`/courses/${courseId}/preview`);
  };

  const filteredCourses = courses.filter(course => 
    (selectedCategory === "All" || course.category?.name === selectedCategory) &&
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section ref={sectionRef} className="py-12 text-gray-100">
      <RazorpayScript />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Explore Our Courses</h2>
        
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-zinc-900 text-gray-300 hover:bg-zinc-700'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {loading && page === 1 ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="course-card">
                  <CourseCard 
                    course={course}
                    onPreview={handlePreview}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <MovingButton
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Courses'}
                </MovingButton>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};