import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardAnimated from "./screens/DashboardAnimated";
import AuntyBevTalk from "./screens/AuntyBevTalk";
import CalmCorner from "./screens/CalmCorner";
import Breathing from "./screens/Breathing";
import NightSafe from "./screens/NightSafe";
import MusicTherapy from "./screens/MusicTherapy";
import KitchenSafety from "./screens/KitchenSafety";
import MedicineHelper from "./screens/MedicineHelper";
import HealingRoom from "./screens/HealingRoom";
import PetsBuddyRoom from "./screens/PetsBuddyRoom";
import GrandkidsHub from "./screens/GrandkidsHub";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardAnimated />} />
        <Route path="/auntybev" element={<AuntyBevTalk />} />
        <Route path="/calm" element={<CalmCorner />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/nightsafe" element={<NightSafe />} />
        <Route path="/music" element={<MusicTherapy />} />
        <Route path="/kitchen" element={<KitchenSafety />} />
        <Route path="/medicinehelper" element={<MedicineHelper />} />
        <Route path="/healing" element={<HealingRoom />} />
        <Route path="/petsbuddyroom" element={<PetsBuddyRoom />} />
        <Route path="/grandkids" element={<GrandkidsHub />} />
      </Routes>
    </BrowserRouter>
  );
}
