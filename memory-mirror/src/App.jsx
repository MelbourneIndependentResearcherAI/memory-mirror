import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import MemoryMirror from "./pages/MemoryMirror";
import CarerHireAI from "./pages/CarerHireAI";
import LittleOnesAI from "./pages/LittleOnesAI";
import FreshStartAI from "./pages/FreshStartAI";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/memory-mirror" element={<MemoryMirror />} />
      <Route path="/carer-hire-ai" element={<CarerHireAI />} />
      <Route path="/little-ones-ai" element={<LittleOnesAI />} />
      <Route path="/fresh-start-ai" element={<FreshStartAI />} />
    </Routes>
  );
}
