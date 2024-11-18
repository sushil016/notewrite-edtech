'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border'
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CourseCreationStepper } from '@/components/courses/CourseCreationStepper';
import { SectionCreator } from '@/components/courses/SectionCreator';
import { SubSectionCreator } from '@/components/courses/SubSectionCreator';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

// Form validation schema
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

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/all');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.data);
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
      const response = await fetch('/api/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const result = await response.json();
      setCourseId(result.data.id);
      toast.success('Course created successfully');
      setCurrentStep(2);
    } catch (error) {
      toast.error('Error creating course');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <CourseCreationStepper currentStep={currentStep} />
      
      {currentStep === 1 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Course Name</label>
            <Input
              {...register('courseName')}
              placeholder="Enter course name"
              className={errors.courseName ? 'border-red-500' : ''}
            />
            {errors.courseName && (
              <p className="text-red-500 text-sm mt-1">{errors.courseName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Course Description</label>
            <TextArea
              {...register('courseDescription')}
              placeholder="Enter course description"
              className={errors.courseDescription ? 'border-red-500' : ''}
            />
            {errors.courseDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.courseDescription.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What You Will Learn</label>
            <TextArea
              {...register('whatYouWillLearn')}
              placeholder="Enter learning outcomes"
              className={errors.whatYouWillLearn ? 'border-red-500' : ''}
            />
            {errors.whatYouWillLearn && (
              <p className="text-red-500 text-sm mt-1">{errors.whatYouWillLearn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              {...register('categoryId')}
              className={`w-full p-2 border rounded-md ${errors.categoryId ? 'border-red-500' : ''}`}
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
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter a tag"
                className="flex-1"
              />
              <MovingButton type="button" onClick={handleAddTag}>
                <IoMdAdd className="w-5 h-5" />
              </MovingButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
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
            <label className="block text-sm font-medium mb-2">Instructions</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Enter an instruction"
                className="flex-1"
              />
              <MovingButton type="button" onClick={handleAddInstruction}>
                <IoMdAdd className="w-5 h-5" />
              </MovingButton>
            </div>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
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

          <MovingButton type="submit" className="w-full">
            Create Course & Continue
          </MovingButton>
        </form>
      )}

      {currentStep === 2 && courseId && (
        <div className="max-w-2xl mx-auto">
          <SectionCreator courseId={courseId} onComplete={() => setCurrentStep(3)} />
        </div>
      )}

      {currentStep === 3 && courseId && (
        <div className="max-w-2xl mx-auto">
          <SubSectionCreator courseId={courseId} onComplete={() => router.push('/teacher/courses')} />
        </div>
      )}
    </div>
  );
}
