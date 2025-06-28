import React, { useState } from "react";
import monsterData from "../data/guildWarMonsters.json";
import siegeSkillData from "../data/siegeSkillData.json";
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

  const highlightKeywords = (text) => {
  const goldColor = "#ffcc00";
  const blueColor = "#00ccff";
  const numberPatterns = [
    /\d+턴/g,
    /\d+회/g,
    /\d+%/g,
    /\d+번째/g,
    /\b\d{1,3}(,\d{3})*\b/g,
    /\b\d+\b/g,
  ];
  const buffKeywords = [
    "현재 생명력 비율을",
    "로 전환",
    "기절",
    "물리 피해량",
    "1인 공격기",
    "5인 공격기",
    "링크",
    "보호막",
    "광폭화",
    "감전",
    "관통",
    "화상",
    "방어력 감소",
    "모든 공격력 감소",
    "침묵",
    "마법 피해량",
    "연속 발동",
    "모든 피해 무효화",
    "용염",
    "피해 대상이 1명 줄어들 때마다",
    "만큼 피해량 증가",
    "치명타 확률",
    "치명타 피해",
    "반격",
    "빙결",
    "혹한의 기운",
    "혹한의 숨결",
    "즉사",
  ];

  let highlighted = text;

  // 1. buff 키워드를 먼저 처리
  buffKeywords
    .sort((a, b) => b.length - a.length)
    .forEach((keyword) => {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"); // 이스케이프 처리
      highlighted = highlighted.replace(
        regex,
        `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
      );
    });

  // 2. 숫자 패턴을 나중에 처리
  numberPatterns.forEach((regex) => {
    highlighted = highlighted.replace(
      regex,
      (match) =>
        `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
    );
  });

  return highlighted;
};


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
                      src={`/공성전/${selectedDay}/아이콘/${monster.name}(${
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
              src={`/공성전/${selectedDay}/아이콘/${selectedMonster.name}(${selectedMonster.round}라).png`}
              alt={selectedMonster.name}
              className="monster-detail-image"
            />

            {/* 스킬 이미지 + 설명 툴팁 (레이드 스타일) */}
            <div className="guildwar-skill-list">
              {[1, 2, 3, 4].map((n) => {
                const skillData =
                  siegeSkillData?.[selectedDay]?.[selectedMonster.name]?.[
                    selectedMonster.round
                  ]?.[n - 1];
                if (!skillData) return null;

                const skillList = Array.isArray(skillData)
                  ? skillData
                  : [skillData];

                return (
                  <div className="guildwar-skill-block" key={n}>
                    <img
                      src={`/공성전/${selectedDay}/스킬/${selectedMonster.name}-${n}.png`}
                      alt={`${selectedMonster.name} 스킬${n}`}
                      className="skill-image"
                      onError={(e) => (e.target.style.display = "none")}
                      style={{ marginBottom: "8px" }}
                    />
                    <div className="skill-des">
                      {skillList.map((skill, i) => (
                        <div key={i}>
                          {skill.name && <strong>{skill.name}</strong>}
                          {skill.target && (
                            <div
                              className="target"
                              style={{
                                color:
                                  skill.detail === "버프"
                                    ? "#00ccff"
                                    : skill.detail === "공격"
                                    ? "#ff3300"
                                    : "#ffcc00",
                              }}
                            >
                              {skill.target}
                            </div>
                          )}
                          {Array.isArray(skill.description)
                            ? skill.description.map((line, j) => (
                                <div
                                  className="line"
                                  key={j}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line),
                                  }}
                                />
                              ))
                            : skill.description && (
                                <div
                                  className="line"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(
                                      skill.description
                                    ),
                                  }}
                                />
                              )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
