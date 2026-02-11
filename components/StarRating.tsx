import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, count, size = 16, showCount = true }) => {
  return (
    <div className="flex items-center">
      <Star size={size} className="text-amber-400 fill-current" />
      <span className={`ml-1 font-bold text-slate-900 text-${size > 16 ? 'base' : 'sm'}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="ml-1 text-slate-500 text-xs">({count})</span>
      )}
    </div>
  );
};
