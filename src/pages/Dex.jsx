import { useState } from "react";
import { Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import "./Dex.css";

const GROUPS = ["스페셜", "일반", "아소드", "아이사", "기타", "펫"];

const highlightKeywords = (text) => {
  const goldColor = "#ffcc00";
  const blueColor = "#00ccff";

  const numberPatterns = [
    /\d+%/g,
  ];

  const buffKeywords = [
    "방어력 증가",
    "물리 공격력 증가",
    "약점 공격 확률 증가",
    "피해량 증가",
    "효과 적중률 증가",
    "모든 공격력 증가",
    "효과 저항 증가",
    "치명타 확률 증가",
    "마법 공격력 증가",
    "최대 생명력 증가",
    "주는 회복량 증가",
    "막기 확률 증가",
    "치명타 피해량 증가"
  ];

  let highlighted = text;

  numberPatterns.forEach((regex) => {
    highlighted = highlighted.replace(
      regex,
      (match) =>
        `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
    );
  });

  buffKeywords
    .sort((a, b) => b.length - a.length)
    .forEach((keyword) => {
      const regex = new RegExp(keyword, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
      );
    });

  return highlighted;
};


export default function Dex() {
  const [selectedGroup, setSelectedGroup] = useState("스페셜");

  const isPetGroup = selectedGroup === "펫";
  const entries = isPetGroup
    ? pets
    : heroes.filter((hero) => hero.group === selectedGroup);

  const categoryKey = isPetGroup ? "rarity" : "category";
  const categories = [...new Set(entries.map((entry) => entry[categoryKey]))];

  return (
    <div className="page hero-dex">
      <aside className="hero-dex-sidebar">
        {GROUPS.map((group) => (
          <div
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={selectedGroup === group ? "active" : ""}
          >
            {group}
          </div>
        ))}
      </aside>

      <main className="hero-dex-content">
        <h2>{selectedGroup}</h2>

        {categories.map((category) => {
          const filtered = entries.filter((entry) => entry[categoryKey] === category);

          return (
            <section key={category} className="category-section">
              <h3>{category}</h3>
              <div className="hero-cards">
                {filtered.map((entry) => {
                  const imagePath = isPetGroup
                    ? `/도감/펫/아이콘/${entry.name}.png`
                    : `/도감/${entry.group}/아이콘/${entry.name}.png`;

                  const skillPath = isPetGroup
                    ? `/도감/펫/스킬/${entry.name}.png`
                    : null;
                  return isPetGroup ? (
                    <div key={entry.id} className="hero-card">
                      <img src={imagePath} alt={entry.name} className="image" />
                      {skillPath && (
                        <div className="pet-skill-tooltip-wrapper">
                          <img
                            src={skillPath}
                            alt={entry.name}
                            className="pet-skill-icon"
                          />
                         <div className="skill-tooltip">
                            <strong>{entry.skill}</strong>
                            {Array.isArray(entry.skillDescription) ? (
                              entry.skillDescription.map((line, idx) => (
                                <div
                                  key={idx}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line),
                                  }}
                                />
                              ))
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: highlightKeywords(entry.skillDescription),
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={`/hero/${entry.name}`} key={entry.id}>
                      <div className="hero-card">
                        <img src={imagePath} alt={entry.name} className="image" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}