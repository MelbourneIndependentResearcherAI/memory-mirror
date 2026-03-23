// Helper utility functions

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export const groupMemoriesByDate = (memories) => {
  const grouped = {};
  
  memories.forEach(memory => {
    const date = new Date(memory.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!grouped[key]) {
      grouped[key] = {
        label: monthYear,
        memories: []
      };
    }
    grouped[key].memories.push(memory);
  });

  return Object.values(grouped).sort((a, b) => {
    const [monthA, yearA] = a.label.split(' ');
    const [monthB, yearB] = b.label.split(' ');
    return new Date(yearB, getMonthNumber(monthB)) - new Date(yearA, getMonthNumber(monthA));
  });
};

const getMonthNumber = (monthName) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName);
};

// Resize and compress an image file before base64 encoding.
// Keeps the longest edge at most maxDimension pixels and encodes as JPEG
// at the given quality (0–1). This dramatically reduces the base64 payload
// stored in localStorage compared with encoding the raw file.
export const compressImage = (file, maxDimension = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(new Error(`Failed to encode compressed image: ${err.message}`));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };
    img.src = objectUrl;
  });
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
