import React, { useState } from "react";
import monsterData from "../data/guildWarMonsters.json";
import "./GuildWar.css";

const days = [
  "수호자의성",
  "포디나의성",
  "불멸의성",
  "죽음의성",
  "고대용의성",
  "혹한의성",
  "지옥의성",
];

export default function GuildWar() {
  const [selectedDay, setSelectedDay] = useState("수호자의성");
  const [selectedMonster, setSelectedMonster] = useState(null);

  const rounds = monsterData[selectedDay] || [];

  return (
    <div className="guildwar-page page">
      {/* 요일 탭 */}
      <div className="day-tab-container">
        {days.map((day) => (
          <button
            key={day}
            className={`day-tab ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* 라운드 별 몬스터 표시 */}
      <div className="round-list">
        {rounds.map((round, idx) => (
          <div className="round-card" key={idx}>
            <h2>Round {idx + 1}</h2>
            <div className="monster-row">
              {round.length > 0 ? (
                round.map((monster, mIdx) => (
                  <div key={mIdx} className="monster-card">
                    <img
                      src={`/길드전/${selectedDay}/아이콘/${monster.name}(${
                        idx + 1
                      }라).png`}
                      alt={monster.name}
                      className="monster-image"
                      onClick={() =>
                        setSelectedMonster({ ...monster, round: idx + 1 })
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="no-data">해당 라운드 정보 없음</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 팝업 */}
      {selectedMonster && (
        <div
          className="monster-detail-popup-overlay"
          onClick={() => setSelectedMonster(null)}
        >
          <div
            className="monster-detail-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedMonster(null)}
            >
              ✕
            </button>
            <h3>{selectedMonster.name}</h3>
            <img
              src={`/길드전/${selectedDay}/아이콘/${selectedMonster.name}(${selectedMonster.round}라).png`}
              alt={selectedMonster.name}
              className="monster-detail-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
