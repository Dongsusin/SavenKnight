import { useState } from "react";
import heroes from "../data/heroes.json";
import "./SummonSimulation.css";

// 소환 등급 확률
function getGradeByProbability() {
  const rand = Math.random() * 100;
  if (rand < 1) return "S";
  if (rand < 15) return "A";
  if (rand < 55) return "B";
  return "C";
}

function isWishlistFullySelected(wishlist) {
  return (
    wishlist.group1.length === MAX_SELECT.group1 &&
    wishlist.group2.length === MAX_SELECT.group2 &&
    wishlist.group3.length === MAX_SELECT.group3
  );
}

function getHeroProbability(hero, wishlistGroups) {
  const grade = hero.grade;
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  const isReady = isWishlistFullySelected(wishlistGroups);
  if (!isReady) return null;

  if (grade === "S") {
    const selected = [...wishlistGroups.group1, ...wishlistGroups.group2];
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 0.1;
    const remainingWeight = 1 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    return selected.includes(hero.name) ? selectedWeight : otherWeight;
  }

  if (grade === "A") {
    const selected = wishlistGroups.group3;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 1.75;
    const remainingWeight = 14 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    return selected.includes(hero.name) ? selectedWeight : otherWeight;
  }

  return null;
}

// 확률 기반 영웅 선택 (위시 반영)
function getRandomHeroByGrade(grade, wishlistGroups) {
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );
  if (candidates.length === 0) return null;

  const wishlistReady = isWishlistFullySelected(wishlistGroups);

  if (!wishlistReady || (grade !== "S" && grade !== "A")) {
    // 균등 확률 처리
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  let weights = [];

  if (grade === "S") {
    const selected = [...wishlistGroups.group1, ...wishlistGroups.group2];
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 0.1;
    const remainingWeight = 1 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    weights = candidates.map((h) =>
      selected.includes(h.name) ? selectedWeight : otherWeight
    );
  } else if (grade === "A") {
    const selected = wishlistGroups.group3;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 1.75;
    const remainingWeight = 14 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    weights = candidates.map((h) =>
      selected.includes(h.name) ? selectedWeight : otherWeight
    );
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  const rand = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < candidates.length; i++) {
    acc += weights[i];
    if (rand <= acc) return candidates[i];
  }

  return candidates[candidates.length - 1];
}

function summonTenHeroes(wishlistGroups, guaranteedS = false) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getGradeByProbability();
    const hero = getRandomHeroByGrade(grade, wishlistGroups);
    if (hero) results.push({ ...hero, flipped: false });
  }

  const lastGrade = guaranteedS ? "S" : getGradeByProbability();
  const lastHero = getRandomHeroByGrade(lastGrade, wishlistGroups);
  if (lastHero) results.push({ ...lastHero, flipped: false });

  return results;
}

function getWishlistGroup(hero) {
  if (hero.grade === "S" && hero.group === "스페셜") return "group1";
  if (hero.grade === "S") return "group2";
  if (hero.grade === "A") return "group3";
  return null;
}

const MAX_SELECT = {
  group1: 2,
  group2: 3,
  group3: 4,
};

export default function SummonSimulation() {
  const [summonedHeroes, setSummonedHeroes] = useState([]);
  const [summonCount, setSummonCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState({
    group1: [],
    group2: [],
    group3: [],
  });

  const handleSummon = () => {
    setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));
    const guaranteedS = summonCount >= 9;
    const newHeroes = summonTenHeroes(wishlist, guaranteedS);
    const hasS = newHeroes.some((h) => h.grade === "S");

    setTimeout(() => {
      setSummonedHeroes(newHeroes);
      setSummonCount((prev) => (hasS ? 0 : prev + 1));
    }, 400);
  };

  const handleFlip = (idx) => {
    setSummonedHeroes((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, flipped: true } : h))
    );
  };

  const handleWishlistClick = (hero) => {
    const group = getWishlistGroup(hero);
    if (!group) return;

    const selected = wishlist[group].includes(hero.name);
    if (selected) {
      setWishlist((prev) => ({
        ...prev,
        [group]: prev[group].filter((name) => name !== hero.name),
      }));
    } else {
      if (wishlist[group].length >= MAX_SELECT[group]) return;
      setWishlist((prev) => ({
        ...prev,
        [group]: [...prev[group], hero.name],
      }));
    }
  };

  const progressPercent = (summonCount / 10) * 100;

  return (
    <div className="summon-page page">
      <h2 className="summon-title">소환 시뮬레이션</h2>

      <div className="button-row">
        <button className="summon-button" onClick={handleSummon}>
          10회 소환
        </button>
        <button
          className="wishlist-toggle-button"
          onClick={() => setShowWishlist((prev) => !prev)}
        >
          위시리스트 {showWishlist ? "닫기" : "열기"}
        </button>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercent}%` }}
        />
        <div className="progress-text">{`${summonCount * 10}/100`}</div>
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

      {showWishlist && (
        <div className="wishlist-tooltip">
          <h3>위시리스트 선택</h3>

          {/* 그룹 1 */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">
              그룹 1: 스페셜 S급 (최대 2명)
            </h4>
            <div className="wishlist-grid">
              {heroes
                .filter(
                  (h) =>
                    h.grade === "S" &&
                    h.group === "스페셜" &&
                    !h.excludeFromSummon
                )
                .map((hero) => {
                  const selected = wishlist.group1.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(2)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 그룹 2 */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">
              그룹 2: 일반 S급 (최대 3명)
            </h4>
            <div className="wishlist-grid">
              {heroes
                .filter(
                  (h) =>
                    h.grade === "S" &&
                    h.group !== "스페셜" &&
                    !h.excludeFromSummon
                )
                .map((hero) => {
                  const selected = wishlist.group2.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(2)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 그룹 3 */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">그룹 3: A급 (최대 4명)</h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "A" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group3.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist);
                  return (
                    <div key={hero.name} className="wishlist-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                        className={`wishlist-hero ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleWishlistClick(hero)}
                      />
                      <div className="wishlist-prob">
                        {prob !== null ? `${prob.toFixed(2)}%` : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {!isWishlistFullySelected(wishlist) && (
        <div className="wishlist-warning">
          ⚠️ 모든 그룹에서 정확한 수만큼 선택해야 위시 확률이 적용됩니다.
        </div>
      )}
    </div>
  );
}
