'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { FaFileUpload, FaTrash } from 'react-icons/fa';

const updateSubSectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  timeDuration: z.string().min(1, 'Duration is required'),
  video: z.any().optional(),
  notes: z.any().optional()
});

interface UpdateSubSectionProps {
  subSection: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    notesUrls: string[];
    timeDuration: string;
  };
  onComplete: () => void;
}

export function UpdateSubSection({ subSection, onComplete }: UpdateSubSectionProps) {
  const [existingNotes, setExistingNotes] = useState<string[]>(subSection.notesUrls || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(updateSubSectionSchema),
    defaultValues: {
      title: subSection.title,
      description: subSection.description,
      timeDuration: subSection.timeDuration
    }
  });

  const handleDeleteNote = async (noteUrl: string) => {
    try {
      await axiosInstance.delete(`/api/v1/subsections/${subSection.id}/notes`, {
        data: { noteUrl }
      });
      setExistingNotes(prev => prev.filter(url => url !== noteUrl));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Error deleting note');
      console.error(error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('timeDuration', data.timeDuration);
      
      if (data.video?.[0]) {
        formData.append('video', data.video[0]);
      }
      
      // Handle multiple PDF files
      if (data.notes) {
        Array.from(data.notes).forEach((file: File) => {
          formData.append('notes', file);
        });
      }

      const response = await axiosInstance.put(`/api/v1/subsections/${subSection.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Subsection updated successfully');
        onComplete();
      }
    } catch (error) {
      toast.error('Error updating subsection');
      console.error(error);
    }
  };

  return (
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
        <label className="block text-sm font-medium mb-2">Update Video (Optional)</label>
        <Input
          type="file"
          accept="video/*"
          {...register('video')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Add More Notes (PDF)
        </label>
        <Input
          type="file"
          accept=".pdf"
          multiple
          {...register('notes')}
        />
        <p className="text-xs text-gray-400 mt-1">
          You can select multiple PDF files
        </p>
      </div>

      {existingNotes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Existing Notes</h4>
          <div className="space-y-2">
            {existingNotes.map((noteUrl, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <a 
                  href={noteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Note {index + 1}
                </a>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(noteUrl)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <MovingButton type="submit">
          Update Subsection
        </MovingButton>
      </div>
    </form>
  );
} 