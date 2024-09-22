import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
      />
    ))}
    {size === 'md' && <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>}
  </div>
);