import React from 'react';
import MemoryCard from './MemoryCard';
import '../styles/MemoryGrid.css';

const MemoryGrid = ({ memories, onDelete, onEdit }) => {
  return (
    <div className="memory-grid">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default MemoryGrid;
