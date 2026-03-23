import React from 'react';
import MemoryCard from './MemoryCard';
import { groupMemoriesByDate } from '../utils/helpers';
import '../styles/Timeline.css';

const Timeline = ({ memories, onDelete, onEdit }) => {
  const groupedMemories = groupMemoriesByDate(memories);

  return (
    <div className="timeline">
      {groupedMemories.map((group, groupIndex) => (
        <div key={groupIndex} className="timeline-group">
          <div className="timeline-marker">
            <div className="marker-dot"></div>
            <div className="marker-line"></div>
          </div>
          
          <div className="timeline-content">
            <h2 className="timeline-month">{group.label}</h2>
            <div className="timeline-memories">
              {group.memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
