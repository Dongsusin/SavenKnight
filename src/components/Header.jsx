import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="nav-left">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <nav className="nav-right">
        <Link to="/">도감</Link>
        <Link to="/adventure">모험</Link>
        <Link to="/raid">레이드</Link>
        <Link to="/infinity-tower">무한의탑</Link>
        <Link to="/arena">결투장</Link>
        <Link to="/growth-dungeon">성장던전</Link>
      </nav>
    </header>
  );
}
