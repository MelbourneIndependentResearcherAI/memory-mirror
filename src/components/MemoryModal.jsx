import React, { useState, useEffect } from 'react';
import { X, Upload, Tag as TagIcon } from 'lucide-react';
import { compressImage } from '../utils/helpers';
import '../styles/MemoryModal.css';

const MemoryModal = ({ isOpen, onClose, onSave, editMemory }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editMemory) {
      setFormData(editMemory);
      setImagePreview(editMemory.image || '');
    } else {
      resetForm();
    }
  }, [editMemory, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      tags: []
    });
    setTagInput('');
    setImagePreview('');
    setIsUploading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit to 10 MB before compression; compressImage will shrink the result.
      const MAX_SIZE_BYTES = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE_BYTES) {
        alert('Image is too large. Please choose an image under 10 MB.');
        e.target.value = '';
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await compressImage(file);
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
        e.target.value = '';
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    // Limit tag length to prevent oversized stored values.
    if (trimmed && trimmed.length <= 50 && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }));
      setTagInput('');
    } else if (trimmed.length > 50) {
      alert('Tag must be 50 characters or fewer.');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    onSave(formData);
    resetForm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editMemory ? 'Edit Memory' : 'Add New Memory'}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="memory-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your memory a title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your memory..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Photo</label>
            <div className="image-upload">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image" className={`upload-button${isUploading ? ' upload-button--loading' : ''}`}>
                <Upload size={20} />
                <span>{isUploading ? 'Processing…' : 'Choose Photo'}</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <div className="tag-input-wrapper">
                <TagIcon size={16} />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="add-tag-button"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={isUploading}>
              {editMemory ? 'Update' : 'Save'} Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryModal;
