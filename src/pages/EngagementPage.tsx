import React, { useState, useEffect } from 'react';
import { Users, CalendarClock, Mail, Phone } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import { supabase } from '../lib/supabase';
import { EngagementDetails, EngagementTeam } from '../types/database.types';
import { formatDate } from '../lib/utils';

const EngagementPage: React.FC = () => {
  const [engagementDetails, setEngagementDetails] = useState<EngagementDetails | null>(null);
  const [engagementTeam, setEngagementTeam] = useState<EngagementTeam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetchEngagementData();
  }, []);
  
  const fetchEngagementData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch engagement details
      const { data: engagementData, error: engagementError } = await supabase
        .from('engagement_details')
        .select('*')
        .order('report_date', { ascending: false })
        .limit(1)
        .single();
        
      if (engagementError && engagementError.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" which is fine
        console.error('Error fetching engagement details:', engagementError);
      } else {
        setEngagementDetails(engagementData);
        
        if (engagementData) {
          // Fetch engagement team
          const { data: teamData, error: teamError } = await supabase
            .from('engagement_team')
            .select('*')
            .eq('engagement_id', engagementData.id)
            .order('name');
            
          if (teamError) throw teamError;
          setEngagementTeam(teamData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading engagement details...</span>
      </div>
    );
  }
  
  if (!engagementDetails) {
    return (
      <div>
        <PageHeader
          title="Engagement"
          description=""
        />
        
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Engagement Found</h3>
            <p className="mt-1 text-gray-500">
              There are no engagement details available. Please create an engagement first.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        title="Engagement Details"
        description=""
      />
      
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Engagement Overview</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Client Company</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{engagementDetails.client_company}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Engagement Timeline</h3>
                  <div className="mt-2">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-between">
                        <div>
                          <span className="bg-white px-3 py-1 text-sm text-gray-500 rounded-full border border-gray-300">
                            Start Date: {formatDate(engagementDetails.created_at)}
                          </span>
                        </div>
                        <div>
                          <span className="bg-white px-3 py-1 text-sm text-gray-500 rounded-full border border-gray-300">
                            Report Date: {formatDate(engagementDetails.report_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Engagement Status</h3>
                  <div className="mt-2 bg-blue-50 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CalendarClock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Engagement is active and in progress
                        </p>
                        <p className="mt-1 text-sm text-blue-700">
                          Last updated on {formatDate(engagementDetails.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Engagement Team</h2>
              </CardHeader>
              <CardContent>
                {engagementTeam.length === 0 ? (
                  <p className="text-sm text-gray-500">No team members assigned to this engagement.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {engagementTeam.map((member) => (
                      <li key={member.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <Avatar name={member.name} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                            <p className="text-sm text-gray-500 truncate">{member.role}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-col space-y-1">
                          {member.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.mobile_phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{member.mobile_phone}</span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage;