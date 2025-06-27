import React, { useState } from "react";
import "./GuildWar.css";

const monsterData = {
  수호자의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "루디",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  포디나의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "아일린",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  불멸의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "레이첼",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  죽음의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "델론즈",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  고대용의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "제이브",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  혹한의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "스파이크",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
  지옥의성: [
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "챈슬러",
      },
      {
        name: "룩",
      },
    ],
    [
      {
        name: "룩",
      },
      {
        name: "크리스",
      },
      {
        name: "챈슬러",
      },
    ],
  ],
};

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
  const rounds = monsterData[selectedDay] || [];
  const [selectedMonster, setSelectedMonster] = useState(null);

  return (
    <div className="guildwar-page page">
      <h1>공성전</h1>

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
                      src={`/길드전/${selectedDay}/${monster.name}(${
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
            <img
              src={`/길드전/${selectedDay}/${selectedMonster.name}(${selectedMonster.round}라).png`}
              alt={selectedMonster.name}
              className="monster-detail-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
