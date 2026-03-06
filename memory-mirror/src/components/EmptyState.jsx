import React from 'react';
import { ImagePlus } from 'lucide-react';
import '../styles/EmptyState.css';

const EmptyState = ({ onAddMemory, isFiltered }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <ImagePlus size={64} />
      </div>
      
      {isFiltered ? (
        <>
          <h2>No memories found</h2>
          <p>Try adjusting your search or filter to see more memories</p>
        </>
      ) : (
        <>
          <h2>No memories yet</h2>
          <p>Start capturing your precious moments</p>
          <button className="button-primary" onClick={onAddMemory}>
            Add Your First Memory
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
