import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <>
      <header className="app-header">
        <div className="nav-left">
          <NavLink to="/" onClick={closeMenu}>
            <img src="/logo.png" alt="Logo" className="logo" />
          </NavLink>
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
            홈
          </NavLink>
          <NavLink to="/dex" onClick={closeMenu}>
            도감
          </NavLink>
          <NavLink to="/raid" onClick={closeMenu}>
            레이드
          </NavLink>
          <NavLink to="/growth-dungeon" onClick={closeMenu}>
            성장던전
          </NavLink>
          <NavLink to="/guild-war" onClick={closeMenu}>
            공성전
          </NavLink>
          <NavLink to="/summon" onClick={closeMenu}>
            소환
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
