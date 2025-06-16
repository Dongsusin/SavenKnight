import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dex from "./pages/Dex";
import HeroDetail from "./pages/HeroDetail";
import Adventure from "./pages/Adventure";
import Raid from "./pages/Raid";
import InfinityTower from "./pages/InfinityTower";
import Arena from "./pages/Arena";
import GrowthDungeon from "./pages/GrowthDungeon";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dex />} />
        <Route path="/hero/:name" element={<HeroDetail />} />
        <Route path="/adventure" element={<Adventure />} />
        <Route path="/raid" element={<Raid />} />
        <Route path="/infinity-tower" element={<InfinityTower />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/growth-dungeon" element={<GrowthDungeon />} />
      </Routes>
    </Router>
  );
}

export default App;
