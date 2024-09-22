import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Testimonial } from '@/types/testimonial';
import { TestimonialCard } from './TestimonialCard';
import { Button } from '@/components/common/Button';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollWidth = (testimonials?.length || 0) * 320; // Adjust based on your card width

  useEffect(() => {
    controls.start({
      x: [-scrollWidth, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    });
  }, [controls, scrollWidth]);

  useEffect(() => {
    if (isHovered) {
      controls.stop();
    } else {
      controls.start({
        x: [-scrollWidth, 0],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        },
      });
    }
  }, [isHovered, controls, scrollWidth]);

  if (testimonials.length === 0) {
    return (
      <section className="py-12 bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-300">What Our Students Say</h2>
          <p>No testimonials available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12  text-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-300">What Our Students Say</h2>
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex"
            animate={controls}
            style={{ width: `${scrollWidth * 2}px` }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
        <div className="text-center mt-8">
          <Button>View All Reviews</Button>
        </div>
      </div>
    </section>
  );
};