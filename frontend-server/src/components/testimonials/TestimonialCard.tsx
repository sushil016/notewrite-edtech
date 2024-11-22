import Image from 'next/image';
import { Testimonial } from '@/types/testimonial';
import { StarRating } from '../common/StarRating';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-xl">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-4">
          <Image
            src={testimonial.image || '/assets/default-avatar.png'}
            alt={`${testimonial.name}'s profile`}
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12"
            priority
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
          <p className="text-sm text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      <StarRating rating={testimonial.rating} />
      <p className="mt-4 text-gray-300">{testimonial.comment}</p>
    </div>
  );
};

export default TestimonialCard;