import React, { useState, useEffect } from 'react';
import {
  Users, 
  GitPullRequest, 
  Star, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  ThumbsUp, 
  ThumbsDown, 
  UserX 
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import MetricsCard from '../components/dashboard/MetricsCard';
import Pipeline from '../components/candidates/Pipeline';
import { supabase } from '../lib/supabase';
import { Candidate } from '../types/database.types';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import { formatDate } from '../lib/utils';

const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch candidates
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('candidates')
          .select('*');
          
        if (candidatesError) throw candidatesError;
        setCandidates(candidatesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidates')
        .update({ update_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', candidateId);
        
      if (error) throw error;
      
      // Update local state
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, update_status: newStatus, updated_at: new Date().toISOString() }
            : candidate
        )
      );
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };
  
  // Calculate metrics
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => !c.disqualified).length;
  const disqualifiedCandidates = candidates.filter(c => c.disqualified).length;
  const hungryCandidates = candidates.filter(c => c.hungry).length;
  const humbleCandidates = candidates.filter(c => c.humble).length;
  const smartCandidates = candidates.filter(c => c.smart).length;
  const ceoExperienceCandidates = candidates.filter(c => c.previous_ceo_experience).length;
  const globalCandidates = candidates.filter(c => c.global_experience).length;

  // Maximum value for scaling
  const maxAttributeValue = totalCandidates;
  
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your recruiting pipeline and metrics"
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard 
            title="Total Candidates" 
            value={totalCandidates} 
            icon={<Users size={24} />} 
            change={15}
            changeText="from last month"
          />
          
          <MetricsCard 
            title="Active Candidates" 
            value={activeCandidates} 
            icon={<GitPullRequest size={24} />} 
            change={8}
            changeText="from last month"
          />
          
          <MetricsCard 
            title="Disqualified" 
            value={disqualifiedCandidates} 
            icon={<UserX size={24} />} 
            change={-3}
            changeText="from last month"
          />
          
          <MetricsCard 
            title="CEO?" 
            value={ceoExperienceCandidates} 
            icon={<Star size={24} />} 
            change={5}
            changeText="from last month"
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Candidate Pipeline</h2>
          <Pipeline candidates={candidates} onStatusChange={handleStatusChange} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Candidate Attributes</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-24">
                    <ThumbsUp className="text-blue-500 mr-2" size={20} />
                    <span>Hungry</span>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(hungryCandidates / maxAttributeValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{hungryCandidates}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-24">
                    <ThumbsUp className="text-blue-500 mr-2" size={20} />
                    <span>Humble</span>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(humbleCandidates / maxAttributeValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{humbleCandidates}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-24">
                    <ThumbsUp className="text-blue-500 mr-2" size={20} />
                    <span>Smart</span>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(smartCandidates / maxAttributeValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{smartCandidates}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-24">
                    <Star className="text-amber-500 mr-2" size={20} />
                    <span>CEO?</span>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-amber-500 h-2.5 rounded-full" 
                      style={{ width: `${(ceoExperienceCandidates / maxAttributeValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{ceoExperienceCandidates}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-24">
                    <Clock className="text-indigo-500 mr-2" size={20} />
                    <span>Global?</span>
                  </div>
                  <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-500 h-2.5 rounded-full" 
                      style={{ width: `${(globalCandidates / maxAttributeValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">{globalCandidates}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin mx-auto h-8 w-8 border-2 border-gray-200 rounded-full border-t-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading recent activity...</p>
                  </div>
                ) : candidates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity to display</p>
                ) : (
                  candidates
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .slice(0, 5)
                    .map((candidate) => (
                      <div key={candidate.id} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          candidate.disqualified ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {candidate.disqualified ? <ThumbsDown size={16} /> : <ThumbsUp size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-xs text-gray-500">
                            Status updated to <span className="font-medium">{candidate.update_status}</span>
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(candidate.updated_at, 'PPpp')}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;