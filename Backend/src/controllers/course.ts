import { Response } from 'express';
import { PrismaClient, CourseStatus } from '@prisma/client';
import { AuthRequest } from '../types/express';
import { sendMail } from '../utils/mailSender';
import { prisma } from '../app';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

interface CreateCourseRequest {
    courseName: string;
    courseDescription: string;
    whatYouWillLearn: string;
    price: number;
    tag: string[];
    categoryId: string;
    instructions: string[];
}

type CourseAuthRequest = AuthRequest & { body: CreateCourseRequest };

export const createCourse = async (req: CourseAuthRequest, res: Response): Promise<void> => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag, categoryId, instructions } = req.body;
        const userId = req.user.id;

        if (!courseName || !courseDescription || !whatYouWillLearn || !categoryId) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }

        const tagArray = Array.isArray(tag) ? tag : [tag];
        const instructionsArray = Array.isArray(instructions) ? instructions : [instructions];

        const coursePrice = typeof price === 'string' ? parseFloat(price) : price;

        const course = await prisma.course.create({
            data: {
                courseName,
                courseDescription,
                whatYouWillLearn,
                price: coursePrice,
                tag: tagArray,
                instructions: instructionsArray,
                teacher: {
                    connect: { id: userId }
                },
                category: {
                    connect: { id: categoryId }
                }
            },
            include: {
                teacher: true,
                category: true
            }
        });

        // Send email notification
        await sendMail({
            email: req.user.email,
            subject: "Course Created Successfully",
            text: `Your course ${courseName} has been created successfully.`
        });

        res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: course
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating course"
        });
    }
};

export const getTeacherCourses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const teacherId = req.user.id;

        const courses = await prisma.course.findMany({
            where: {
                teacherId
            },
            include: {
                sections: {
                    include: {
                        subSections: true
                    }
                },
                category: true,
                students: true
            }
        });

        console.log('Found courses:', courses);

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error in getTeacherCourses:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses"
        });
    }
};

// Update the request type for getCourseDetails
type CourseDetailsRequest = AuthRequest & { params: { courseId: string } };

export const getCourseDetails = async (req: CourseDetailsRequest, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const teacherId = req.user.id;

        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                teacherId
            },
            include: {
                sections: {
                    include: {
                        subSections: true
                    }
                },
                category: true,
                students: true
            }
        });

        if (!course) {
            res.status(404).json({
                success: false,
                message: "Course not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching course details"
        });
    }
};

interface PublishCourseRequest extends AuthRequest {
  params: {
    courseId: string;
  };
}

export const publishCourse = async (req: PublishCourseRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    console.log('Publishing course:', { courseId, teacherId });

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId,
      },
      include: {
        sections: {
          include: {
            subSections: true,
          },
        },
      },
    });

    if (!course) {
      console.log('Course not found:', { courseId, teacherId });
      res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
      return;
    }

    // Verify that course has at least one section and each section has at least one subsection
    const isComplete = course.sections.length > 0 && 
      course.sections.every(section => section.subSections.length > 0);

    if (!isComplete) {
      res.status(400).json({
        success: false,
        message: "Course must have at least one section with content before publishing",
      });
      return;
    }

    // Update course status to published
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { status: 'PUBLISHED' },
    });

    // Send email notification
    await sendMail({
      email: req.user.email,
      subject: "Course Published Successfully",
      text: `Your course ${course.courseName} has been published successfully.`,
    });

    res.status(200).json({
      success: true,
      message: "Course published successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error('Error in publishCourse:', error);
    res.status(500).json({
      success: false,
      message: "Error publishing course",
    });
  }
};

interface UpdateCourseRequest {
  courseName?: string;
  courseDescription?: string;
  whatYouWillLearn?: string;
  price?: number;
  tag?: string[];
  categoryId?: string;
  instructions?: string[];
}

type UpdateCourseAuthRequest = AuthRequest & { 
  body: UpdateCourseRequest;
  params: { courseId: string };
};

export const updateCourse = async (req: UpdateCourseAuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const updateData = req.body;

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId
      }
    });

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission"
      });
      return;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: {
        category: true,
        teacher: true
      }
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating course"
    });
  }
};

export const getRecentCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        id: 'desc'
      },
      take: 5,
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        category: true
      }
    });

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses"
    });
  }
};

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      status: 'PUBLISHED',
      ...(category && category !== 'All' && {
        category: {
          name: category
        }
      }),
      ...(search && {
        OR: [
          { courseName: { contains: search, mode: 'insensitive' } },
          { courseDescription: { contains: search, mode: 'insensitive' } }
        ] as Prisma.CourseWhereInput['OR']
      })
    };

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          category: true,
          students: true
        },
        orderBy: {
          id: 'desc'
        }
      }),
      prisma.course.count({ where })
    ]);

    const hasMore = totalCount > skip + courses.length;

    res.status(200).json({
      success: true,
      data: courses,
      hasMore,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses"
    });
  }
};

export const getCoursePreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: 'PUBLISHED'
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        category: true,
        sections: {
          include: {
            subSections: {
              select: {
                id: true,
                title: true,
                description: true,
                timeDuration: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course preview:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching course"
    });
  }
};

export const getEnrolledCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const enrolledCourses = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        enrolledCourses: {
          include: {
            teacher: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            category: true,
            sections: {
              include: {
                subSections: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: enrolledCourses?.enrolledCourses || []
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching enrolled courses"
    });
  }
};

export const getCourseLearningDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled in the course
    const enrollment = await prisma.course.findFirst({
      where: {
        id: courseId,
        students: {
          some: {
            id: userId
          }
        }
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        category: true,
        sections: {
          include: {
            subSections: {
              select: {
                id: true,
                title: true,
                description: true,
                videoUrl: true,
                timeDuration: true
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      res.status(404).json({
        success: false,
        message: "Course not found or user not enrolled"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Error fetching course learning details:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching course details"
    });
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Get course progress
    const progress = await prisma.courseProgress.findFirst({
      where: {
        userId,
        courseId
      },
      include: {
        completedVideos: {
          select: {
            id: true
          }
        }
      }
    });

    // Get total videos in course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            subSections: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found"
      });
      return;
    }

    const totalVideos = course.sections.reduce(
      (total, section) => total + section.subSections.length,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        completedVideos: progress?.completedVideos.map(v => v.id) || [],
        totalVideos
      }
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching course progress"
    });
  }
};

interface MarkVideoRequest extends AuthRequest {
  params: { courseId: string };
  body: { subSectionId: string };
}

export const markVideoComplete = async (req: MarkVideoRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { subSectionId } = req.body;
    const userId = req.user.id;

    // Get or create course progress
    let progress = await prisma.courseProgress.findFirst({
      where: {
        userId,
        courseId
      }
    });

    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId
        }
      });
    }

    // Mark video as completed
    await prisma.courseProgress.update({
      where: {
        id: progress.id
      },
      data: {
        completedVideos: {
          connect: {
            id: subSectionId
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Video marked as completed"
    });
  } catch (error) {
    console.error('Error marking video as complete:', error);
    res.status(500).json({
      success: false,
      message: "Error updating progress"
    });
  }
}; 