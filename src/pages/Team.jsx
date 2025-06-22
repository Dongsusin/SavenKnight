import React, { useState } from "react";
import CharacterSelectPopup from "../components/CharacterSelectPopup";
import baseStatData from "../data/statByGradeAndType.json";
import maxStatData from "../data/maxStatByGradeAndType.json";
import enhanceBonusData from "../data/enhanceBonusByGradeAndType.json";
import equipmentData from "../data/equipment.json";
import "./Team.css";

export default function Team() {
  const [team, setTeam] = useState(Array(5).fill(null));
  const [selectingIndex, setSelectingIndex] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(Array(5).fill(null));
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [selectedEquipSlot, setSelectedEquipSlot] = useState(null);
  const [teamEquipments, setTeamEquipments] = useState(Array(5).fill({}));

  const handleSelect = (hero) => {
    const updated = [...team];
    updated[selectingIndex] = {
      ...hero,
      level: 1,
      enhance: 0,
      transcend: 0,
      transcendBonus: hero.transcendBonus ?? [], // ⬅️ 여기가 중요!
    };
    setTeam(updated);
    setSelectingIndex(null);
  };

  const handleSlotClick = (index) => {
    setSelectingIndex(index);
  };

  const updateStat = (index, key, value) => {
    const updated = [...team];
    updated[index] = { ...updated[index], [key]: value };
    setTeam(updated);
  };

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
      "대상의 턴제 버프 감소",
      "기절",
      "링크",
      "기절 면역",
      "디버프 해제",
      "방어력 증가",
      "감쇄",
      "감전",
      "물리 공격력 증가",
      "부활",
      "화상",
      "모든 공격력 감소",
      "방어력 감소",
      "물리 취약",
      "마법 취약",
      "약점 공격 확률 증가",
      "침묵",
      "물리 피해량 증가",
      "모든 피해 무효화",
      "빙결",
      "최대 생명력 비례 공격력 증가",
      "최대 생명력 비례 방어력 증가",
      "효과 적중 증가",
      "효과 저항 증가",
      "효과 적용 확률 증가",
      "피해 대상이 1명 줄어들 때마다",
      "만큼 피해량 증가",
      "관통",
      "공격력 비례 방어력 증가",
      "반격",
      "즉사",
      "불사",
      "감전",
      "출혈",
      "스킬 쿨타임 증가",
      "석화",
      "모든 피해 면역",
      "버프 해제",
      "처형",
      "보호막",
      "영멸",
      "받는 회복량 감소",
      "권능",
      "치명타 확률",
      "치명타 피해",
      "수면",
      "방어 무시",
      "마법 공격력 증가",
      "마법 피해량 증가",
      "마법 공격력 감소",
      "마법 피해 면역",
      "지속 회복",
      "화상 면역",
      "실명",
      "매의 발톱",
      "흡혈",
      "연속 발동",
      "치명타 확률 증가",
      "치명타 피해 증가",
      "물리 피해 면역",
      "도발",
      "현재 생명력 비율을",
      "로 전환",
      "중독",
      "저격 자세",
      "위장",
      "사냥술",
      "출혈 면역",
      "마비 면역",
      "물리 공격력 감소",
      "중독 면역",
      "막기 확률 증가",
      "물리 감쇄",
      "빗나감 활률 증가",
      "피해량 감소",
      "고정 피해",
      "회복 불가",
      "감전 면역",
      "마력 정화",
      "피해량 감소",
      "석화 면역",
      "마비",
      "피해량 증가",
      "방어무시",
      "빙결 면역",
      "효과 저항 감소",
      "출혈 폭발",
      "집중 공격",
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

  const interpolateStat = (base, max, level) => {
    const ratio = (level - 1) / (30 - 1); // 1레벨~30레벨 선형 비율
    return Math.round(base + (max - base) * ratio);
  };

  const [activeTab, setActiveTab] = useState("스킬");

  function getItemStatDescription(item) {
    if (!item) return "";

    const level = item.level ?? 0;
    const isWeapon = item.type === "무기";
    const isArmor = item.type === "방어구";
    const isAccessory = item.type === "장신구";

    const desc = [];

    if (isWeapon) {
      desc.push(`공격력 +${64 + 16 * level}`);
    }
    if (isArmor) {
      desc.push(`방어력 +${39 + 10 * level}`);
      desc.push(`생명력 +${224 + 57 * level}`);
    }
    if (isAccessory) {
      const bonus = 2.5 + 0.5 * level;
      desc.push(`공격력 +${bonus.toFixed(1)}%`);
      desc.push(`방어력 +${bonus.toFixed(1)}%`);
      desc.push(`생명력 +${bonus.toFixed(1)}%`);
    }

    return desc.join(", ");
  }

  return (
    <div className="team-page page">
      <h1>팀 편성</h1>

      <div className="team-slots">
        {team.map((member, index) => {
          if (!member) {
            return (
              <div key={index} className="team-slot-wrapper">
                <div
                  className="team-slot"
                  onClick={() => handleSlotClick(index)}
                >
                  <span className="empty">캐릭터 선택</span>
                </div>
              </div>
            );
          }

          const { level = 1, enhance = 0, transcend = 0 } = member;
          const skillIndex = selectedSkill[index];

          return (
            <div key={index} className="team-slot-wrapper">
              <div className="team-slot-top">
                <div
                  className="team-slot"
                  onClick={() => handleSlotClick(index)}
                >
                  <img
                    src={`/도감/${member.group}/아이콘/${member.name}.png`}
                    alt={member.name}
                  />
                </div>

                <div className="stat-settings">
                  {[
                    {
                      label: "레벨",
                      toggle: true,
                    },
                    {
                      label: "강화",
                      value: enhance,
                      setValue: (v) => updateStat(index, "enhance", v),
                      min: 0,
                      max: 5,
                    },
                    {
                      label: "초월",
                      value: transcend,
                      setValue: (v) => updateStat(index, "transcend", v),
                      min: 0,
                      max: 12,
                    },
                  ].map(({ label, value, setValue, min, max, toggle }) => (
                    <div className="stat-adjust-box" key={label}>
                      <span className="stat-label">{label}</span>
                      {toggle && label === "레벨" ? (
                        <div className="level-toggle-buttons">
                          <button
                            className={level === 1 ? "active" : ""}
                            onClick={() => updateStat(index, "level", 1)}
                          >
                            기본
                          </button>
                          <button
                            className={level === 30 ? "active" : ""}
                            onClick={() => updateStat(index, "level", 30)}
                          >
                            최대
                          </button>
                        </div>
                      ) : (
                        <div className="stat-stepper">
                          <button
                            onClick={() => setValue(Math.max(min, value - 1))}
                            disabled={value <= min}
                          >
                            ◀
                          </button>
                          <span className="stat-value-text">
                            {label === "강화" ? `+${value}` : value}
                          </span>
                          <button
                            onClick={() => setValue(Math.min(max, value + 1))}
                            disabled={value >= max}
                          >
                            ▶
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="team-info-bottom">
                <div className="tab-buttons">
                  {["스킬", "스탯", "장비"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={activeTab === tab ? "active-tab" : ""}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="tab-content">
                  {activeTab === "스킬" && (
                    <div className="skill-window">
                      <div className="skill-icons">
                        {[...Array(4)].map((_, i) => (
                          <img
                            key={i}
                            src={`/도감/${member.group}/스킬/${member.name}-${
                              i + 1
                            }.png`}
                            alt={`스킬 ${i + 1}`}
                            className={`skill-icon ${
                              skillIndex === i ? "selected" : ""
                            }`}
                            onClick={() => {
                              const updated = [...selectedSkill];
                              updated[index] = i;
                              setSelectedSkill(updated);
                            }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ))}
                      </div>

                      {skillIndex !== null && member.skills?.[skillIndex] && (
                        <div className="selected-skill-box">
                          <p className="skill-title">
                            <strong>{member.skilltitle?.[skillIndex]}</strong>
                            {member.skillcooldown?.[skillIndex] > 0 &&
                              ` (쿨타임 ${member.skillcooldown[skillIndex]}초)`}
                          </p>

                          {member.skills[skillIndex].map((line, i) => {
                            let targetColor = "#ffcc00";
                            if (line.detail === "버프") targetColor = "#00ccff";
                            else if (line.detail === "공격")
                              targetColor = "#ff3300";
                            return (
                              <div key={i}>
                                {line.target && (
                                  <p
                                    className="skill-target"
                                    style={{ color: targetColor }}
                                  >
                                    {line.target}
                                  </p>
                                )}
                                -
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line.effect),
                                  }}
                                />
                              </div>
                            );
                          })}

                          {member.skillup?.[skillIndex] && (
                            <div className="skill-upgrade-box">
                              <div className="skill-upgrade-title">
                                스킬 강화 효과
                              </div>
                              {member.skillup[skillIndex].map((line, i) => (
                                <p
                                  key={i}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line),
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {(member.twotranscendenceSkillUp?.[skillIndex]
                            ?.length > 0 ||
                            member.sixtranscendenceSkillUp?.[skillIndex]
                              ?.length > 0) && (
                            <div className="skill-transcendence-section">
                              {member.twotranscendenceSkillUp?.[skillIndex]
                                ?.length > 0 && (
                                <div
                                  className={`skill-transcendence-box ${
                                    transcend >= 2 ? "active" : "inactive"
                                  }`}
                                >
                                  <p className="skill-transcendence-title">
                                    2초월 효과
                                  </p>
                                  {member.twotranscendenceSkillUp[
                                    skillIndex
                                  ].map((line, i) => (
                                    <p
                                      key={i}
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(line),
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              {member.sixtranscendenceSkillUp?.[skillIndex]
                                ?.length > 0 && (
                                <div
                                  className={`skill-transcendence-box ${
                                    transcend >= 6 ? "active" : "inactive"
                                  }`}
                                >
                                  <p className="skill-transcendence-title">
                                    6초월 효과
                                  </p>
                                  {member.sixtranscendenceSkillUp[
                                    skillIndex
                                  ].map((line, i) => (
                                    <p
                                      key={i}
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(line),
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "스탯" && (
                    <div className="stat-table">
                      {(() => {
                        const {
                          grade,
                          type,
                          level = 1,
                          enhance = 0,
                          transcend = 0,
                          transcendBonus = [],
                        } = member;

                        // 기본/최대/강화 스탯
                        const baseStats = baseStatData?.[grade]?.[type] || {};
                        const maxStats = maxStatData?.[grade]?.[type] || {};
                        const enhanceStats =
                          enhanceBonusData?.[grade]?.[type] || {};

                        const statKeys = ["공격력", "방어력", "생명력", "속공"];

                        // 1. 레벨 스탯 계산 (선형 보간)
                        const interpolatedStats = statKeys.reduce(
                          (acc, key) => {
                            const base = baseStats[key] ?? 0;
                            const max = maxStats[key] ?? base;
                            acc[key] = interpolateStat(base, max, level);
                            return acc;
                          },
                          {}
                        );

                        // 2. 초월 스탯 누적 계산 (이제 % 계산 적용)
                        const transcendStatMap = {};
                        transcendBonus
                          .slice(0, transcend)
                          .forEach(({ stat, value }) => {
                            const base = interpolatedStats[stat] ?? 0;
                            const bonus = Math.round(base * (value / 100));
                            transcendStatMap[stat] =
                              (transcendStatMap[stat] || 0) + bonus;
                          });

                        // 3. 모든 스탯 계산: 레벨 + 강화 + 초월
                        const fullStats = {
                          ...statKeys.reduce((acc, key) => {
                            const levelStat = interpolatedStats[key] ?? 0;
                            const enhanceBonus = Math.round(
                              (enhanceStats[key] ?? 0) * (enhance / 5)
                            );
                            const transcendBonusVal =
                              transcendStatMap[key] ?? 0;
                            const total =
                              levelStat + enhanceBonus + transcendBonusVal;

                            acc[key] = {
                              total,
                              levelStat,
                              enhanceBonus,
                              transcendBonus: transcendBonusVal,
                            };
                            return acc;
                          }, {}),

                          // 나머지 고정형 스탯
                          "치명타 확률": {
                            total: "5.0%",
                            levelStat: "5.0%",
                            enhanceBonus: null,
                            transcendBonus: null,
                          },
                          "치명타 피해": {
                            total: "150.0%",
                            levelStat: "150.0%",
                            enhanceBonus: null,
                            transcendBonus: null,
                          },
                          "약점 공격 확률": {
                            total: "0.0%",
                            levelStat: "0.0%",
                            enhanceBonus: null,
                            transcendBonus: null,
                          },
                          "막기 확률": {
                            total: (transcendStatMap["막기 확률"] ?? 0) + "%",
                            levelStat: "0.0%",
                            enhanceBonus: null,
                            transcendBonus: transcendStatMap["막기 확률"] ?? 0,
                          },
                          "받는 피해 감소": {
                            total: "0.0%",
                            levelStat: "0.0%",
                            enhanceBonus: null,
                            transcendBonus: null,
                          },
                          "농락 저주": {
                            total: "0.0%",
                            levelStat: "0.0%",
                            enhanceBonus: null,
                            transcendBonus: null,
                          },
                        };

                        // 4. 렌더링
                        return Object.entries(fullStats).map(
                          (
                            [
                              label,
                              {
                                total,
                                levelStat,
                                enhanceBonus,
                                transcendBonus,
                              },
                            ],
                            i
                          ) => (
                            <div key={i} className="stat-row">
                              <span className="stat-name">{label}</span>
                              <span className="stat-value">
                                <span className="total">{total}</span>
                                <span className="detail">
                                  {typeof levelStat === "number" ? (
                                    <>
                                      {" ("}
                                      {levelStat}
                                      {enhanceBonus ? (
                                        <>
                                          {" +"}
                                          <span className="enhance-bonus">
                                            {enhanceBonus}
                                          </span>
                                        </>
                                      ) : null}
                                      {transcendBonus ? (
                                        <>
                                          {" +"}
                                          <span className="transcend-bonus">
                                            {transcendBonus}
                                          </span>
                                        </>
                                      ) : null}
                                      {")"}
                                    </>
                                  ) : (
                                    ` (${levelStat})`
                                  )}
                                </span>
                              </span>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  )}

                  {activeTab === "장비" && (
                    <div className="equipment-grid">
                      {["무기0", "무기1", "방어구0", "방어구1", "장신구0"].map(
                        (slotKey) => {
                          const item = teamEquipments[index]?.[slotKey];

                          return (
                            <div
                              key={slotKey}
                              className="equip-slot"
                              onClick={() => {
                                setSelectedEquipSlot({
                                  memberIndex: index,
                                  slotKey,
                                });
                                setEquipmentModalOpen(true);
                              }}
                            >
                              {item ? (
                                <div className="equipped-item">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="equip-image"
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      setTeamEquipments((prev) => {
                                        const updated = [...prev];
                                        const current = { ...updated[index] };
                                        delete current[slotKey];
                                        updated[index] = current;
                                        return updated;
                                      });
                                    }}
                                  />
                                  <div className="equipment-desc">
                                    <span className="equip-name">
                                      {item.name}
                                    </span>
                                    <div className="equip-stats">
                                      {getItemStatDescription(item)}
                                    </div>
                                    <div className="enhance-controls">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTeamEquipments((prev) => {
                                            const updated = [...prev];
                                            const current = {
                                              ...updated[index],
                                            };
                                            const currentItem = {
                                              ...current[slotKey],
                                            };
                                            currentItem.level = Math.max(
                                              0,
                                              (currentItem.level || 0) - 1
                                            );
                                            current[slotKey] = currentItem;
                                            updated[index] = current;
                                            return updated;
                                          });
                                        }}
                                      >
                                        -
                                      </button>
                                      <span className="equip-level">
                                        +{item.level ?? 0}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTeamEquipments((prev) => {
                                            const updated = [...prev];
                                            const current = {
                                              ...updated[index],
                                            };
                                            const currentItem = {
                                              ...current[slotKey],
                                            };
                                            currentItem.level = Math.min(
                                              15,
                                              (currentItem.level || 0) + 1
                                            );
                                            current[slotKey] = currentItem;
                                            updated[index] = current;
                                            return updated;
                                          });
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="empty-text">
                                  클릭하여 장비
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectingIndex !== null && (
        <CharacterSelectPopup
          onSelect={handleSelect}
          onClose={() => setSelectingIndex(null)}
        />
      )}

      {equipmentModalOpen && selectedEquipSlot && (
        <div className="equipment-modal-overlay">
          <div className="equipment-modal">
            <button
              className="close-modal"
              onClick={() => setEquipmentModalOpen(false)}
            >
              ✕
            </button>
            <h3>
              {selectedEquipSlot.slotKey.startsWith("무기")
                ? "무기 장비 선택"
                : selectedEquipSlot.slotKey.startsWith("방어구")
                ? "방어구 장비 선택"
                : "장신구 장비 선택"}
            </h3>
            <div className="equipment-list">
              {equipmentData
                .filter((item) => {
                  const key = selectedEquipSlot.slotKey;
                  const expectedType = key.startsWith("무기")
                    ? "무기"
                    : key.startsWith("방어구")
                    ? "방어구"
                    : "장신구";
                  return item.type === expectedType;
                })
                .map((item) => {
                  const key = selectedEquipSlot.slotKey;
                  const hero = team[selectedEquipSlot.memberIndex];
                  const isMagic = ["마법", "치유"].includes(hero?.type);
                  let imagePath = item.image;

                  if (item.type === "무기") {
                    imagePath = isMagic
                      ? item.image2 || item.image1 || item.image
                      : item.image1 || item.image;
                  }

                  return (
                    <div
                      key={item.id}
                      className="equipment-item"
                      onClick={() => {
                        setTeamEquipments((prev) => {
                          const updated = [...prev];
                          const displayName =
                            item.type === "무기"
                              ? isMagic
                                ? item.name2 || item.name1
                                : item.name1
                              : item.name;

                          updated[selectedEquipSlot.memberIndex] = {
                            ...updated[selectedEquipSlot.memberIndex],
                            [selectedEquipSlot.slotKey]: {
                              ...item,
                              image: imagePath,
                              name: displayName, // 무기 타입에 따라 name1 or name2 저장
                            },
                          };

                          return updated;
                        });
                        setEquipmentModalOpen(false);
                      }}
                    >
                      <img src={imagePath} alt={item.name} />
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
