import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import "./HeroDetail.css";

export default function HeroDetail() {
  const { name } = useParams();
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("스킬");

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
    const patterns = [/\d+턴/g, /\d+회/g, /\d+%/g];

    let highlighted = text;
    patterns.forEach((regex) => {
      highlighted = highlighted.replace(
        regex,
        (match) =>
          `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
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
                        {hero.twotranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div className="skill-transcendence-box">
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
                        {hero.sixtranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div className="skill-transcendence-box">
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
              <div className="stat-list">
                {[
                  { label: "물리 공격력", value: "522" },
                  { label: "방어력", value: "657" },
                  { label: "생명력", value: "3,470" },
                  { label: "속공", value: "19" },
                  { label: "치명타 확률", value: "5%" },
                  { label: "치명타 피해", value: "150%" },
                  { label: "약점 공격 확률", value: "0%" },
                  { label: "막기 확률", value: "0%" },
                  { label: "받기 피해 감소", value: "0%" },
                  { label: "효과 적중", value: "0%" },
                  { label: "효과 저항", value: "0%" },
                ].map((stat, i) => (
                  <div key={i} className="stat-row">
                    <div className="stat-left">
                      <span className="stat-label">{stat.label}</span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
