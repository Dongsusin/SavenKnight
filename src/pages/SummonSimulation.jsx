import { useState } from "react";
import heroes from "../data/heroes.json";
import "./SummonSimulation.css";

function getGradeByProbability() {
  const rand = Math.random() * 100;
  if (rand < 1) return "S";
  if (rand < 15) return "A";
  if (rand < 55) return "B";
  return "C";
}

function getRandomHeroByGrade(grade) {
  const candidates = heroes.filter(
    (hero) => hero.grade === grade && hero.excludeFromSummon !== true
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function summonTenHeroes(guaranteedS = false) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getGradeByProbability();
    const hero = getRandomHeroByGrade(grade);
    if (hero) results.push({ ...hero, flipped: false });
  }

  const lastGrade = guaranteedS ? "S" : getGradeByProbability();
  const lastHero = getRandomHeroByGrade(lastGrade);
  if (lastHero) results.push({ ...lastHero, flipped: false });

  return results;
}

export default function SummonSimulation() {
  const [summonedHeroes, setSummonedHeroes] = useState([]);
  const [pendingHeroes, setPendingHeroes] = useState([]);
  const [summonCount, setSummonCount] = useState(0); // 0 ~ 9

  const handleSummon = () => {
    setSummonedHeroes((prev) =>
      prev.map((hero) => ({ ...hero, flipped: false }))
    );

    const guaranteedS = summonCount >= 9;
    const newHeroes = summonTenHeroes(guaranteedS);

    const hasSGrade = newHeroes.some((hero) => hero.grade === "S");

    setPendingHeroes(newHeroes);
    setTimeout(() => {
      setSummonedHeroes(newHeroes);
      setSummonCount((prev) => (hasSGrade ? 0 : prev + 1));
    }, 400);
  };

  const handleFlip = (index) => {
    setSummonedHeroes((prev) =>
      prev.map((hero, i) => (i === index ? { ...hero, flipped: true } : hero))
    );
  };

  const progressPercent = (summonCount / 10) * 100;
  const currentProgress = summonCount * 10;

  return (
    <div className="summon-page page">
      <h2 className="summon-title">소환 시뮬레이션</h2>
      <button className="summon-button" onClick={handleSummon}>
        10회 소환
      </button>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="progress-text">{`${currentProgress}/100`}</div>
      </div>

      <div className="card-grid">
        {summonedHeroes.map((hero, idx) => (
          <div
            key={idx}
            className={`card ${hero.flipped ? "flipped" : ""} ${
              hero.grade === "S" ? "grade-S" : ""
            }`}
            onClick={() => handleFlip(idx)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={
                    hero.grade === "S" || hero.grade === "A"
                      ? "/스페셜.png"
                      : "/일반.png"
                  }
                  alt="카드 뒷면"
                  className="card-image"
                />
              </div>

              <div className="card-back">
                <img
                  src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                  alt={hero.name}
                  className="card-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
