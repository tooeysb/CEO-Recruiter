import React from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from 'lucide-react';
import { CeoReview } from '../../types/database.types';
import { formatDate } from '../../lib/utils';
import Badge from '../ui/Badge';

interface CeoReviewsProps {
  reviews: CeoReview[];
}

const CeoReviews: React.FC<CeoReviewsProps> = ({ reviews }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pros
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cons
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recommends
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outlook
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reviews.map((review) => (
            <tr key={review.review_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(review.review_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'danger'}>
                  {review.rating.toFixed(1)}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {review.review_title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {review.reviewer_role || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {review.pros || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {review.cons || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {review.recommend !== null && (
                  <span className="flex items-center">
                    {review.recommend ? (
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {review.business_outlook && (
                  <span className="flex items-center">
                    {review.business_outlook.toLowerCase() === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CeoReviews;