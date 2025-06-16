import React from "react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

  const imagePath = `/도감/${hero.group}/아이콘/${hero.name}.png`;

  const skillImages = [];
  for (let i = 1; i <= 4; i++) {
    const skillPath = `/도감/${hero.group}/스킬/${hero.name}-${i}.png`;
    skillImages.push(skillPath);
  }

  return (
    <div className="hero-detail">
      <Link to="/" className="back-button">
        ← 돌아가기
      </Link>

      <section className="hero-info">
        <h2>{hero.name}</h2>
        <p className="info-category">{hero.category}</p>
        <img src={imagePath} alt={hero.name} className="main-image" />
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
                    <p className="skill-target" style={{ color: targetColor }}>
                      {line.target}
                    </p>
                    -<span>{line.effect}</span>
                  </div>
                );
              })}

              {/* 스킬 강화 효과 박스 */}
              {hero.skillup && hero.skillup[selectedSkillIndex] && (
                <div className="skill-upgrade-box">
                  <div className="skill-upgrade-title">스킬 강화 효과</div>
                  {hero.skillup[selectedSkillIndex].map((line, i) => (
                    <div key={i}>
                      <p style={{ color: "#ffffff" }}>{line}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 초월 효과 박스 */}
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
                          <p key={i}>{line}</p>
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
                          <p key={i}>{line}</p>
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
