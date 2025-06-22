import React, { useState } from "react";
import heroes from "../data/heroes.json";
import CharacterSelectPopup from "../components/CharacterSelectPopup";
import "./Team.css";

export default function Team() {
  const [team, setTeam] = useState(Array(5).fill(null));
  const [selectingIndex, setSelectingIndex] = useState(null);

  const handleSelect = (hero) => {
    const updated = [...team];
    updated[selectingIndex] = hero;
    setTeam(updated);
    setSelectingIndex(null);
  };

  return (
    <div className="team-page">
      <h1>팀 편성</h1>
      <div className="team-slots">
        {team.map((member, index) => (
          <div key={index} className="team-slot" onClick={() => setSelectingIndex(index)}>
            {member ? (
              <img
                src={`/도감/${member.group}/아이콘/${member.name}.png`}
                alt={member.name}
              />
            ) : (
              <span className="empty">캐릭터 선택</span>
            )}
          </div>
        ))}
      </div>

      {selectingIndex !== null && (
        <CharacterSelectPopup
            onSelect={(hero) => {
            const updated = [...team];
            updated[selectingIndex] = hero;
            setTeam(updated);
            setSelectingIndex(null);
            }}
            onClose={() => setSelectingIndex(null)}
        />
        )}
    </div>
  );
}
