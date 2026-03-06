import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = () => {
    setLoading(true);
    try {
      const data = storage.getMemories();
      setMemories(data);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (memoryData) => {
    try {
      const newMemory = storage.addMemory(memoryData);
      setMemories(prev => [newMemory, ...prev]);
      return newMemory;
    } catch (error) {
      console.error('Error adding memory:', error);
      throw error;
    }
  };

  const updateMemory = (id, updates) => {
    try {
      const updated = storage.updateMemory(id, updates);
      setMemories(prev =>
        prev.map(m => m.id === id ? updated : m)
      );
      return updated;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  };

  const deleteMemory = (id) => {
    try {
      storage.deleteMemory(id);
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  };

  const filteredMemories = memories.filter(memory => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        memory.title?.toLowerCase().includes(query) ||
        memory.description?.toLowerCase().includes(query) ||
        memory.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Tag filter
    if (filter !== 'all') {
      return memory.tags?.includes(filter);
    }

    return true;
  });

  const allTags = storage.getAllTags();

  return {
    memories: filteredMemories,
    allMemories: memories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    refreshMemories: loadMemories,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    allTags
  };
};
