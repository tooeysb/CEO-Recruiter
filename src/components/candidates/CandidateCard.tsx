import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, Briefcase } from 'lucide-react';
import { Candidate } from '../../types/database.types';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { truncateText } from '../../lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Map status to badge variant
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, any> = {
      'Calibration profile': { variant: 'default', label: 'Calibration' },
      'Sourced': { variant: 'info', label: 'Sourced' },
      'Contacted': { variant: 'primary', label: 'Contacted' },
      'Interview': { variant: 'secondary', label: 'Interview' },
      'Offer': { variant: 'success', label: 'Offer' },
      'Disqualified': { variant: 'danger', label: 'Disqualified' },
    };
    
    return statusMap[status] || { variant: 'default', label: status };
  };
  
  const badge = getStatusBadge(candidate.update_status);
  
  return (
    <Link to={`/candidates/${candidate.id}`}>
      <Card className="h-full cursor-pointer">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar name={candidate.name} size="lg" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.current_title || 'No title'}</p>
              </div>
            </div>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            {candidate.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>{candidate.location}</span>
              </div>
            )}
            
            {candidate.current_employer && (
              <div className="flex items-center text-sm text-gray-500">
                <Building size={16} className="mr-2 flex-shrink-0" />
                <span>{candidate.current_employer}</span>
              </div>
            )}
            
            {candidate.employer_industry && (
              <div className="flex items-center text-sm text-gray-500">
                <Briefcase size={16} className="mr-2 flex-shrink-0" />
                <span>{candidate.employer_industry}</span>
              </div>
            )}
          </div>
          
          {candidate.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{truncateText(candidate.notes, 100)}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.hungry && (
              <Badge variant="primary">Hungry</Badge>
            )}
            {candidate.humble && (
              <Badge variant="primary">Humble</Badge>
            )}
            {candidate.smart && (
              <Badge variant="primary">Smart</Badge>
            )}
            {candidate.previous_ceo_experience && (
              <Badge variant="secondary">CEO Experience</Badge>
            )}
            {candidate.exec_staff && (
              <Badge variant="secondary">Exec Staff</Badge>
            )}
            {candidate.global_experience && (
              <Badge variant="secondary">Global</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CandidateCard;