'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MovingButton } from '@/components/ui/moving-border';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaVideo, FaChevronDown, FaChevronUp, FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SubSection {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  timeDuration: string;
}

interface Section {
  id: string;
  sectionName: string;
  subSections: SubSection[];
}

interface Course {
  id: string;
  courseName: string;
  courseDescription: string;
  whatYouWillLearn: string;
  status: 'DRAFT' | 'PUBLISHED';
  sections: Section[];
  category: {
    name: string;
  };
}

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const video = videoRef.current;
    if (!video) return;

    switch(e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        video.paused ? video.play() : video.pause();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'j':
        video.currentTime -= 10;
        break;
      case 'l':
        video.currentTime += 10;
        break;
      case 'm':
        video.muted = !video.muted;
        break;
      case 'arrowup':
        e.preventDefault();
        video.volume = Math.min(1, video.volume + 0.1);
        break;
      case 'arrowdown':
        e.preventDefault();
        video.volume = Math.max(0, video.volume - 0.1);
        break;
    }
  }, [toggleFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="w-full relative group">
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video 
          ref={videoRef}
          controls 
          className="w-full aspect-video"
          controlsList="nodownload"
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-white">
            <div className="text-sm">
              <p>Keyboard shortcuts:</p>
              <p>Space/K: Play/Pause</p>
              <p>J/L: -/+ 10 seconds</p>
              <p>M: Mute/Unmute</p>
              <p>F: Fullscreen</p>
              <p>↑/↓: Volume</p>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseReview({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourseDetails();
  }, [params.courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${params.courseId}`);
      setCourse(response.data.data);
    } catch (error) {
      toast.error('Error fetching course details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleVideoClick = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  const publishCourse = async () => {
    try {
      console.log('Publishing course:', params.courseId);
      const response = await axiosInstance.put(`/api/v1/courses/${params.courseId}/publish`);
      
      if (response.data.success) {
        toast.success('Course published successfully');
        router.push('/teacher/dashboard');
      } else {
        toast.error(response.data.message || 'Failed to publish course');
      }
    } catch (error: any) {
      console.error('Publish error:', error.response || error);
      toast.error(error.response?.data?.message || 'Error publishing course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Course not found</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-8">{course.courseName}</h1>
            
            <div className="space-y-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Course Description</h2>
                <p className="text-gray-300">{course.courseDescription}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">What You Will Learn</h2>
                <p className="text-gray-300">{course.whatYouWillLearn}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Category</h2>
                <p className="text-gray-300">{course.category.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
              {course.sections.map((section) => (
                <div key={section.id} className="border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-lg font-medium text-white">
                      {section.sectionName} ({section.subSections.length} lectures)
                    </span>
                    {expandedSections.has(section.id) ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) && (
                    <div className="p-4 space-y-3 bg-gray-900/50">
                      {section.subSections.map((subSection) => (
                        <div
                          key={subSection.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <FaVideo className="text-blue-400" />
                            <div>
                              <h3 className="text-white font-medium">{subSection.title}</h3>
                              <p className="text-sm text-gray-400">{subSection.description}</p>
                              <span className="text-xs text-gray-500">Duration: {subSection.timeDuration} minutes</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleVideoClick(subSection.videoUrl, subSection.title)}
                            className="p-2 rounded-full bg-blue-500/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaPlay />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <MovingButton
                onClick={() => router.push(`/teacher/courses/${params.courseId}/edit`)}
                className={course.status === 'PUBLISHED' ? 'hidden' : ''}
              >
                Edit Course
              </MovingButton>
              
              <MovingButton
                onClick={publishCourse}
                disabled={course.status === 'PUBLISHED'}
                className={course.status === 'PUBLISHED' ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {course.status === 'PUBLISHED' ? 'Course Published' : 'Publish Course'}
              </MovingButton>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] bg-gray-900 border-gray-800">
          {selectedVideo && (
            <VideoPlayer 
              videoUrl={selectedVideo.url} 
              title={selectedVideo.title} 
            />
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
} 