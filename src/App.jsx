import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dex from "./pages/Dex";
import HeroDetail from "./pages/HeroDetail";
import Raid from "./pages/Raid";
import GrowthDungeon from "./pages/GrowthDungeon";
import SummonSimulation from "./pages/SummonSimulation";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dex />} />
        <Route path="/hero/:name" element={<HeroDetail />} />
        <Route path="/raid" element={<Raid />} />
        <Route path="/growth-dungeon" element={<GrowthDungeon />} />
        <Route path="/summon" element={<SummonSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
