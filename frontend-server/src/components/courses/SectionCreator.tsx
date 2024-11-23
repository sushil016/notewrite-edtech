'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border'
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { LoadingButton } from '../ui/loading-button';

const sectionSchema = z.object({
  sectionName: z.string().min(3, 'Section name must be at least 3 characters'),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionCreatorProps {
  courseId: string;
  onComplete: () => void;
}

export function SectionCreator({ courseId, onComplete }: SectionCreatorProps) {
  const [sections, setSections] = useState<Array<{ id: string; sectionName: string }>>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema)
  });
  useEffect(() => {
    console.log('actionLoading:', actionLoading);
  }, [actionLoading]);

  const onSubmit = async (data: SectionFormData) => {
    try {
      const response = await axiosInstance.post('/sections/create', {
        ...data,
        courseId
      });

      setSections([...sections, response.data.data]);
      reset();
      toast.success('Section created successfully');
    } catch (error) {
      toast.error('Error creating section');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Create Course Sections</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Section Name</label>
          <Input
            {...register('sectionName')}
            placeholder="Enter section name"
            className={`bg-white/5 border-gray-700 text-white ${errors.sectionName ? 'border-red-500' : ''}`}
          />
          {errors.sectionName && (
            <p className="text-red-500 text-sm mt-1">{errors.sectionName.message}</p>
          )}
        </div>

        <LoadingButton type="submit"
        isLoading={actionLoading === 'section'}
        loadingText="Adding..."
        >Add Section</LoadingButton>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 text-white">Added Sections</h3>
        {sections.map((section) => (
          <div
            key={section.id}
            className="p-4 border border-gray-700 rounded-lg mb-3 flex justify-between items-center bg-white/5 text-white"
          >
            <span>{section.sectionName}</span>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={() => {
                // Handle edit section
              }}
            >
              Edit
            </LoadingButton>
          </div>
        ))}
      </div>

      {sections.length > 0 && (
        <LoadingButton
          onClick={onComplete}
          className="mt-6"
          isLoading={actionLoading === 'continue'}
          loadingText="Continuing..."
        >
          Continue to Add Content
        </LoadingButton>
      )}
    </div>
  );
} 