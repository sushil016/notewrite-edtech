'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border'
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { FaFileUpload } from 'react-icons/fa';

const subSectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  timeDuration: z.string().min(1, 'Duration is required'),
  video: z.any().refine((file) => file?.length === 1, 'Video file is required'),
  notes: z.any().optional()
});

type SubSectionFormData = z.infer<typeof subSectionSchema>;

interface SubSectionCreatorProps {
  courseId: string;
  onComplete: () => void;
}

export function SubSectionCreator({ courseId, onComplete }: SubSectionCreatorProps) {
  const [sections, setSections] = useState<Array<{ id: string; sectionName: string }>>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubSectionFormData>({
    resolver: zodResolver(subSectionSchema)
  });

  const router = useRouter();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/sections/course/${courseId}`);
        setSections(response.data.data);
      } catch (error) {
        toast.error('Error fetching sections');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  const onSubmit = async (data: SubSectionFormData) => {
    try {
      if (!selectedSection) {
        toast.error('Please select a section');
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('timeDuration', data.timeDuration);
      formData.append('sectionId', selectedSection);
      formData.append('video', data.video[0]);
      
      if (data.notes?.[0]) {
        formData.append('notes', data.notes[0]);
      }

      const response = await axiosInstance.post('/subsections/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        reset();
        toast.success('Subsection created successfully');
      }
    } catch (error) {
      toast.error('Error creating subsection');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading sections...</div>;
  }

  if (sections.length === 0) {
    return (
      <div className="text-center text-white">
        <p>No sections found. Please create a section first.</p>
        <MovingButton onClick={() => window.history.back()} className="mt-4">
          Go Back
        </MovingButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Add Course Content</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">Select Section</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full p-2 rounded-md bg-white/5 border border-gray-700 text-white"
        >
          <option value="">Select a section</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.sectionName}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            {...register('title')}
            placeholder="Enter subsection title"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <TextArea
            {...register('description')}
            placeholder="Enter subsection description"
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (in minutes)</label>
          <Input
            type="number"
            {...register('timeDuration')}
            placeholder="Enter duration"
            className={errors.timeDuration ? 'border-red-500' : ''}
          />
          {errors.timeDuration && (
            <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video</label>
          <Input
            type="file"
            accept="video/*"
            {...register('video')}
            className={errors.video ? 'border-red-500' : ''}
          />
          {errors.video && (
            <p className="text-red-500 text-sm mt-1">{errors.video.message?.toString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Lecture Notes (PDF) <span className="text-gray-400 text-xs">Optional</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf"
              {...register('notes')}
              className="flex-1"
            />
            <FaFileUpload className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Upload lecture notes in PDF format (max 10MB)
          </p>
        </div>

        <div className="flex justify-between">
          <MovingButton type="submit">Add Subsection</MovingButton>
          <MovingButton 
            type="button" 
            onClick={() => router.push(`/teacher/courses/${courseId}/review`)} 
            variant="outline"
          >
            Review Course
          </MovingButton>
        </div>
      </form>
    </div>
  );
} 