import React, { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./HeroDetail.css";

export default function HeroDetail() {
  const { name } = useParams();
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("스킬");
  const [level, setLevel] = useState(1);
  const [enhance, setEnhance] = useState(0);
  const [transcend, setTranscend] = useState(0);

  const statByGradeAndType = {
    S: {
      공격: { 공격력: 239, 생명력: 92, 방어력: 535, 속공: 29 },
      마법: { 공격력: 239, 생명력: 92, 방어력: 535, 속공: 29 },
      만능: { 공격력: 211, 생명력: 102, 방어력: 594, 속공: 25 },
      방어: { 공격력: 116, 생명력: 135, 방어력: 773, 속공: 19 },
      치유: { 공격력: 176, 생명력: 108, 방어력: 714, 속공: 19 },
    },
    A: {
      공격: { 공격력: 221, 생명력: 88, 방어력: 510, 속공: 25 },
      마법: { 공격력: 221, 생명력: 88, 방어력: 510, 속공: 25 },
      만능: { 공격력: 197, 생명력: 98, 방어력: 567, 속공: 21 },
      방어: { 공격력: 108, 생명력: 129, 방어력: 735, 속공: 16 },
      치유: { 공격력: 165, 생명력: 104, 방어력: 680, 속공: 16 },
    },
  };

  const maxStatByGradeAndType = {
    S: {
      공격: { 공격력: 1080, 생명력: 411, 방어력: 2391, 속공: 29 },
      마법: { 공격력: 1080, 생명력: 411, 방어력: 2391, 속공: 29 },
      만능: { 공격력: 936, 생명력: 479, 방어력: 2653, 속공: 25 },
      방어: { 공격력: 522, 생명력: 657, 방어력: 3470, 속공: 19 },
      치유: { 공격력: 785, 생명력: 485, 방어력: 3208, 속공: 19 },
    },
    A: {
      공격: { 공격력: 1004, 생명력: 378, 방어력: 2279, 속공: 25 },
      마법: { 공격력: 1004, 생명력: 378, 방어력: 2279, 속공: 25 },
      만능: { 공격력: 893, 생명력: 446, 방어력: 2539, 속공: 21 },
      방어: { 공격력: 514, 생명력: 593, 방어력: 3287, 속공: 16 },
      치유: { 공격력: 745, 생명력: 452, 방어력: 3058, 속공: 16 },
    },
  };

  const enhanceBonusByGradeAndType = {
    S: {
      공격: { 공격력: 84, 생명력: 32, 방어력: 237 },
      마법: { 공격력: 84, 생명력: 32, 방어력: 237 },
      만능: { 공격력: 74, 생명력: 36, 방어력: 208 },
      방어: { 공격력: 41, 생명력: 47, 방어력: 271 },
      치유: { 공격력: 62, 생명력: 38, 방어력: 250 },
    },
    A: {
      공격: { 공격력: 77, 생명력: 31, 방어력: 179 },
      마법: { 공격력: 77, 생명력: 31, 방어력: 179 },
      만능: { 공격력: 69, 생명력: 34, 방어력: 197 },
      방어: { 공격력: 38, 생명력: 45, 방어력: 257 },
      치유: { 공격력: 58, 생명력: 36, 방어력: 238 },
    },
  };

  function AnimatedNumber({ value, duration = 500 }) {
    const [displayValue, setDisplayValue] = useState(value);
    const raf = useRef(null);
    const start = useRef(null);
    const from = useRef(value);

    useEffect(() => {
      from.current = displayValue;
      cancelAnimationFrame(raf.current);
      start.current = null;

      const step = (timestamp) => {
        if (!start.current) start.current = timestamp;
        const progress = Math.min((timestamp - start.current) / duration, 1);
        const next = Math.floor(
          from.current + (value - from.current) * progress
        );
        setDisplayValue(next);
        if (progress < 1) {
          raf.current = requestAnimationFrame(step);
        }
      };

      raf.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf.current);
    }, [value, duration]);

    return <span>{displayValue.toLocaleString()}</span>;
  }

  useEffect(() => {
    setSelectedSkillIndex(0);
    setActiveTab("스킬");
  }, [name]);

  const allHeroes = heroes.flat ? heroes.flat() : heroes;
  const hero = allHeroes.find((h) => h.name === name);
  if (!hero) return <div>존재하지 않는 영웅입니다.</div>;

  const sortedHeroes = [...allHeroes].sort((a, b) => a.id - b.id);
  const currentIndex = sortedHeroes.findIndex((h) => h.id === hero.id);
  const prevHero = sortedHeroes[currentIndex - 1] || null;
  const nextHero = sortedHeroes[currentIndex + 1] || null;

  const imagePath = `/도감/${hero.group}/아이콘/${hero.name}.png`;

  const skillImages = [];
  for (let i = 1; i <= 4; i++) {
    const skillPath = `/도감/${hero.group}/스킬/${hero.name}-${i}.png`;
    skillImages.push(skillPath);
  }

  const highlightKeywords = (text) => {
    const goldColor = "#ffcc00";
    const blueColor = "#00ccff";

    const numberPatterns = [/\d+턴/g, /\d+회/g, /\d+%/g];

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

  return (
    <div className="hero-detail page">
      <Link to="/" className="back-button">
        ← 돌아가기
      </Link>

      {prevHero ? (
        <Link to={`/hero/${prevHero.name}`} className="nav-button fixed-left">
          ←
        </Link>
      ) : (
        <span className="nav-button fixed-left disabled">←</span>
      )}

      {nextHero ? (
        <Link to={`/hero/${nextHero.name}`} className="nav-button fixed-right">
          →
        </Link>
      ) : (
        <span className="nav-button fixed-right disabled">→</span>
      )}

      <section className="hero-info">
        <div className="info-left">
          <h2>{hero.name}</h2>
          <p className="info-category">{hero.category}</p>
          <img src={imagePath} alt={hero.name} className="main-image" />
          <p className="info-title">{hero.title}</p>

          {/* 레벨/강화/초월 설정 박스 항상 표시 */}
          <div className="stat-settings">
            {[
              { label: "레벨", toggle: true },
              {
                label: "강화",
                value: enhance,
                setValue: setEnhance,
                min: 0,
                max: 5,
              },
              {
                label: "초월",
                value: transcend,
                setValue: setTranscend,
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
                      onClick={() => setLevel(1)}
                    >
                      기본
                    </button>
                    <button
                      className={level === 30 ? "active" : ""}
                      onClick={() => setLevel(30)}
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
                      <FaChevronLeft />
                    </button>
                    <span className="stat-value-text">
                      {label === "강화" ? `+${value}` : value}
                    </span>
                    <button
                      onClick={() => setValue(Math.min(max, value + 1))}
                      disabled={value >= max}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="info-right">
          {/* 탭 버튼 */}
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

          {/* 탭 내용 */}
          {activeTab === "스킬" && (
            <>
              <h3>스킬</h3>
              <div className="skill-images">
                {skillImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`스킬 ${i + 1}`}
                    onClick={() => setSelectedSkillIndex(i)}
                    onError={(e) => (e.target.style.display = "none")}
                    className={selectedSkillIndex === i ? "selected" : ""}
                  />
                ))}
              </div>

              {selectedSkillIndex !== null &&
                hero.skills &&
                hero.skills[selectedSkillIndex] && (
                  <div className="skill-description">
                    <p className="skill-title">
                      <strong>{hero.skilltitle?.[selectedSkillIndex]}</strong>
                      {hero.skillcooldown?.[selectedSkillIndex] > 0 &&
                        ` (쿨타임 ${hero.skillcooldown[selectedSkillIndex]}초)`}
                    </p>

                    {hero.skills[selectedSkillIndex].map((line, i) => {
                      let targetColor = "#ffcc00";
                      if (line.detail === "버프") targetColor = "#00ccff";
                      else if (line.detail === "공격") targetColor = "#ff3300";
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
                              __html: highlightKeywords(
                                typeof line.effect === "string"
                                  ? line.effect
                                  : ""
                              ),
                            }}
                          />
                        </div>
                      );
                    })}

                    {/* 스킬 강화 효과 */}
                    {hero.skillup && hero.skillup[selectedSkillIndex] && (
                      <div className="skill-upgrade-box">
                        <div className="skill-upgrade-title">
                          스킬 강화 효과
                        </div>
                        {hero.skillup[selectedSkillIndex].map((line, i) => (
                          <p
                            key={i}
                            style={{ color: "#ffffff" }}
                            dangerouslySetInnerHTML={{
                              __html: highlightKeywords(line),
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* 초월 효과 */}
                    {(hero.twotranscendenceSkillUp?.[selectedSkillIndex]
                      ?.length > 0 ||
                      hero.sixtranscendenceSkillUp?.[selectedSkillIndex]
                        ?.length > 0) && (
                      <div style={{ marginTop: "10px" }}>
                        {/* 2초월 */}
                        {hero.twotranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div
                            className={`skill-transcendence-box ${
                              transcend >= 2 ? "active" : "inactive"
                            }`}
                          >
                            <p className="skill-transcendence-title">
                              2초월 효과
                            </p>
                            {hero.twotranscendenceSkillUp[
                              selectedSkillIndex
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

                        {/* 6초월 */}
                        {hero.sixtranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div
                            className={`skill-transcendence-box ${
                              transcend >= 6 ? "active" : "inactive"
                            }`}
                          >
                            <p className="skill-transcendence-title">
                              6초월 효과
                            </p>
                            {hero.sixtranscendenceSkillUp[
                              selectedSkillIndex
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
            </>
          )}

          {activeTab === "장비" && (
            <div className="equipment-section">
              <h3>장비</h3>
              <div className="equipment-grid">
                <div className="equip-slot weapon"></div>
                <div className="equip-slot armor"></div>
                <div className="equip-slot accessory"></div>
                <div className="equip-slot weapon"></div>
                <div className="equip-slot armor"></div>
                <div className="empty-slot"></div>{" "}
              </div>
            </div>
          )}

          {activeTab === "스탯" && (
            <div className="stat-section">
              <h3>스탯</h3>

              {["S", "A"].includes(hero.grade) ? (
                <>
                  <div className="stat-list">
                    {(() => {
                      const statBase =
                        hero.grade && hero.type
                          ? level === 30
                            ? maxStatByGradeAndType?.[hero.grade]?.[hero.type]
                            : statByGradeAndType?.[hero.grade]?.[hero.type]
                          : null;

                      const enhanceBonus =
                        hero.grade && hero.type
                          ? enhanceBonusByGradeAndType?.[hero.grade]?.[
                              hero.type
                            ]
                          : null;

                      const getFinalStat = (
                        base = 0,
                        enhancePerStep = 0,
                        statKey
                      ) => {
                        const enhanceBonus = enhancePerStep * enhance;

                        const transcendArray = hero.transcendBonus || [];

                        const basePercent = transcendArray
                          .slice(0, Math.min(transcend, 6))
                          .filter((t) => t.stat === statKey)
                          .reduce((sum, t) => sum + t.value, 0);

                        const extraPercent =
                          transcend > 6 &&
                          ["공격력", "생명력", "방어력"].includes(statKey)
                            ? (transcend - 6) * 2
                            : 0;

                        const totalPercent = basePercent + extraPercent;
                        const transcendBonus = Math.floor(
                          base * (totalPercent / 100)
                        );

                        return {
                          base,
                          enhanceBonus,
                          transcendBonus,
                          value: base,
                          total: base + enhanceBonus + transcendBonus,
                        };
                      };

                      const getFixedStatWithTranscend = (
                        basePercent,
                        statKey
                      ) => {
                        const transcendArray = hero.transcendBonus || [];

                        const baseTranscend = transcendArray
                          .slice(0, Math.min(transcend, 6))
                          .filter((t) => t.stat === statKey)
                          .reduce((sum, t) => sum + t.value, 0);

                        const extraTranscend =
                          transcend > 6 &&
                          ["공격력", "생명력", "방어력"].includes(statKey)
                            ? (transcend - 6) * 2
                            : 0;

                        const totalBonus = baseTranscend + extraTranscend;

                        return {
                          base: basePercent,
                          transcendBonus: totalBonus,
                          value: `${basePercent}%`,
                        };
                      };

                      const dynamicStats = statBase
                        ? [
                            {
                              label: "물리 공격력",
                              ...getFinalStat(
                                statBase.공격력,
                                enhanceBonus?.공격력,
                                "공격력"
                              ),
                            },
                            {
                              label: "생명력",
                              ...getFinalStat(
                                statBase.생명력,
                                enhanceBonus?.생명력,
                                "생명력"
                              ),
                            },
                            {
                              label: "방어력",
                              ...getFinalStat(
                                statBase.방어력,
                                enhanceBonus?.방어력,
                                "방어력"
                              ),
                            },
                            {
                              label: "속공",
                              ...getFinalStat(statBase.속공, 0, "속공"),
                            },
                          ]
                        : [];

                      const fixedStats = [
                        {
                          label: "치명타 확률",
                          ...getFixedStatWithTranscend(5, "치명타 확률"),
                        },
                        {
                          label: "치명타 피해",
                          ...getFixedStatWithTranscend(150, "치명타 피해"),
                        },
                        {
                          label: "약점 공격 확률",
                          ...getFixedStatWithTranscend(0, "약점 공격 확률"),
                        },
                        {
                          label: "막기 확률",
                          ...getFixedStatWithTranscend(0, "막기 확률"),
                        },
                        {
                          label: "받기 피해 감소",
                          ...getFixedStatWithTranscend(0, "받기 피해 감소"),
                        },
                        {
                          label: "효과 적중",
                          ...getFixedStatWithTranscend(0, "효과 적중"),
                        },
                        {
                          label: "효과 저항",
                          ...getFixedStatWithTranscend(0, "효과 저항"),
                        },
                      ];

                      const finalStats = [...dynamicStats, ...fixedStats];

                      return finalStats.map((stat, i) => (
                        <div key={i} className="stat-row">
                          <div className="stat-left">
                            <span className="stat-label">{stat.label}</span>
                          </div>
                          <div className="stat-value">
                            {typeof stat.value === "number" ? (
                              <>
                                <span
                                  style={{
                                    color: "#FFD700",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <AnimatedNumber value={stat.total} />
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.9em",
                                    marginLeft: "6px",
                                  }}
                                >
                                  (
                                  <span style={{ color: "#FFFFFF" }}>
                                    {stat.base.toLocaleString()}
                                  </span>
                                  {stat.enhanceBonus > 0 && (
                                    <span style={{ color: "#00FF66" }}>
                                      {" + " +
                                        stat.enhanceBonus.toLocaleString()}
                                    </span>
                                  )}
                                  {stat.transcendBonus > 0 && (
                                    <span style={{ color: "#FF6666" }}>
                                      {" + " +
                                        stat.transcendBonus.toLocaleString()}
                                    </span>
                                  )}
                                  )
                                </span>
                              </>
                            ) : (
                              <>
                                <span
                                  style={{
                                    color: "#FFD700",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {parseFloat(
                                    stat.base + stat.transcendBonus
                                  ).toFixed(1)}
                                  %
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.9em",
                                    marginLeft: "6px",
                                  }}
                                >
                                  (
                                  <span style={{ color: "#FFFFFF" }}>
                                    {stat.base}%
                                  </span>
                                  {stat.transcendBonus > 0 && (
                                    <span style={{ color: "#FF6666" }}>
                                      {" "}
                                      + {stat.transcendBonus}%
                                    </span>
                                  )}
                                  )
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </>
              ) : (
                <p style={{ color: "#aaa", textAlign: "center" }}>
                  해당 등급은 스탯 정보가 제공되지 않습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
