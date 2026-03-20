import { Routes, Route } from "react-router-dom";

// Home screen
import Home from "../pages/Home";

// Your existing pages
import CarerHireAI from "../pages/carer-hire-ai/Home";
import FreshStartAI from "../pages/fresh-start-ai/Home";
import LittleOnesAI from "../pages/little-ones-ai/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/carer-hire-ai" element={<CarerHireAI />} />
      <Route path="/fresh-start-ai" element={<FreshStartAI />} />
      <Route path="/little-ones-ai" element={<LittleOnesAI />} />
    </Routes>
  );
}
