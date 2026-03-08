// Local storage management for memories
const STORAGE_KEY = 'memory_mirror_data';

export const storage = {
  // Get all memories
  getMemories() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading memories:', error);
      return [];
    }
  },

  // Save all memories
  saveMemories(memories) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
      return true;
    } catch (error) {
      // Handle QuotaExceededError — localStorage is full (common when storing large base64 images).
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error('localStorage quota exceeded. Consider removing old memories or images.');
        throw new Error('Storage is full. Please delete some memories or remove photo attachments to free up space.');
      }
      console.error('Error saving memories:', error);
      return false;
    }
  },

  // Add a new memory
  addMemory(memory) {
    const memories = this.getMemories();
    const newMemory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    memories.unshift(newMemory);
    this.saveMemories(memories);
    return newMemory;
  },

  // Update a memory
  updateMemory(id, updates) {
    const memories = this.getMemories();
    const index = memories.findIndex(m => m.id === id);
    if (index !== -1) {
      memories[index] = { ...memories[index], ...updates };
      this.saveMemories(memories);
      return memories[index];
    }
    return null;
  },

  // Delete a memory
  deleteMemory(id) {
    const memories = this.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    this.saveMemories(filtered);
    return true;
  },

  // Search memories
  searchMemories(query) {
    const memories = this.getMemories();
    const lowerQuery = query.toLowerCase();
    return memories.filter(m =>
      m.title?.toLowerCase().includes(lowerQuery) ||
      m.description?.toLowerCase().includes(lowerQuery) ||
      m.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Filter by date range
  filterByDateRange(startDate, endDate) {
    const memories = this.getMemories();
    return memories.filter(m => {
      const memoryDate = new Date(m.date);
      return memoryDate >= startDate && memoryDate <= endDate;
    });
  },

  // Get memories by tag
  getMemoriesByTag(tag) {
    const memories = this.getMemories();
    return memories.filter(m => m.tags?.includes(tag));
  },

  // Get all unique tags
  getAllTags() {
    const memories = this.getMemories();
    const tags = new Set();
    memories.forEach(m => {
      m.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  },

  // Clear all data
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
