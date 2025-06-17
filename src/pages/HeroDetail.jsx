import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import "./HeroDetail.css";

export default function HeroDetail() {
  const { name } = useParams();
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);

  useEffect(() => {
    setSelectedSkillIndex(0);
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

    const patterns = [
      /\d+턴/g, // 3턴
      /\d+회/g, // 2회
      /\d+%/g, // 85%
    ];

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
    <div className="hero-detail">
      <Link to="/" className="back-button">
        ← 돌아가기
      </Link>

      <section className="hero-info">
        <h2>{hero.name}</h2>
        <p className="info-category">{hero.category}</p>
        <div className="hero-image-with-nav">
          {prevHero ? (
            <Link
              to={`/hero/${prevHero.name}`}
              className="side-nav-button left"
            >
              ←
            </Link>
          ) : (
            <span className="side-nav-button left disabled">←</span>
          )}
          <img src={imagePath} alt={hero.name} className="main-image" />
          {nextHero ? (
            <Link
              to={`/hero/${nextHero.name}`}
              className="side-nav-button right"
            >
              →
            </Link>
          ) : (
            <span className="side-nav-button right disabled">→</span>
          )}
        </div>

        <p className="info-title">{hero.title}</p>

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
                          typeof line.effect === "string" ? line.effect : ""
                        ),
                      }}
                    />
                  </div>
                );
              })}

              {/* 스킬 강화 효과 */}
              {hero.skillup && hero.skillup[selectedSkillIndex] && (
                <div className="skill-upgrade-box">
                  <div className="skill-upgrade-title">스킬 강화 효과</div>
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
              {(hero.twotranscendenceSkillUp?.[selectedSkillIndex]?.length >
                0 ||
                hero.sixtranscendenceSkillUp?.[selectedSkillIndex]?.length >
                  0) && (
                <div style={{ marginTop: "10px" }}>
                  {hero.twotranscendenceSkillUp?.[selectedSkillIndex]?.length >
                    0 && (
                    <div className="skill-transcendence-box">
                      <p className="skill-transcendence-title">2초월 효과</p>
                      {hero.twotranscendenceSkillUp[selectedSkillIndex].map(
                        (line, i) => (
                          <p
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: highlightKeywords(line),
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                  {hero.sixtranscendenceSkillUp?.[selectedSkillIndex]?.length >
                    0 && (
                    <div className="skill-transcendence-box">
                      <p className="skill-transcendence-title">6초월 효과</p>
                      {hero.sixtranscendenceSkillUp[selectedSkillIndex].map(
                        (line, i) => (
                          <p
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: highlightKeywords(line),
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
      </section>
    </div>
  );
}
