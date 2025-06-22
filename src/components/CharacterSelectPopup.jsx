import React from "react";
import heroes from "../data/heroes.json";
import "./CharacterSelectPopup.css";

export default function CharacterSelectPopup({ onSelect, onClose }) {
  const filteredHeroes = heroes.filter((h) => h.group !== "펫");

  const allGroups = [
    ...new Set(filteredHeroes.map((h) => h.group)),
  ];

  const grouped = allGroups.map((group) => {
    const groupHeroes = filteredHeroes.filter((h) => h.group === group);
    const categories = [...new Set(groupHeroes.map((h) => h.category))];

    const categorized = categories.map((category) => ({
      category,
      heroes: groupHeroes.filter((h) => h.category === category),
    }));

    return {
      group,
      categorized,
    };
  });

  return (
    <div className="popup-overlay page" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>캐릭터 선택</h3>
        {grouped.map(({ group, categorized }) => (
          <div key={group} className="group-section">
            <h4>{group}</h4>
            {categorized.map(({ category, heroes }) => (
              <div key={category} className="category-Select-section">
                <h5>{category}</h5>
                <div className="character-Select-grid">
                  {heroes.map((hero) => (
                    <div
                      key={hero.id}
                      className="character-Select-card"
                      onClick={() => onSelect(hero)}
                    >
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
