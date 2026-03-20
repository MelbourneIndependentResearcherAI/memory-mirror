import { Routes, Route } from "react-router-dom";

// Home screen
import Home from "./Home";

// Your four apps
import MemoryMirror from "./apps/memory-mirror";
import CarerHireAI from "./apps/carer-hire-ai";
import LittleOnesAI from "./apps/little-ones-ai";
import FreshStartAI from "./apps/fresh-start-ai";

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
