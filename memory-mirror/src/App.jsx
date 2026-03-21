import { useState } from "react";
import Header from './components/Header';
import Timeline from './components/Timeline';
import MemoryGrid from './components/MemoryGrid';
import MemoryModal from './components/MemoryModal';
import EmptyState from './components/EmptyState';
import { useMemories } from './hooks/useMemories';
import './styles/App.css';

export default function MemoryMirror() {
  const [viewMode, setViewMode] = useState('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMemory, setEditMemory] = useState(null);
  const { memories, loading, addMemory, updateMemory, deleteMemory, filter, setFilter, searchQuery, setSearchQuery, allTags } = useMemories();

  const handleAddMemory = () => { setEditMemory(null); setIsModalOpen(true); };
  const handleEditMemory = (memory) => { setEditMemory(memory); setIsModalOpen(true); };
  const handleSaveMemory = async (formData) => {
    try {
      if (editMemory) { await updateMemory(editMemory.id, formData); }
      else { await addMemory(formData); }
    } catch (error) { alert(error.message || 'Failed to save memory.'); }
  };
  const handleDeleteMemory = (id) => {
    if (window.confirm('Delete this memory?')) deleteMemory(id);
  };

  return (
    <div className="app">
      <Header onAddMemory={handleAddMemory} searchQuery={searchQuery} onSearchChange={setSearchQuery} viewMode={viewMode} onViewModeChange={setViewMode} filter={filter} onFilterChange={setFilter} allTags={allTags} />
      <main className="app-main">
        {loading ? <div className="loading">Loading memories…</div>
          : memories.length === 0 ? <EmptyState onAddMemory={handleAddMemory} isFiltered={searchQuery !== '' || filter !== 'all'} />
          : viewMode === 'timeline' ? <Timeline memories={memories} onDelete={handleDeleteMemory} onEdit={handleEditMemory} />
          : <MemoryGrid memories={memories} onDelete={handleDeleteMemory} onEdit={handleEditMemory} />}
      </main>
      <footer className="app-footer">Memory Mirror — Your personal photo timeline</footer>
      <MemoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveMemory} editMemory={editMemory} />
    </div>
  );
}