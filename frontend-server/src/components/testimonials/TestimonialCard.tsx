import { Testimonial } from '@/types/testimonial';
import { StarRating } from '@/components/common/StarRating';
import Image from 'next/image';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
  <div className="w-80 flex-shrink-0 mx-2">
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold text-blue-300">{testimonial.name}</h3>
            <p className="text-sm text-gray-400">{testimonial.course}</p>
          </div>
        </div>
        <p className="text-gray-300 mb-4 text-sm italic">{testimonial.quote}</p>
      </div>
      <StarRating rating={testimonial.rating} size="sm" />
    </div>
  </div>
);