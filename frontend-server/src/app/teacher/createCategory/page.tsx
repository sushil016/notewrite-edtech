"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MovingButton } from "@/components/ui/moving-border";
import { Input } from "@/components/ui/input";
import TextArea from "@/components/ui/textArea";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Array<{ id: string; name: string; description: string }>>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/categories/all');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && user?.accountType === 'STUDENT') {
      router.push('/');
      return;
    }

    if (user?.accountType === 'TEACHER') {
      fetchCategories();
    }
  }, [isLoading, isAuthenticated, router, user]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const response = await axiosInstance.post('/api/v1/categories/create', data);
      toast.success('Category created successfully');
      reset();
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating category');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 pt-20 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <MovingButton onClick={() => router.push('/teacher/createCourse')}>
            Create New Course
          </MovingButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category Creation Form */}
          <div className="bg-black p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name</label>
                <Input
                  {...register('name')}
                  placeholder="Enter category name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <TextArea
                  {...register('description')}
                  placeholder="Enter category description"
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <MovingButton type="submit">
                Create Category
              </MovingButton>
            </form>
          </div>

          {/* Existing Categories */}
          <div className="bg-black p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg"
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-gray-500">No categories created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 