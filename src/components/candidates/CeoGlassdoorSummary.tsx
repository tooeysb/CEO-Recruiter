import React from 'react';
import { ThumbsUp, TrendingUp, Star, BarChart2 } from 'lucide-react';
import { CeoGlassdoorSummary as CeoGlassdoorSummaryType } from '../../types/database.types';

interface CeoGlassdoorSummaryProps {
  summary: CeoGlassdoorSummaryType;
}

const CeoGlassdoorSummaryComponent: React.FC<CeoGlassdoorSummaryProps> = ({ summary }) => {
  return (
    <div className="space-y-4">
      {/* CEO Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 mb-2">CEO Information</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <ThumbsUp className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <span className="text-sm text-gray-700">CEO: </span>
              <span className="text-sm font-semibold text-gray-700">{summary.ceo_name}</span>
            </div>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <span className="text-sm text-gray-700">CEO Approval: </span>
              <span className="text-sm font-semibold text-gray-700">{summary.ceo_approval_rate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main metrics (stacked vertically) */}
      <div className="space-y-2">
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
              <p className="text-sm text-gray-500">Overall Rating</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.overall_rating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">CEO Approval</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.ceo_approval_rate}%</p>
            </div>
            <ThumbsUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Positive Outlook</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.business_outlook_positive}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Category ratings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 mb-3">Ratings by Category</h3>
        <div className="space-y-3">
          <CategoryRating name="Culture & Values" value={summary.culture_and_values} />
          <CategoryRating name="Diversity & Inclusion" value={summary.diversity_equity_inclusion} />
          <CategoryRating name="Work/Life Balance" value={summary.work_life_balance} />
          <CategoryRating name="Senior Management" value={summary.senior_management} />
          <CategoryRating name="Compensation & Benefits" value={summary.compensation_and_benefits} />
          <CategoryRating name="Career Opportunities" value={summary.career_opportunities} />
        </div>
      </div>

      {/* Ratings Distribution */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-gray-800 mb-3">Ratings Distribution</h3>
        <div className="space-y-3">
          <StarDistribution label="5 stars" percentage={summary.five_star_percentage} />
          <StarDistribution label="4 stars" percentage={summary.four_star_percentage} />
          <StarDistribution label="3 stars" percentage={summary.three_star_percentage} />
          <StarDistribution label="2 stars" percentage={summary.two_star_percentage} />
          <StarDistribution label="1 star" percentage={summary.one_star_percentage} />
        </div>
      </div>

      {/* Recommendation rate info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="text-xl font-medium text-gray-900">{summary.recommendation_rate}%</div>
          <div className="ml-2 text-md text-gray-600">would recommend to a friend</div>
        </div>
        <div className="mt-2 text-sm text-gray-500">Based on {summary.total_reviews} reviews</div>
      </div>
    </div>
  );
};

// Helper component for category ratings
const CategoryRating: React.FC<{ name: string; value: number }> = ({ name, value }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm text-gray-700">{name}</span>
      <span className="text-sm font-semibold text-gray-700">{value.toFixed(1)}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-green-500 h-2 rounded-full" 
        style={{ width: `${Math.min(value / 5 * 100, 100)}%` }}
      ></div>
    </div>
  </div>
);

// Helper component for star distribution
const StarDistribution: React.FC<{ label: string; percentage: number }> = ({ label, percentage }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default CeoGlassdoorSummaryComponent;