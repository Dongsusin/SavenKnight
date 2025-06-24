import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlide from "../components/HeroSlide";
import PetSlide from "../components/PetSlide";
import CharacterSelectPopup from "../components/CharacterSelectPopup";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [previewTeam, setPreviewTeam] = useState(Array(5).fill(null));
  const [selectingIndex, setSelectingIndex] = useState(null);

  return (
    <div className="page home-layout">
      {/* 왼쪽 섹션 */}
      <aside className="home-sidebar">
        <section className="home-panel">
          <h2>업데이트 게시판</h2>
          <ul>
            <li>
              <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6184591">
                [2025-06-12]업데이트 내역
              </a>
            </li>
            <li>
              <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6103024">
                [2025-05-29]업데이트 내역
              </a>
            </li>
            <li>
              <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6056683">
                [2025-05-21]업데이트 내역
              </a>
            </li>
          </ul>
        </section>

        <section className="home-panel">
          <h2>쿠폰 코드</h2>
          <ul className="coupon-list">
            <li>
              <div className="coupon-code">SENARESAMEWAY</div>
              <div className="coupon-reward">열쇠 상자 3개</div>
            </li>
            <li>
              <div className="coupon-code">SENAREYOUNGLAEGI</div>
              <div className="coupon-reward">골드 30만</div>
            </li>
            <li>
              <div className="coupon-code">SENAREGSIK</div>
              <div className="coupon-reward">희귀 영웅 소환권 1개</div>
            </li>
            <li>
              <div className="coupon-code">SENAREMOOVING</div>
              <div className="coupon-reward">진화 재료 상자(중) 30개</div>
            </li>
            <li>
              <div className="coupon-code">SORRY4WAITING</div>
              <div className="coupon-reward">진화 재료 상자(상) 30개</div>
            </li>
            <li>
              <div className="coupon-code">SEVENKNIGHTSFOREVER</div>
              <div className="coupon-reward">희귀 영웅 선택권 1개 </div>
            </li>
          </ul>
        </section>
      </aside>

      {/* 중앙 섹션 */}
      <main className="home-main">
        <section className="home-panel">
          <h2>영웅 도감</h2>
          <HeroSlide />
        </section>

        <section className="home-panel">
          <h2>펫 도감</h2>
          <PetSlide />
        </section>

        <section className="home-panel">
          <h2>팀 편성</h2>
          {/* 🧩 미니 팀 편성 UI */}
          <div className="mini-team-preview">
            {previewTeam.map((member, index) => (
              <div
                key={index}
                className="mini-slot"
                onClick={() => setSelectingIndex(index)}
              >
                {member ? (
                  <img
                    src={`/도감/${member.group}/아이콘/${member.name}.png`}
                    alt={member.name}
                    style={{ width: "60px", height: "60px" }}
                  />
                ) : (
                  <div className="empty-slot">+</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="team-navigate-button"
              onClick={() => navigate("/team")}
            >
              팀 편성하러 가기
            </button>
          </div>

          {selectingIndex !== null && (
            <CharacterSelectPopup
              onSelect={(hero) => {
                const updated = [...previewTeam];
                updated[selectingIndex] = hero;
                setPreviewTeam(updated);
                setSelectingIndex(null);
              }}
              onClose={() => setSelectingIndex(null)}
            />
          )}
        </section>
      </main>

      {/* 오른쪽 섹션 */}
      <aside className="home-sidebar">
        <section className="home-panel">
          <h2>레이드</h2>
          <ul className="home-raid-list">
            {[
              { name: "파멸의눈동자", img: "/레이드/선택/파멸의눈동자.png" },
              { name: "우마왕", img: "/레이드/선택/우마왕.png" },
              { name: "강철의포식자", img: "/레이드/선택/강철의포식자.png" },
            ].map((raid, i) => (
              <li
                key={raid.name}
                className={`home-raid-card ${i === 0 ? "selected" : ""}`}
                onClick={() => navigate("/raid")}
              >
                <img src={raid.img} alt={raid.name} />
                <span>{raid.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-panel">
          <h2>성장 던전</h2>
          <ul className="GrowthDungeon-list">
            {[
              { name: "불의원소", img: "/성장던전/배경/불의원소.png" },
              { name: "물의원소", img: "/성장던전/배경/물의원소.png" },
              { name: "땅의원소", img: "/성장던전/배경/땅의원소.png" },
              { name: "빛의원소", img: "/성장던전/배경/빛의원소.png" },
              { name: "암흑의원소", img: "/성장던전/배경/암흑의원소.png" },
              { name: "골드", img: "/성장던전/배경/골드.png" },
            ].map((GrowthDungeon, i) => (
              <li
                key={GrowthDungeon.name}
                className={`GrowthDungeon-card ${i === 0 ? "selected" : ""}`}
                onClick={() => navigate("/growth-dungeon")}
              >
                <img src={GrowthDungeon.img} alt={GrowthDungeon.name} />
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
