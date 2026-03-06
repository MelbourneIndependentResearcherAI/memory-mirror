import React from 'react';
import { Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import { formatDate, truncateText } from '../utils/helpers';
import '../styles/MemoryCard.css';

const MemoryCard = ({ memory, onDelete, onEdit }) => {
  return (
    <div className="memory-card">
      {memory.image && (
        <div className="memory-image">
          <img src={memory.image} alt={memory.title} />
        </div>
      )}
      
      <div className="memory-content">
        <div className="memory-header">
          <h3 className="memory-title">{memory.title}</h3>
          <div className="memory-actions">
            <button
              className="icon-button"
              onClick={() => onEdit(memory)}
              title="Edit memory"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="icon-button delete"
              onClick={() => onDelete(memory.id)}
              title="Delete memory"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p className="memory-description">
          {truncateText(memory.description, 150)}
        </p>

        <div className="memory-meta">
          <div className="memory-date">
            <Calendar size={14} />
            <span>{formatDate(memory.date)}</span>
          </div>

          {memory.tags && memory.tags.length > 0 && (
            <div className="memory-tags">
              <Tag size={14} />
              <div className="tag-list">
                {memory.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
