'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { CourseCreationStepper } from './CourseCreationStepper';
import { SectionCreator } from './SectionCreator';
import { SubSectionCreator } from './SubSectionCreator';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import axiosInstance from '@/lib/axios';
import { LoadingButton } from '../ui/loading-button';

const courseSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters'),
  courseDescription: z.string().min(10, 'Description must be at least 10 characters'),
  whatYouWillLearn: z.string().min(10, 'Learning outcomes must be at least 10 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  categoryId: z.string().min(1, 'Category is required'),
  tag: z.array(z.string()).min(1, 'At least one tag is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required')
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Category {
  id: string;
  name: string;
}

export default function CreateCourseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const existingCourseId = searchParams.get('courseId');

  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  useEffect(() => {
    console.log('actionLoading:', actionLoading);
  }, [actionLoading]);


  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });

  useEffect(() => {
    if (existingCourseId) {
      setCourseId(existingCourseId);
      setCurrentStep(Number(step) || 1);
    }
  }, [existingCourseId, step]);

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories/all');
        setCategories(response.data.data);
      } catch (error) {
        toast.error('Error fetching categories');
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  // Update form values when tags or instructions change
  useEffect(() => {
    setValue('tag', tags);
    setValue('instructions', instructions);
  }, [tags, instructions, setValue]);

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
      // Format the data to match the expected structure
      const formattedData = {
        ...data,
        tag: tags, // Use the tags array directly
        instructions: instructions // Use the instructions array directly
      };

      const response = await axiosInstance.post('/courses/create', formattedData);
      
      if (response.data.success) {
        toast.success('Course created successfully');
        setCourseId(response.data.data.id);
        setCurrentStep(2);
      }
    } catch (error) {
      toast.error('Error creating course');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <CourseCreationStepper currentStep={currentStep} />
        
        {currentStep === 1 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Course</h2>
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
                <label className="block text-sm font-medium text-gray-200 mb-2">Course Price (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="Enter course price (0 for free course)"
                  className={`bg-white/5 border-gray-700 text-white ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
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
                  <LoadingButton type="button" 
                  isLoading={actionLoading === 'tag'}
                  loadingText="Adding..."
                  onClick={handleAddTag}>
                    <IoMdAdd className="w-5 h-5" />
                  </LoadingButton>
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
                  <LoadingButton type="button" 
                  isLoading={actionLoading === 'instruction'}
                  loadingText="Adding..."
                  onClick={handleAddInstruction}>
                    <IoMdAdd className="w-5 h-5" />
                  </LoadingButton>
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

              <div className="pt-6">
                <LoadingButton type="submit" className="w-full"
                isLoading={actionLoading === 'submit'}
                loadingText="Submitting..."
                >
                  Continue to Sections
                </LoadingButton>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && courseId && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <SectionCreator courseId={courseId} onComplete={() => setCurrentStep(3)} />
          </div>
        )}

        {currentStep === 3 && courseId && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <SubSectionCreator courseId={courseId} onComplete={() => router.push('/teacher/courses')} />
          </div>
        )}
      </div>
    </div>
  );
} 