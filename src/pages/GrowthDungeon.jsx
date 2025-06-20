import { useState, useEffect } from "react";
import dungeonList from "../data/dungeonData.json";
import "./GrowthDungeon.css";

export default function GrowthDungeon() {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedStage, setSelectedStage] = useState(1);
  const [visibleSkills, setVisibleSkills] = useState([]);

  const selectedDungeon = dungeonList.find((d) => d.id === selectedId);
  const boss = selectedDungeon?.bossStatsByStage?.[selectedStage - 1];
  const skillCount = selectedDungeon?.skillCount || 4;

  useEffect(() => {
    setVisibleSkills(Array(skillCount).fill(true));
  }, [selectedId, selectedStage, selectedDungeon?.skillCount]);

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
      "화상",
      "물리 공격력 증가",
      "광폭화",
      "빙결",
      "최대 생명력 증가",
      "기절",
      "방어력 증가",
      "마법 공격력 증가",
      "감전",
      "모든 피해 무효화",
      "즉사",
      "방어력 감소",
      "관통 고정 피해",
      "대상의 턴제 버프 감소",
    ];

    let highlighted = text;

    numberPatterns.forEach((regex) => {
      highlighted = highlighted.replace(
        regex,
        (match) =>
          `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
      );
    });

    const sortedBuffKeywords = [...buffKeywords].sort(
      (a, b) => b.length - a.length
    );

    sortedBuffKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
      );
    });

    return highlighted;
  };

  if (!selectedDungeon || !boss) return null;

  return (
    <div className="growth-container page">
      {/* 던전 선택 탭 */}
      <div className="dungeon-list">
        {dungeonList.map((dungeon) => (
          <div
            key={dungeon.id}
            className={`dungeon-tab ${
              dungeon.id === selectedId ? "active" : ""
            }`}
            onClick={() => {
              setSelectedId(dungeon.id);
              setSelectedStage(1);
            }}
            style={{ backgroundImage: `url(${dungeon.image})` }}
          ></div>
        ))}
      </div>

      <div className="dungeon-detail">
        <div className="dungeon-info">
          {/* 보스 이미지 + 스탯 */}
          <div className="dungeon-top">
            <div className="dungeon-image">
              <img src={selectedDungeon.bg} alt="보스 이미지" />
            </div>

            <div className="boss-stats-box">
              <div className="boss-stat-list two-column">
                <div>
                  <div>
                    <strong>
                      {["물의원소", "빛의원소"].includes(selectedDungeon.name)
                        ? "마법 공격력"
                        : "물리 공격력"}
                      :
                    </strong>{" "}
                    {boss.atk.toLocaleString()}
                  </div>
                  <div>
                    <strong>방어력:</strong> {boss.def.toLocaleString()}
                  </div>
                  <div>
                    <strong>생명력:</strong> {boss.hp.toLocaleString()}
                  </div>
                  <div>
                    <strong>속공:</strong> {boss.spd}
                  </div>
                  <div>
                    <strong>치명타 확률:</strong> {boss.critRate}%
                  </div>
                  <div>
                    <strong>치명타 피해:</strong> {boss.critDmg}%
                  </div>
                </div>
                <div>
                  <div>
                    <strong>약점 공격 확률:</strong> {boss.weakHit}%
                  </div>
                  <div>
                    <strong>막기 확률:</strong> {boss.block}%
                  </div>
                  <div>
                    <strong>받는 피해 감소:</strong> {boss.dmgReduction}%
                  </div>
                  <div>
                    <strong>효과 적중:</strong> {boss.acc}%
                  </div>
                  <div>
                    <strong>효과 저항:</strong> {boss.res}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 단계 선택 + 스킬 */}
          <div className="dungeon-bottom">
            <div className="stage-skill-wrapper">
              <div className="stage">
                <p>단계 선택</p>
                <div className="stage-select">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      className={selectedStage === i + 1 ? "active" : ""}
                      onClick={() => setSelectedStage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="skill-preview">
                <p>보스 스킬</p>
                <div className="skill-images">
                  {[...Array(skillCount)].map((_, idx) => {
                    const num = idx + 1;
                    const skillData = selectedDungeon.skills?.[idx];
                    const currentDungeonId = selectedId;
                    return visibleSkills[idx] && skillData ? (
                      <div
                        key={`${selectedDungeon.id}-${num}`}
                        className="skill-tooltip-wrapper"
                      >
                        <img
                          src={`/성장던전/스킬/${selectedDungeon.name}-${num}.png`}
                          alt={skillData.name}
                          onError={() => {
                            if (currentDungeonId === selectedId) {
                              const newVisible = [...visibleSkills];
                              newVisible[idx] = false;
                              setVisibleSkills(newVisible);
                            }
                          }}
                        />
                        <div className="skill-tooltip">
                          <strong>{skillData.name}</strong>
                          {skillData.effects?.map((e, i) => {
                            const targetColor =
                              e.detail === "버프"
                                ? "#00ccff"
                                : e.detail === "공격"
                                ? "#ff3300"
                                : "#ffcc00";
                            return (
                              <div key={i} style={{ marginBottom: "4px" }}>
                                {e.target && (
                                  <div
                                    className="skill-target"
                                    style={{
                                      color: targetColor,
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {e.target}
                                  </div>
                                )}

                                {Array.isArray(e.effect) ? (
                                  e.effect.map((line, idx2) => (
                                    <div
                                      key={idx2}
                                      className="skill-effect-line"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(line),
                                      }}
                                    />
                                  ))
                                ) : (
                                  <div
                                    className="skill-effect"
                                    dangerouslySetInnerHTML={{
                                      __html: highlightKeywords(e.effect || ""),
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 보상 영역 */}
          <div className="reward-section">
            <p>획득 가능 보상</p>
            <div className="reward-text">
              {(
                selectedDungeon.rewardsByStage[selectedStage - 1] ||
                "보상 정보 없음"
              )
                .split(",")
                .map((part, index) => (
                  <div key={index}>{part.trim()}</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
