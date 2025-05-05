import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageSquare, MapPin } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

interface GlassdoorReviewsProps {
  candidateId: string;
  employmentIds: string[];
}

const GlassdoorReviews = ({ candidateId, employmentIds }: GlassdoorReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch reviews from Glassdoor
        const { data, error } = await supabase
          .from('glassdoor_reviews')
          .select();
        
        if (error) {
          setError(`Error fetching reviews: ${error.message}`);
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setError('No reviews found in the database.');
        }
      } catch (err) {
        setError(`An error occurred while fetching reviews.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [candidateId, employmentIds, refreshCounter]);
  
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">Glassdoor Reviews</h2>
      </CardHeader>
      <CardContent>
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center p-4 mb-4 border-b">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            <span>Loading Glassdoor reviews...</span>
          </div>
        )}
        
        {/* Error state */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <p className="text-sm">Error: {error}</p>
          </div>
        )}
        
        {/* Reviews */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition">
                {/* Review Header */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900 text-lg mb-1">{review.review_title || 'Employee Review'}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {renderStarRating(review.review_rating || 0)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.review_rating?.toFixed(1) || 'No rating'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 space-y-1 sm:space-y-0 sm:space-x-3">
                    {review.review_date && (
                      <div className="flex items-center">
                        <span className="font-medium">Date:</span>
                        <span className="ml-1">{formatDate(review.review_date)}</span>
                      </div>
                    )}
                    
                    {review.role && (
                      <div className="flex items-center">
                        <span className="font-medium">Position:</span>
                        <span className="ml-1">{review.role}</span>
                      </div>
                    )}
                    
                    {review.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{review.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Review Content */}
                <div className="space-y-4">
                  {review.pros && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-600 uppercase mb-1 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Pros
                      </h4>
                      <p className="text-sm text-gray-700 bg-green-50 p-3 rounded">{review.pros}</p>
                    </div>
                  )}
                  
                  {review.cons && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 uppercase mb-1 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1 transform rotate-180" />
                        Cons
                      </h4>
                      <p className="text-sm text-gray-700 bg-red-50 p-3 rounded">{review.cons}</p>
                    </div>
                  )}
                </div>
                
                {/* Review Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    {review.helpful_count > 0 && (
                      <div className="flex items-center mr-3">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span>{review.helpful_count} found helpful</span>
                      </div>
                    )}
                  </div>
                  
                  {review.review_link && (
                    <a
                      href={review.review_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center"
                    >
                      <span>View on Glassdoor</span>
                      <MessageSquare className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && reviews.length === 0 && (
          <EmptyState
            icon={Star}
            title="No Glassdoor reviews"
            description="No Glassdoor reviews are available for this candidate."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GlassdoorReviews; 