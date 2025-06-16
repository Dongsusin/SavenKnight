import { useState } from "react";
import { Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import "./Dex.css";

const groups = ["스페셜", "일반", "아소드", "아이사", "기타"];

export default function Dex() {
  const [selectedGroup, setSelectedGroup] = useState("스페셜");

  const groupHeroes = heroes.filter((hero) => hero.group === selectedGroup);

  const categories = [...new Set(groupHeroes.map((hero) => hero.category))];

  return (
    <div className="page hero-dex">
      <aside className="hero-dex-sidebar">
        {groups.map((group) => (
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
          const categoryHeroes = groupHeroes.filter(
            (hero) => hero.category === category
          );

          return (
            <section key={category} className="category-section">
              <h3>{category}</h3>
              <div className="hero-cards">
                {categoryHeroes.map((hero) => {
                  const imagePath = `/도감/${hero.group}/아이콘/${hero.name}.png`;
                  return (
                    <Link to={`/hero/${hero.name}`}>
                      <div key={hero.id} className="hero-card">
                        <img src={imagePath} alt={hero.name} />
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
