'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MovingButton } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import TextArea from '@/components/ui/textArea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

// Your existing course creation form code goes here
// Make sure to use axiosInstance for API calls

export default function CreateCourseForm() {
  // Implementation of your course creation form
  return (
    <div>
      {/* Your course creation form JSX */}
    </div>
  );
} 