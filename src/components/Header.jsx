import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const closeMenu = () => setMenuOpen(false);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("로그인 실패", err);
    }
  };

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
          {/* ✅ 모바일 메뉴 최상단에 로그인 UI 배치 */}
          <div className="auth-buttons mobile-only">
            {user ? (
              <div className="user-box">
                <img src={user.photoURL} alt="user" className="user-avatar" />
                <span className="user-name">{user.displayName}</span>
                <button className="logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            ) : (
              <button className="login-button" onClick={handleLogin}>
                로그인
              </button>
            )}
          </div>

          {/* ✅ 메뉴 항목들 */}
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
          <NavLink to="/summon" onClick={closeMenu}>
            소환
          </NavLink>
          <NavLink to="/team" onClick={closeMenu}>
            팀 편성
          </NavLink>
        </nav>

        <div className="auth-buttons desktop-only">
          {user ? (
            <div className="user-box">
              <img src={user.photoURL} alt="user" className="user-avatar" />
              <span className="user-name">{user.displayName}</span>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={handleLogin}>
              로그인
            </button>
          )}
        </div>
      </header>

      {/* 오버레이 추가 */}
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}
