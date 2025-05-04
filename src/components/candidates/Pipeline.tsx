import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Candidate } from '../../types/database.types';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

interface PipelineProps {
  candidates: Candidate[];
  onStatusChange: (candidateId: string, newStatus: string) => Promise<void>;
}

// Define pipeline stages
const PIPELINE_STAGES = [
  'Calibration profile',
  'Sourced',
  'Contacted',
  'Interview',
  'Offer',
  'Disqualified',
];

// Helper to get candidates by stage
const getCandidatesByStage = (candidates: Candidate[], stage: string) => {
  return candidates
    .filter(c => c.update_status === stage)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
};

const Pipeline: React.FC<PipelineProps> = ({ candidates, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Update candidate status
    const newStatus = destination.droppableId;
    setLoading(true);
    try {
      await onStatusChange(draggableId, newStatus);
    } catch (error) {
      console.error('Error updating candidate status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get stage color
  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'Calibration profile': 'bg-gray-100',
      'Sourced': 'bg-blue-100',
      'Contacted': 'bg-indigo-100',
      'Interview': 'bg-purple-100',
      'Offer': 'bg-green-100',
      'Disqualified': 'bg-red-100',
    };
    
    return stageColors[stage] || 'bg-gray-100';
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 min-w-max">
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage} className="w-64 flex-shrink-0">
              <div className={`${getStageColor(stage)} px-3 py-2 rounded-t-lg`}>
                <h3 className="font-medium">{stage}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  {getCandidatesByStage(candidates, stage).length} candidates
                </div>
              </div>
              
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 rounded-b-lg p-2 h-96 overflow-y-auto"
                  >
                    {getCandidatesByStage(candidates, stage).map((candidate, index) => (
                      <Draggable
                        key={candidate.id}
                        draggableId={candidate.id}
                        index={index}
                        isDragDisabled={loading}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded shadow-sm mb-2 ${
                              snapshot.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar name={candidate.name} size="sm" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">
                                  {candidate.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {candidate.current_title || 'No title'}
                                </p>
                              </div>
                            </div>
                            
                            {candidate.employer_industry && (
                              <div className="mt-2">
                                <Badge variant="default" className="text-xs">
                                  {candidate.employer_industry}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Pipeline;