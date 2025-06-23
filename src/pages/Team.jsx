import React, { useState } from "react";
import CharacterSelectPopup from "../components/CharacterSelectPopup";
import baseStatData from "../data/statByGradeAndType.json";
import maxStatData from "../data/maxStatByGradeAndType.json";
import enhanceBonusData from "../data/enhanceBonusByGradeAndType.json";
import equipmentData from "../data/equipment.json";
import weaponMainStatTable from "../data/weaponMainStatTable.json";
import armorMainStatTable from "../data/armorMainStatTable.json";
import subStatTable from "../data/subStatTable.json";
import setEffectTable from "../data/setEffectTable.json";
import pets from "../data/pets.json";
import "./Team.css";

export default function Team() {
  const [team, setTeam] = useState(Array(5).fill(null));
  const [selectingIndex, setSelectingIndex] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(Array(5).fill(null));
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [selectedEquipSlot, setSelectedEquipSlot] = useState(null);
  const [teamEquipments, setTeamEquipments] = useState(Array(5).fill({}));
  const [teamSubstats, setTeamSubstats] = useState(Array(5).fill({}));
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetPopupOpen, setIsPetPopupOpen] = useState(false);

  const [teamSubstatUpgrades, setTeamSubstatUpgrades] = useState(
    Array(5).fill({})
  );

  const handleSelect = (hero) => {
    const updated = [...team];
    updated[selectingIndex] = {
      ...hero,
      level: 1,
      enhance: 0,
      transcend: 0,
      transcendBonus: hero.transcendBonus ?? [],
      passives: hero.passives ?? [], // ✅ 이 줄이 없으면 패시브 누락됨!
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

  const handleClearCharacter = (index) => {
    setTeam((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setSelectedSkill((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
    setTeamEquipments((prev) => {
      const updated = [...prev];
      updated[index] = {};
      return updated;
    });
    setTeamSubstats((prev) => {
      const updated = [...prev];
      updated[index] = {};
      return updated;
    });
    setTeamSubstatUpgrades((prev) => {
      const updated = [...prev];
      updated[index] = {};
      return updated;
    });
  };

  function getItemStatDescription(item) {
    if (!item) return "";

    const level = parseInt(item.level ?? 0, 10);
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

  function getMainStatOptions(itemType) {
    return Object.keys(
      itemType === "무기" ? weaponMainStatTable : armorMainStatTable
    );
  }

  function getSubStatOptions() {
    return Object.keys(subStatTable);
  }

  function calcMainStat(index, key, statName, level, isWeapon) {
    const table = isWeapon ? weaponMainStatTable : armorMainStatTable;
    const entry = table[statName];
    if (!entry) return null;

    const total = entry.base + level * entry.perLevel;
    return entry.isPercent ? `${total.toFixed(1)}%` : Math.floor(total);
  }

  function calcSubStat(statName, level) {
    const entry = subStatTable[statName];
    if (!entry) return null;

    const bonusSteps = Math.floor(level / 3);
    const total = entry.base + bonusSteps * entry.per3Level;
    return entry.isPercent ? `${total.toFixed(1)}%` : Math.floor(total);
  }

  function getAvailableSubstatPoints(level) {
    let points = 0;
    if (level >= 9) points++;
    if (level >= 12) points++;
    if (level >= 15) points++;
    return points;
  }

  function getTeamSetCounts(equipments) {
    const counts = {};
    Object.values(equipments).forEach((item) => {
      if (!item?.set) return;
      counts[item.set] = (counts[item.set] || 0) + 1;
    });
    return counts;
  }

  function getEquipmentStatBonus(index, statKey) {
    let flatBonus = 0;
    let percentBonus = 0;

    const percentToBaseStatMap = {
      "공격력%": "공격력",
      "방어력%": "방어력",
      "생명력%": "생명력",
      "속공%": "속공",
      "치명타 확률%": "치명타 확률",
      "치명타 피해%": "치명타 피해",
      "약점 공격 확률%": "약점 공격 확률",
      "막기 확률%": "막기 확률",
      "받는 피해 감소%": "받는 피해 감소",
      "효과 적중%": "효과 적중",
      "효과 저항%": "효과 저항",
    };

    // ✅ 물리/마법 공격력은 내부 비교 시 "공격력"으로 매핑
    const matchStatKey =
      statKey === "물리 공격력" || statKey === "마법 공격력"
        ? "공격력"
        : statKey;

    const equips = teamEquipments[index] || {};
    const subs = teamSubstats[index] || {};
    const upgrades = teamSubstatUpgrades[index] || {};
    const setCounts = getTeamSetCounts(equips);

    Object.entries(equips).forEach(([key, equip]) => {
      if (!equip) return;

      const isWeapon = equip.type === "무기";
      const isArmor = equip.type === "방어구";
      const level = equip.level ?? 0;

      // 1. 기본 장비 평면 보너스
      if (isWeapon && matchStatKey === "공격력") {
        flatBonus += 64 + 16 * level;
      }

      if (isArmor) {
        if (matchStatKey === "방어력") flatBonus += 39 + 10 * level;
        if (matchStatKey === "생명력") flatBonus += 224 + 57 * level;
      }

      // 2. 주 스탯
      const mainStat = subs?.[key]?.main;
      if (mainStat) {
        const val = getMainStatValue(mainStat, level, isWeapon);
        const mappedKey = percentToBaseStatMap[mainStat] || mainStat;
        if (mappedKey === matchStatKey) {
          if (typeof val === "string" && val.endsWith("%")) {
            percentBonus += parseFloat(val);
          } else {
            flatBonus += parseFloat(val);
          }
        }
      }

      // 3. 부 스탯
      const subList = subs?.[key]?.subs || [];
      const upgradeList = upgrades?.[key] || {};
      subList.forEach((sub, i) => {
        if (!sub) return;
        const entry = subStatTable[sub];
        if (!entry) return;

        const points = upgradeList[i] || 0;
        const level = points * 3;
        const bonusSteps = Math.floor(level / 3);
        const total = entry.base + bonusSteps * entry.per3Level;

        const mappedKey = percentToBaseStatMap[sub] || sub;
        if (mappedKey === matchStatKey) {
          if (entry.isPercent) {
            percentBonus += total;
          } else {
            flatBonus += total;
          }
        }
      });

      // 4. 장신구 퍼센트 보너스
      if (equip.type === "장신구") {
        const bonus = 2.5 + 0.5 * level;
        if (matchStatKey === "공격력") percentBonus += bonus;
        if (matchStatKey === "방어력") percentBonus += bonus;
        if (matchStatKey === "생명력") percentBonus += bonus;
      }
    });

    // 5. 세트 효과
    Object.entries(setCounts).forEach(([setName, count]) => {
      const effect = setEffectTable[setName];
      if (!effect) return;
      const chosen =
        count >= 4
          ? effect["4세트"] ?? []
          : count >= 2
          ? effect["2세트"] ?? []
          : [];
      chosen.forEach(({ stat, value }) => {
        const mapped = percentToBaseStatMap[stat] || stat.replace("%", "");
        if (mapped === matchStatKey) percentBonus += value;
      });
    });

    return { flatBonus, percentBonus };
  }

  function getMainStatValue(statName, level, isWeapon) {
    const table = isWeapon ? weaponMainStatTable : armorMainStatTable;
    const entry = table[statName];
    if (!entry) return 0;
    const total = entry.base + level * entry.perLevel;
    return entry.isPercent ? total : Math.floor(total);
  }

  function parsePassiveEffectLine(effect) {
    const regex = /^(.+?)\s([\d.]+)%?$/;
    const match = effect.match(regex);
    if (!match) return null;

    const rawStat = match[1].trim();
    const value = parseFloat(match[2]);

    // ✅ stat 이름 매핑
    const statMap = {
      "받는 피해량": "받는 피해 감소",
      "받는 피해 감소": "받는 피해 감소",
      "피해량 감소": "받는 피해 감소",
      방어력: "방어력",
      공격력: "공격력",
      생명력: "생명력",
      속공: "속공",
      "치명타 확률": "치명타 확률",
      "치명타 피해": "치명타 피해",
      "약점 공격 확률": "약점 공격 확률",
      "막기 확률": "막기 확률",
      "효과 적중": "효과 적중",
      "효과 저항": "효과 저항",
      // 필요 시 추가
    };

    const stat = statMap[rawStat] || rawStat;

    return {
      stat,
      value,
      type: "percent", // 모두 % 처리
    };
  }

  function getTotalPassiveBonuses(team, index = null, pet = null) {
    const selfOnly = {};
    const teamWide = {};

    team.forEach((member, i) => {
      if (!member?.passives) return;

      member.passives.forEach(({ target, effect }) => {
        const parsed = parsePassiveEffectLine(effect);
        if (!parsed) return;

        const { stat, value, type } = parsed;
        const targetMap = target === "self" ? selfOnly : teamWide;

        if (target === "self" && index !== null && i !== index) return;

        if (!targetMap[stat]) targetMap[stat] = { flat: 0, percent: 0 };
        targetMap[stat][type] += value;
      });
    });

    // ✅ 펫 효과도 포함
    if (pet?.skillDescription) {
      const descList = Array.isArray(pet.skillDescription)
        ? pet.skillDescription
        : [pet.skillDescription];
      descList.forEach((desc) => {
        const parsed = parsePassiveEffectLine(
          desc.replace(/\[.*?\]/g, "").trim()
        );
        if (!parsed) return;
        const { stat, value, type } = parsed;

        if (!teamWide[stat]) teamWide[stat] = { flat: 0, percent: 0 };
        teamWide[stat][type] += value;
      });
    }

    const result = {};
    const allStats = new Set([
      ...Object.keys(teamWide),
      ...Object.keys(selfOnly),
    ]);

    allStats.forEach((stat) => {
      result[stat] = {
        flat: (teamWide[stat]?.flat ?? 0) + (selfOnly[stat]?.flat ?? 0),
        percent:
          (teamWide[stat]?.percent ?? 0) + (selfOnly[stat]?.percent ?? 0),
      };
    });

    return result;
  }

  return (
    <div className="team-page page">
      <h1>팀 편성</h1>

      <div className="pet-select-wrapper">
        {selectedPet ? (
          <div className="selected-pet-box">
            <button
              className="pet-clear-button"
              onClick={() => setSelectedPet(null)}
            >
              ✕
            </button>
            <img
              src={`/도감/펫/아이콘/${selectedPet.name}.png`}
              alt={selectedPet.name}
              onClick={() => setIsPetPopupOpen(true)}
            />
            <div className="selected-pet-name">{selectedPet.name}</div>
            <div className="selected-pet-effect">
              {Array.isArray(selectedPet.skillDescription)
                ? selectedPet.skillDescription.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))
                : selectedPet.skillDescription}
            </div>
          </div>
        ) : (
          <div
            className="empty-pet-box"
            onClick={() => setIsPetPopupOpen(true)}
          >
            <span>펫 선택</span>
          </div>
        )}
      </div>

      <div className="team-slots">
        {team.map((member, index) => {
          if (!member) {
            return (
              <div
                key={index}
                className="team-slot-wrapper"
                onClick={() => handleSlotClick(index)}
              >
                <div className="team-slot">
                  <span className="empty">캐릭터 선택</span>
                </div>
              </div>
            );
          }

          const { level = 1, enhance = 0, transcend = 0 } = member;
          const skillIndex = selectedSkill[index];

          return (
            <div key={index} className="team-slot-wrapper">
              <div className="team-slot-top" style={{ position: "relative" }}>
                {/* ✕ 버튼 추가 */}
                <button
                  className="clear-character-button"
                  onClick={() => handleClearCharacter(index)}
                  title="캐릭터 비우기"
                >
                  ✕
                </button>

                <div
                  className="team-slot"
                  onClick={() => handleSlotClick(index)}
                >
                  <img
                    src={`/도감/${member.group}/아이콘/${member.name}.png`}
                    alt={member.name}
                  />
                </div>

                <div className="team-stat-settings">
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

                        const baseStats = baseStatData?.[grade]?.[type] || {};
                        const maxStats = maxStatData?.[grade]?.[type] || {};
                        const enhanceStats =
                          enhanceBonusData?.[grade]?.[type] || {};

                        const effectiveAtkStat =
                          type === "마법" || type === "치유"
                            ? "마법 공격력"
                            : "물리 공격력";

                        if (baseStats["공격력"] !== undefined) {
                          baseStats[effectiveAtkStat] = baseStats["공격력"];
                        }
                        if (maxStats["공격력"] !== undefined) {
                          maxStats[effectiveAtkStat] = maxStats["공격력"];
                        }
                        if (enhanceStats["공격력"] !== undefined) {
                          enhanceStats[effectiveAtkStat] =
                            enhanceStats["공격력"];
                        }

                        const statKeys = [
                          effectiveAtkStat,
                          "방어력",
                          "생명력",
                          "속공",
                        ];

                        const percentStats = [
                          "치명타 확률",
                          "치명타 피해",
                          "약점 공격 확률",
                          "막기 확률",
                          "받는 피해 감소",
                          "효과 적중",
                          "효과 저항",
                        ];

                        const interpolatedStats = statKeys.reduce(
                          (acc, key) => {
                            const base = baseStats[key] ?? 0;
                            const max = maxStats[key] ?? base;
                            acc[key] = interpolateStat(base, max, level);
                            return acc;
                          },
                          {}
                        );

                        const transcendStatMap = {};
                        transcendBonus
                          .slice(0, Math.min(transcend, 6))
                          .forEach(({ stat, value }) => {
                            const targetStat =
                              stat === "공격력" ? effectiveAtkStat : stat;
                            const levelBase =
                              interpolatedStats[targetStat] ?? 0;
                            const enhanceBonus =
                              (enhanceStats[targetStat] ?? 0) * enhance;
                            const baseWithEnhance = levelBase + enhanceBonus;
                            const bonus = Math.round(
                              baseWithEnhance * (value / 100)
                            );
                            transcendStatMap[targetStat] =
                              (transcendStatMap[targetStat] || 0) + bonus;
                          });

                        const extraPercent =
                          transcend > 6 ? (transcend - 6) * 2 : 0;
                        ["공격력", "방어력", "생명력"].forEach((statKey) => {
                          const targetStat =
                            statKey === "공격력" ? effectiveAtkStat : statKey;
                          if (extraPercent > 0) {
                            const levelBase =
                              interpolatedStats[targetStat] ?? 0;
                            const enhanceBonus =
                              (enhanceStats[targetStat] ?? 0) * enhance;
                            const baseWithEnhance = levelBase + enhanceBonus;
                            const bonus = Math.floor(
                              baseWithEnhance * (extraPercent / 100)
                            );
                            transcendStatMap[targetStat] =
                              (transcendStatMap[targetStat] || 0) + bonus;
                          }
                        });

                        const passiveBonuses = getTotalPassiveBonuses(
                          team,
                          index
                        );

                        const fullStats = {
                          ...statKeys.reduce((acc, key) => {
                            const levelStat = interpolatedStats[key] ?? 0;
                            const enhanceBonus =
                              (enhanceStats[key] ?? 0) * enhance;
                            const transcendBonusVal =
                              transcendStatMap[key] ?? 0;
                            const equipmentBonus = getEquipmentStatBonus(
                              index,
                              key
                            );
                            const passiveFlat = passiveBonuses[key]?.flat ?? 0;
                            const passivePercent =
                              passiveBonuses[key]?.percent ?? 0;

                            const baseWithEnhance = levelStat + enhanceBonus;
                            const fromEquipPercent = Math.floor(
                              (baseWithEnhance *
                                (equipmentBonus.percentBonus || 0)) /
                                100
                            );
                            const fromPassivePercent = Math.floor(
                              (baseWithEnhance * (passivePercent || 0)) / 100
                            );

                            const total =
                              baseWithEnhance +
                              transcendBonusVal +
                              equipmentBonus.flatBonus +
                              fromEquipPercent +
                              passiveFlat +
                              fromPassivePercent;

                            acc[key] = {
                              total,
                              levelStat,
                              enhanceBonus,
                              transcendBonus: transcendBonusVal,
                              equipmentBonusTotal:
                                equipmentBonus.flatBonus + fromEquipPercent,
                              passiveBonusTotal:
                                passiveFlat + fromPassivePercent,
                            };
                            return acc;
                          }, {}),

                          ...percentStats.reduce((acc, key) => {
                            const base = {
                              "치명타 확률": 5.0,
                              "치명타 피해": 150.0,
                              "약점 공격 확률": 0.0,
                              "막기 확률": 0.0,
                              "받는 피해 감소": 0.0,
                              "효과 적중": 0.0,
                              "효과 저항": 5.0,
                            }[key];

                            const equipmentBonus = getEquipmentStatBonus(
                              index,
                              key
                            );
                            const passiveFlat = passiveBonuses[key]?.flat ?? 0;
                            const passivePercent =
                              passiveBonuses[key]?.percent ?? 0;

                            const total =
                              base +
                              equipmentBonus.flatBonus +
                              equipmentBonus.percentBonus +
                              passiveFlat +
                              passivePercent;

                            acc[key] = {
                              total: `${total.toFixed(1)}%`,
                              levelStat: `${base.toFixed(1)}%`,
                              enhanceBonus: null,
                              transcendBonus: null,
                              equipmentBonusTotal:
                                equipmentBonus.flatBonus +
                                equipmentBonus.percentBonus,
                              passiveBonusTotal: passiveFlat + passivePercent,
                            };
                            return acc;
                          }, {}),
                        };

                        return (
                          <>
                            {Object.entries(fullStats).map(
                              (
                                [
                                  label,
                                  {
                                    total,
                                    levelStat,
                                    enhanceBonus,
                                    transcendBonus,
                                    equipmentBonusTotal,
                                    passiveBonusTotal,
                                  },
                                ],
                                i
                              ) => (
                                <div key={i} className="stat-row">
                                  <span className="stat-name">{label}</span>
                                  <span className="stat-value-text">
                                    <span className="text-yellow-400 font-bold">
                                      {total}
                                    </span>
                                    {percentStats.includes(label) ? (
                                      <span className="text-sm text-gray-400">
                                        {" ("}
                                        <span className="text-gray-400">
                                          {levelStat}
                                        </span>
                                        {equipmentBonusTotal > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-blue-400">
                                              {equipmentBonusTotal.toFixed(1)}%
                                            </span>
                                          </>
                                        )}
                                        {passiveBonusTotal > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-purple-400">
                                              {passiveBonusTotal.toFixed(1)}%
                                            </span>
                                          </>
                                        )}
                                        {")"}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-gray-400">
                                        {" ("}
                                        <span className="text-gray-400">
                                          {levelStat}
                                        </span>
                                        {enhanceBonus > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-green-400">
                                              {enhanceBonus}
                                            </span>
                                          </>
                                        )}
                                        {transcendBonus > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-red-400">
                                              {transcendBonus}
                                            </span>
                                          </>
                                        )}
                                        {equipmentBonusTotal > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-blue-400">
                                              {equipmentBonusTotal}
                                            </span>
                                          </>
                                        )}
                                        {passiveBonusTotal > 0 && (
                                          <>
                                            {" + "}
                                            <span className="text-purple-400">
                                              {passiveBonusTotal}
                                            </span>
                                          </>
                                        )}
                                        {")"}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              )
                            )}

                            {/* 범례 */}
                            <div className="text-stat">
                              <span className="text-yellow-400">●</span> 총합
                              <span className="text-gray-400">●</span> 기본
                              <span className="text-green-400">●</span> 강화
                              <span className="text-red-400">●</span> 초월
                              <span className="text-blue-400">●</span> 장비
                              <span className="text-purple-400">●</span> 스킬
                            </div>

                            {/* 장신구 특수효과 */}
                            {(() => {
                              const accessories = Object.values(
                                team[index]?.equipments || {}
                              ).filter((item) => item?.type === "장신구");
                              const effects = accessories
                                .map((item) => item.specialEffect)
                                .filter(Boolean);

                              return effects.length > 0 ? (
                                <div
                                  style={{
                                    marginTop: "8px",
                                    padding: "6px 10px",
                                    border: "1px dashed #888",
                                    borderRadius: "8px",
                                    backgroundColor: "#222",
                                    color: "#FFD700",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  <strong>장신구 특수효과</strong>
                                  <ul
                                    style={{
                                      marginTop: "4px",
                                      color: "#fff",
                                      paddingLeft: "20px",
                                    }}
                                  >
                                    {effects.map((label, idx) => (
                                      <li key={idx}>{label}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null;
                            })()}
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {activeTab === "장비" && (
                    <div className="equipment-grid">
                      {["무기0", "무기1", "방어구0", "방어구1", "장신구0"].map(
                        (slotKey) => {
                          const item = teamEquipments[index]?.[slotKey];
                          const substat = teamSubstats[index]?.[slotKey] || {};
                          const upgrades =
                            teamSubstatUpgrades[index]?.[slotKey] || {};
                          const totalPoints = getAvailableSubstatPoints(
                            item?.level ?? 0
                          );
                          const currentUsed = Object.values(upgrades).reduce(
                            (sum, v) => sum + v,
                            0
                          );
                          const remainingPoints = totalPoints - currentUsed;

                          return (
                            <div
                              key={slotKey}
                              className="equip-slot"
                              onClick={() => {
                                if (!item) {
                                  // 장비가 없을 때만 모달 열기
                                  setSelectedEquipSlot({
                                    memberIndex: index,
                                    slotKey,
                                  });
                                  setEquipmentModalOpen(true);
                                }
                              }}
                            >
                              {item ? (
                                <div className="equipped-item">
                                  <div className="equipped-item-top">
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
                                  {/* 💡 부가옵션 설정 UI 추가 */}
                                  {item.type !== "장신구" && (
                                    <div className="substat-selection">
                                      <p className="substat-title">
                                        부가 스탯 선택
                                      </p>

                                      {/* 주스탯 */}
                                      <div className="substat-row">
                                        <label>주스탯:</label>
                                        <select
                                          value={substat.main || ""}
                                          onChange={(e) => {
                                            setTeamSubstats((prev) => {
                                              const updated = [...prev];
                                              const current = {
                                                ...(updated[index] || {}),
                                              };
                                              current[slotKey] = {
                                                ...(current[slotKey] || {}),
                                                main: e.target.value,
                                              };
                                              updated[index] = current;
                                              return updated;
                                            });
                                          }}
                                        >
                                          <option value="">선택</option>
                                          {getMainStatOptions(item.type).map(
                                            (stat) => (
                                              <option key={stat} value={stat}>
                                                {stat}
                                              </option>
                                            )
                                          )}
                                        </select>
                                        {substat.main && (
                                          <span className="stat-value-text">
                                            {calcMainStat(
                                              index,
                                              slotKey,
                                              substat.main,
                                              item.level ?? 0,
                                              item.type === "무기"
                                            )}
                                          </span>
                                        )}
                                      </div>

                                      {/* 부스탯 4개 */}
                                      {[0, 1, 2, 3].map((i) => {
                                        const subName = substat.subs?.[i] || "";
                                        const points = upgrades[i] ?? 0;

                                        return (
                                          <div className="substat-row" key={i}>
                                            <label>부스탯 {i + 1}:</label>
                                            <select
                                              value={subName}
                                              onChange={(e) => {
                                                const updatedSubs = [
                                                  ...(substat.subs || []),
                                                ];
                                                updatedSubs[i] = e.target.value;
                                                setTeamSubstats((prev) => {
                                                  const updated = [...prev];
                                                  const current = {
                                                    ...(updated[index] || {}),
                                                  };
                                                  current[slotKey] = {
                                                    ...current[slotKey],
                                                    subs: updatedSubs,
                                                  };
                                                  updated[index] = current;
                                                  return updated;
                                                });
                                              }}
                                            >
                                              <option value="">선택</option>
                                              {getSubStatOptions().map(
                                                (stat) => (
                                                  <option
                                                    key={stat}
                                                    value={stat}
                                                  >
                                                    {stat}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                            {subName && (
                                              <div className="substat-point-controls">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTeamSubstatUpgrades(
                                                      (prev) => {
                                                        const updated = [
                                                          ...prev,
                                                        ];
                                                        const current = {
                                                          ...(updated[index] ||
                                                            {}),
                                                        };
                                                        const currentUpgrades =
                                                          {
                                                            ...(current[
                                                              slotKey
                                                            ] || {}),
                                                          };
                                                        currentUpgrades[i] =
                                                          Math.max(
                                                            0,
                                                            (currentUpgrades[
                                                              i
                                                            ] || 0) - 1
                                                          );
                                                        current[slotKey] =
                                                          currentUpgrades;
                                                        updated[index] =
                                                          current;
                                                        return updated;
                                                      }
                                                    );
                                                  }}
                                                  disabled={points <= 0}
                                                >
                                                  -
                                                </button>
                                                <span className="point-text">
                                                  +{points}
                                                </span>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (remainingPoints <= 0)
                                                      return;
                                                    setTeamSubstatUpgrades(
                                                      (prev) => {
                                                        const updated = [
                                                          ...prev,
                                                        ];
                                                        const current = {
                                                          ...(updated[index] ||
                                                            {}),
                                                        };
                                                        const currentUpgrades =
                                                          {
                                                            ...(current[
                                                              slotKey
                                                            ] || {}),
                                                          };
                                                        currentUpgrades[i] =
                                                          (currentUpgrades[i] ||
                                                            0) + 1;
                                                        current[slotKey] =
                                                          currentUpgrades;
                                                        updated[index] =
                                                          current;
                                                        return updated;
                                                      }
                                                    );
                                                  }}
                                                  disabled={
                                                    remainingPoints <= 0
                                                  }
                                                >
                                                  +
                                                </button>
                                                <span className="stat-value-text">
                                                  {calcSubStat(
                                                    subName,
                                                    points * 3
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  <button
                                    className="unequip-button"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      setTeamEquipments((prev) => {
                                        const updated = [...prev];
                                        const current = { ...updated[index] };
                                        delete current[slotKey];
                                        updated[index] = current;
                                        return updated;
                                      });

                                      setTeamSubstats((prev) => {
                                        const updated = [...prev];
                                        const current = { ...updated[index] };
                                        delete current[slotKey];
                                        updated[index] = current;
                                        return updated;
                                      });

                                      setTeamSubstatUpgrades((prev) => {
                                        const updated = [...prev];
                                        const current = { ...updated[index] };
                                        delete current[slotKey];
                                        updated[index] = current;
                                        return updated;
                                      });
                                    }}
                                  >
                                    ✕
                                  </button>
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
                  {(() => {
                    const setCounts = getTeamSetCounts(teamEquipments[index]);
                    return (
                      <div className="set-bonus-display">
                        <h4 style={{ color: "#FFD700", marginBottom: "6px" }}>
                          세트 효과
                        </h4>
                        {Object.entries(setCounts).map(([setName, count]) => {
                          const effect = setEffectTable[setName];
                          if (!effect) return null;

                          const lines = [];

                          if (count >= 2 && effect["2세트"]) {
                            lines.push(
                              <div
                                key={`${setName}-2`}
                                style={{ color: "#00FF66" }}
                              >
                                <strong>{setName} 2세트:</strong>{" "}
                                {effect["2세트"]
                                  .map(
                                    (e) =>
                                      `${e.stat} +${e.value}${
                                        e.stat.endsWith("%") ? "%" : ""
                                      }`
                                  )
                                  .join(", ")}
                              </div>
                            );
                          }

                          if (count >= 4 && effect["4세트"]) {
                            lines.push(
                              <div
                                key={`${setName}-4`}
                                style={{ color: "#FF6666" }}
                              >
                                <strong>{setName} 4세트:</strong>{" "}
                                {effect["4세트"]
                                  .map(
                                    (e) =>
                                      `${e.stat} +${e.value}${
                                        e.stat.endsWith("%") ? "%" : ""
                                      }`
                                  )
                                  .join(", ")}
                              </div>
                            );
                          }

                          return lines;
                        })}
                      </div>
                    );
                  })()}
                  {(() => {
                    const accessories = Object.values(
                      teamEquipments[index]
                    ).filter((item) => item?.type === "장신구");
                    const effects = accessories
                      .map((item) => item.specialEffect)
                      .filter((label) => label);

                    return effects.length > 0 ? (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "8px",
                          border: "1px dashed #888",
                          borderRadius: "6px",
                          backgroundColor: "#222",
                          color: "#FFD700",
                        }}
                      >
                        <strong>장신구 효과</strong>
                        <div style={{ marginTop: "4px" }}>
                          {effects.map((label, i) => (
                            <div
                              key={i}
                              style={{ color: "#FFFFFF", marginBottom: "4px" }}
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isPetPopupOpen && (
        <div className="pet-popup-overlay">
          <div className="pet-popup">
            <button
              className="close-btn"
              onClick={() => setIsPetPopupOpen(false)}
            >
              ✕
            </button>
            <h3>펫 선택</h3>
            <div className="pet-list">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="pet-card"
                  onClick={() => {
                    setSelectedPet(pet);
                    setIsPetPopupOpen(false);
                  }}
                >
                  <img src={`/도감/펫/아이콘/${pet.name}.png`} alt={pet.name} />
                  <span>{pet.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
