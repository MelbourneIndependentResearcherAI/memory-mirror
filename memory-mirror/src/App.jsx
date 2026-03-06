import React, { useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import MemoryGrid from './components/MemoryGrid';
import MemoryModal from './components/MemoryModal';
import EmptyState from './components/EmptyState';
import { useMemories } from './hooks/useMemories';
import './styles/App.css';

function App() {
  const {
    memories,
    allMemories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    allTags
  } = useMemories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'timeline'

  const handleAddMemory = () => {
    setEditingMemory(null);
    setIsModalOpen(true);
  };

  const handleEditMemory = (memory) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleSaveMemory = async (memoryData) => {
    try {
      if (editingMemory) {
        await updateMemory(editingMemory.id, memoryData);
      } else {
        await addMemory(memoryData);
      }
    } catch (error) {
      alert('Failed to save memory. Please try again.');
    }
  };

  const handleDeleteMemory = (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      deleteMemory(id);
    }
  };

  const isFiltered = searchQuery || filter !== 'all';

  return (
    <div className="app">
      <Header
        onAddMemory={handleAddMemory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filter={filter}
        onFilterChange={setFilter}
        allTags={allTags}
      />

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading memories...</div>
        ) : memories.length === 0 ? (
          <EmptyState
            onAddMemory={handleAddMemory}
            isFiltered={isFiltered}
          />
        ) : viewMode === 'timeline' ? (
          <Timeline
            memories={memories}
            onDelete={handleDeleteMemory}
            onEdit={handleEditMemory}
          />
        ) : (
          <MemoryGrid
            memories={memories}
            onDelete={handleDeleteMemory}
            onEdit={handleEditMemory}
          />
        )}
      </main>

      <MemoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMemory(null);
        }}
        onSave={handleSaveMemory}
        editMemory={editingMemory}
      />

      <footer className="app-footer">
        <p>
          {allMemories.length} {allMemories.length === 1 ? 'memory' : 'memories'} saved
          {isFiltered && ` · ${memories.length} shown`}
        </p>
      </footer>
    </div>
  );
}

export default App;
