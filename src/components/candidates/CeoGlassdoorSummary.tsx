import React from 'react';
import { ThumbsUp, TrendingUp, Star } from 'lucide-react';
import { CeoGlassdoorSummary } from '../../types/database.types';

interface CeoGlassdoorSummaryProps {
  summary: CeoGlassdoorSummary;
}

const CeoGlassdoorSummary: React.FC<CeoGlassdoorSummaryProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.total_reviews}</p>
          </div>
          <Star className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.average_rating.toFixed(1)}</p>
          </div>
          <Star className="h-8 w-8 text-yellow-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">CEO Approval</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.approval_percentage}%</p>
          </div>
          <ThumbsUp className="h-8 w-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Positive Outlook</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.positive_outlook_percentage}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
      </div>
    </div>
  );
};

export default CeoGlassdoorSummary;