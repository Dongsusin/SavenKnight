import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="app-header">
        <div className="nav-left">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>

        <nav className={`nav-right ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            도감
          </NavLink>
          <NavLink to="/raid" onClick={closeMenu}>
            레이드
          </NavLink>
          <NavLink to="/growth-dungeon" onClick={closeMenu}>
            성장던전
          </NavLink>
        </nav>
      </header>

      {/* 오버레이 추가 */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
