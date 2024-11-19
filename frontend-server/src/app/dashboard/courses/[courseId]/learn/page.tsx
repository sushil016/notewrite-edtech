'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaVideo, FaChevronDown, FaChevronUp, FaCheck, FaLock, FaFileUpload, FaFilePdf } from 'react-icons/fa';
import { Course, Section, SubSection } from '@/types/course';
import { Progress } from '@/components/ui/progress';
import { MovingButton } from '@/components/ui/moving-border';

interface CourseProgress {
  completedVideos: string[];
  totalVideos: number;
}

export default function LearnPage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<SubSection | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<CourseProgress>({ completedVideos: [], totalVideos: 0 });
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${params.courseId}/learn`);
      const courseData = response.data.data;
      console.log('Course Data:', courseData);
      
      if (courseData.sections?.[0]?.subSections?.[0]) {
        console.log('First subsection notes:', courseData.sections[0].subSections[0].notesUrls);
      }
      
      setCourse(courseData);
      
      if (!currentVideo && courseData.sections?.[0]?.subSections?.[0]) {
        const firstSubSection = courseData.sections[0].subSections[0];
        console.log('Setting current video with notes:', firstSubSection.notesUrls);
        setCurrentVideo(firstSubSection);
        setExpandedSections(new Set([courseData.sections[0].id]));
      }
    } catch (error) {
      toast.error('Error fetching course details');
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  }, [params.courseId, currentVideo]);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${params.courseId}/progress`);
      setProgress(response.data.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [params.courseId]);

  useEffect(() => {
    fetchCourseDetails();
    fetchProgress();
  }, [fetchCourseDetails, fetchProgress]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleVideoEnd = async () => {
    try {
      if (currentVideo) {
        await axiosInstance.post(`/api/v1/courses/${params.courseId}/complete-video`, {
          subSectionId: currentVideo.id
        });
        await fetchProgress();
        toast.success('Progress updated!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const isVideoCompleted = (subSectionId: string) => {
    return progress.completedVideos.includes(subSectionId);
  };

  const handleNoteClick = (noteUrl: string) => {
    // Open note in new tab
    window.open(noteUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading your course...</div>
        </div>
      </div>
    );
  }

  if (!course || !course.sections) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500">Course not found</div>
        </div>
      </div>
    );
  }

  const progressPercentage = (progress.completedVideos.length / progress.totalVideos) * 100;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex h-screen pt-20">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-4">{course.courseName}</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Course Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              {course.sections.map((section) => (
                <div key={section.id} className="mb-2">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex justify-between items-center p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <span className="text-white font-medium">{section.sectionName}</span>
                    {expandedSections.has(section.id) ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) && (
                    <div className="ml-4 mt-2 space-y-2">
                      {section.subSections.map((subSection) => (
                        <button
                          key={subSection.id}
                          onClick={() => setCurrentVideo(subSection)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                            currentVideo?.id === subSection.id
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'hover:bg-gray-800/50 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FaVideo className="w-4 h-4" />
                            <div className="text-left">
                              <span className="text-sm">{subSection.title}</span>
                              {subSection.notesUrls?.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-blue-400">
                                  <FaFileUpload className="w-3 h-3" />
                                  <span>{subSection.notesUrls.length} Notes</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isVideoCompleted(subSection.id) ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaLock className="text-gray-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {currentVideo ? (
              <div className="p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    controls
                    className="w-full h-full"
                    onEnded={handleVideoEnd}
                  />
                </div>
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold text-white mb-4">{currentVideo.title}</h2>
                  <p className="text-gray-300 mb-6">{currentVideo.description}</p>
                  
                  {currentVideo?.notesUrls && currentVideo.notesUrls.length > 0 ? (
                    <div className="mb-6 bg-white/5 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Lecture Notes</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentVideo.notesUrls.map((noteUrl, index) => (
                          <button
                            key={index}
                            onClick={() => handleNoteClick(noteUrl)}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-blue-400 hover:text-blue-300"
                          >
                            <FaFilePdf className="w-5 h-5" />
                            <div>
                              <span className="font-medium">Note {index + 1}</span>
                              <p className="text-xs text-gray-400">Click to view PDF</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Duration: {currentVideo.timeDuration} minutes
                    </div>
                    {isVideoCompleted(currentVideo.id) && (
                      <div className="flex items-center text-green-500">
                        <FaCheck className="mr-2" />
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl text-gray-400 mb-4">Select a lesson to start learning</h3>
                  <MovingButton onClick={() => {
                    if (course?.sections?.[0]?.subSections?.[0]) {
                      setCurrentVideo(course.sections[0].subSections[0]);
                    }
                  }}>
                    Start First Lesson
                  </MovingButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 