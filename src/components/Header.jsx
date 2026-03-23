import React from 'react';
import { Plus, Search, Filter, Grid3x3, List } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ 
  onAddMemory, 
  searchQuery, 
  onSearchChange,
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  allTags
}) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-title">
          <h1>✨ Memory Mirror</h1>
          <p>Your personal photo timeline</p>
        </div>
        
        <button className="add-button" onClick={onAddMemory}>
          <Plus size={20} />
          <span>Add Memory</span>
        </button>
      </div>

      <div className="header-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-dropdown">
            <Filter size={18} />
            <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => onViewModeChange('grid')}
              title="Grid view"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              className={viewMode === 'timeline' ? 'active' : ''}
              onClick={() => onViewModeChange('timeline')}
              title="Timeline view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
