import { useState } from "react";
import { useMemories } from "../hooks/useMemories";
import Header from "../components/Header";
import MemoryGrid from "../components/MemoryGrid";
import Timeline from "../components/Timeline";
import EmptyState from "../components/EmptyState";
import MemoryModal from "../components/MemoryModal";
import "../styles/Header.css";
import "../styles/MemoryCard.css";
import "../styles/MemoryGrid.css";
import "../styles/MemoryModal.css";
import "../styles/Timeline.css";
import "../styles/EmptyState.css";

export default function MemoryMirror({ onBack }) {
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [viewMode, setViewMode]         = useState("grid");

  const {
    memories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    allTags,
  } = useMemories();

  const handleSave = async (data) => {
    if (editingMemory) {
      await updateMemory(editingMemory.id, data);
      setEditingMemory(null);
    } else {
      await addMemory(data);
      setModalOpen(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07100a", color: "#f0fdf4", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sticky top bar */}
      <div style={{
        padding: "0 24px",
        height: 64,
        borderBottom: "1px solid #1a2e1c",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(7,16,10,0.97)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={onBack} className="back-btn" style={{ marginBottom: 0 }}>← Home</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>Memory Mirror</h1>
      </div>

      <Header
        onAddMemory={() => setModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filter={filter}
        onFilterChange={setFilter}
        allTags={allTags}
      />

      <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {loading ? (
          <div className="loading">Loading your memories…</div>
        ) : memories.length === 0 ? (
          <EmptyState
            isFiltered={!!(searchQuery || filter !== "all")}
            onAddMemory={() => setModalOpen(true)}
          />
        ) : viewMode === "grid" ? (
          <MemoryGrid memories={memories} onDelete={deleteMemory} onEdit={setEditingMemory} />
        ) : (
          <Timeline memories={memories} onDelete={deleteMemory} onEdit={setEditingMemory} />
        )}
      </main>

      {(modalOpen || editingMemory) && (
        <MemoryModal
          memory={editingMemory}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingMemory(null); }}
        />
      )}
    </div>
  );
}
