'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MovingButton } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { CourseCreationStepper } from '@/components/courses/CourseCreationStepper';
import { SectionCreator } from '@/components/courses/SectionCreator';
import { SubSectionCreator } from '@/components/courses/SubSectionCreator';

const courseSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters'),
  courseDescription: z.string().min(10, 'Description must be at least 10 characters'),
  whatYouWillLearn: z.string().min(10, 'Learning outcomes must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  tag: z.array(z.string()).min(1, 'At least one tag is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required')
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Category {
  id: string;
  name: string;
}

export default function EditCourse({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<CourseFormData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${params.courseId}`);
      const courseData = response.data.data;
      setCourse(courseData);
      setTags(courseData.tag || []);
      setInstructions(courseData.instructions || []);
      
      // Set form values
      reset({
        courseName: courseData.courseName,
        courseDescription: courseData.courseDescription,
        whatYouWillLearn: courseData.whatYouWillLearn,
        categoryId: courseData.categoryId,
        tag: courseData.tag,
        instructions: courseData.instructions
      });
    } catch (error) {
      toast.error('Error fetching course details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [params.courseId, reset]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/v1/categories/all');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCourseDetails();
    fetchCategories();
  }, [fetchCourseDetails, fetchCategories]);

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      const formattedData = {
        ...data,
        tag: tags,
        instructions: instructions
      };

      const response = await axiosInstance.put(`/api/v1/courses/${params.courseId}`, formattedData);
      
      if (response.data.success) {
        toast.success('Course updated successfully');
        setCurrentStep(2);
      }
    } catch (error) {
      toast.error('Error updating course');
      console.error(error);
    }
  };

  const skipToSubsections = useCallback(() => {
    setCurrentStep(3);
  }, []);

  const skipToReview = useCallback(() => {
    router.push(`/teacher/courses/${params.courseId}/review`);
  }, [router, params.courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <CourseCreationStepper currentStep={currentStep} />
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-white">Edit Course</h1>
              <MovingButton onClick={() => router.push(`/teacher/courses/${params.courseId}/review`)}>
                Preview Course
              </MovingButton>
            </div>

            <div className="space-y-6">
              {currentStep === 1 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Course Name</label>
                    <Input
                      {...register('courseName')}
                      placeholder="Enter course name"
                      className={`bg-white/5 border-gray-700 text-white ${errors.courseName ? 'border-red-500' : ''}`}
                    />
                    {errors.courseName && (
                      <p className="text-red-500 text-sm mt-1">{errors.courseName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Course Description</label>
                    <TextArea
                      {...register('courseDescription')}
                      placeholder="Enter course description"
                      className={`bg-white/5 border-gray-700 text-white ${errors.courseDescription ? 'border-red-500' : ''}`}
                    />
                    {errors.courseDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.courseDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">What You Will Learn</label>
                    <TextArea
                      {...register('whatYouWillLearn')}
                      placeholder="Enter learning outcomes"
                      className={`bg-white/5 border-gray-700 text-white ${errors.whatYouWillLearn ? 'border-red-500' : ''}`}
                    />
                    {errors.whatYouWillLearn && (
                      <p className="text-red-500 text-sm mt-1">{errors.whatYouWillLearn.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                    <select
                      {...register('categoryId')}
                      className={`w-full p-2 rounded-md bg-white/5 border border-gray-700 text-white ${errors.categoryId ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Enter a tag"
                        className="bg-white/5 border-gray-700 text-white flex-1"
                      />
                      <MovingButton type="button" onClick={handleAddTag}>
                        <IoMdAdd className="w-5 h-5" />
                      </MovingButton>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-white"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-red-500"
                          >
                            <IoMdClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.tag && (
                      <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Instructions</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                        placeholder="Enter an instruction"
                        className="bg-white/5 border-gray-700 text-white flex-1"
                      />
                      <MovingButton type="button" onClick={handleAddInstruction}>
                        <IoMdAdd className="w-5 h-5" />
                      </MovingButton>
                    </div>
                    <div className="space-y-2">
                      {instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white/10 p-2 rounded-md text-white"
                        >
                          <span>{instruction}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInstruction(index)}
                            className="text-red-500"
                          >
                            <IoMdClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.instructions && (
                      <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
                    )}
                  </div>

                  <div className="flex justify-between pt-6">
                    <MovingButton type="submit">
                      Update Course Details
                    </MovingButton>
                    <MovingButton 
                      type="button"
                      onClick={skipToSubsections}
                      variant="outline"
                    >
                      Skip to Content
                    </MovingButton>
                  </div>
                </form>
              )}

              {currentStep === 2 && (
                <div>
                  <SectionCreator 
                    courseId={params.courseId} 
                    onComplete={() => setCurrentStep(3)} 
                  />
                  <div className="flex justify-end mt-4">
                    <MovingButton 
                      onClick={skipToSubsections}
                      variant="outline"
                    >
                      Skip to Content
                    </MovingButton>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <SubSectionCreator 
                    courseId={params.courseId} 
                    onComplete={skipToReview} 
                  />
                  <div className="flex justify-end mt-4">
                    <MovingButton 
                      onClick={skipToReview}
                      variant="outline"
                    >
                      Skip to Review
                    </MovingButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 