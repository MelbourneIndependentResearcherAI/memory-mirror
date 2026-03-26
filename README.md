# ✨ Memory Mirror 

A beautiful, modern photo and memory timeline application built with React. Capture and relive your precious moments in an elegant interface.

![Memory Mirror](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **📸 Photo Uploads** - Add photos with titles, descriptions, and dates
- **🏷️ Smart Tagging** - Organize memories with custom tags
- **📅 Timeline View** - See your memories in chronological order
- **🎯 Grid View** - Browse all memories in a beautiful grid layout
- **🔍 Search & Filter** - Find memories by title, description, or tags
- **💾 Local Storage** - All data saved in your browser (no backend needed)
- **📱 Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **🎨 Beautiful UI** - Modern, gradient-based design with smooth animations
- **⚡ Fast & Lightweight** - Built with Vite for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip memory-mirror-app.zip
   cd memory-mirror-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Adding a Memory

1. Click the **"Add Memory"** button in the header
2. Fill in the details:
   - **Title**: Give your memory a name
   - **Date**: When did this happen?
   - **Description**: Tell the story
   - **Photo**: Upload an image (optional)
   - **Tags**: Add relevant tags for easy filtering
3. Click **"Save Memory"**

### Viewing Memories

- **Grid View**: Click the grid icon to see all memories in a card layout
- **Timeline View**: Click the timeline icon to see memories organized by month/year

### Searching & Filtering

- Use the **search bar** to find memories by title, description, or tags
- Use the **filter dropdown** to show only memories with specific tags

### Editing & Deleting

- Click the **edit icon** (pencil) on any memory card to modify it
- Click the **delete icon** (trash) to remove a memory (confirmation required)

## 🎨 Screenshots

### Grid View
Beautiful card-based layout with photos and metadata

### Timeline View
Chronological timeline with month/year grouping

### Add Memory Modal
Easy-to-use form for capturing new memories

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icon set
- **Local Storage API** - Data persistence
- **CSS3** - Styling with custom properties

## 📁 Project Structure

```
/* Background gradient */
.premium-container {
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(135deg, #dbeafe, #eff6ff, #ffffff);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
}

/* Header */
.premium-header {
  text-align: center;
  margin-bottom: 20px;
}

.premium-header h1 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #1e3a8a;
}

.premium-header p {
  font-size: 1.1rem;
  color: #475569;
}

/* Settings box */
.premium-settings {
  width: 100%;
  max-width: 420px;
  background: #ffffffaa;
  backdrop-filter: blur(10px);
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.1);
}

.premium-settings label {
  font-size: 0.9rem;
  color: #1e3a8a;
  font-weight: 600;
}

.premium-settings input {
  width: 100%;
  margin-top: 6px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
}

/* Grid */
.premium-grid {
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

/* Tiles */
.premium-tile {
  background: #ffffffdd;
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.15);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.premium-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(30, 58, 138, 0.25);
}

.premium-tile.disabled {
  opacity: 0.45;
  cursor: default;
}

/* Icon circle */
.icon-circle {
  width: 70px;
  height: 70px;
  background: #dbeafe;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 0 auto 10px;
  box-shadow: inset 0 0 10px rgba(30, 58, 138, 0.15);
}

/* Tile text */
.premium-tile h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3a8a;
}


```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 💾 Data Storage

Memory Mirror uses the browser's **Local Storage** to save all your data. This means:

- ✅ No backend or database needed
- ✅ All data stays on your device
- ✅ Works completely offline
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Clearing browser data will delete memories

### Backing Up Your Data

To backup your memories:

1. Open browser DevTools (F12)
2. Go to Application/Storage → Local Storage
3. Find the `memory_mirror_data` key
4. Copy and save the value to a text file

To restore:
1. Paste the saved data back into Local Storage

## 🎨 Customization

### Changing Colors

Edit CSS variables in `src/styles/index.css`:

```css
:root {
  --primary-color: #6366f1;    /* Main color */
  --primary-dark: #4f46e5;     /* Darker shade */
  --primary-light: #818cf8;    /* Lighter shade */
  /* ... more variables */
}
```

### Adding Features

The codebase is modular and easy to extend:

- **New components**: Add to `src/components/`
- **New utilities**: Add to `src/utils/`
- **New hooks**: Add to `src/hooks/`

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

### Deploy to Popular Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

**GitHub Pages:**
1. Update `vite.config.js` with base path
2. Run `npm run build`
3. Deploy the `dist` folder

## 🤝 Contributing

This is a complete, working application! Feel free to:

- Add new features
- Improve the UI
- Fix bugs
- Optimize performance

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🎉 Credits

Created with ❤️ using React and Vite

## 🆘 Support

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Clear your browser cache
3. Try a different browser
4. Check the browser console for errors

## 🔮 Future Enhancements

Potential features to add:

- [ ] Cloud sync with Firebase/Supabase
- [ ] Export memories as PDF
- [ ] Share memories via URL
- [ ] Dark/Light theme toggle
- [ ] Multi-photo support per memory
- [ ] Calendar view
- [ ] Reminders for special dates
- [ ] Photo editing capabilities
- [ ] Import from social media
- [ ] Print memory book

---

**Enjoy capturing and reliving your precious memories! ✨**
