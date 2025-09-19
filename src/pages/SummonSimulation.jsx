import { useState } from "react";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import "./SummonSimulation.css";

// 확률 기반 등급 함수
function getGradeByProbability(summonCount) {
  const rand = Math.random() * 100;

  // 200회 이상 → S 또는 SS 확정
  if (summonCount >= 200) {
    // S와 SS 중 랜덤 선택
    return Math.random() < 0.5 ? "SS" : "S";
  }

  // 확률 분배
  if (rand < 0.5) return "SS"; // SS 0.5%
  if (rand < 1.0) return "S"; // S 0.5%
  if (rand < 15.0) return "A"; // A 14%
  if (rand < 55.0) return "B"; // B 40%
  return "C"; // 나머지 45%
}

// 위시리스트 선택 확인 함수
function isWishlistFullySelected(wishlist) {
  return (
    wishlist.group1.length === MAX_SELECT.group1 &&
    wishlist.group2.length === MAX_SELECT.group2 &&
    wishlist.group3.length === MAX_SELECT.group3
  );
}

// 각 영웅별 등장 확률 계산 함수
function getHeroProbability(hero, wishlistGroups, summonCount) {
  const grade = hero.grade;
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  const isReady = isWishlistFullySelected(wishlistGroups);

  // 100회 이후 확률 처리
  if (
    summonCount >= 100 &&
    (grade === "SS" || grade === "S" || grade === "A")
  ) {
    const selected =
      grade === "SS"
        ? wishlistGroups.group1
        : grade === "S"
        ? wishlistGroups.group2
        : wishlistGroups.group3;

    return selected.includes(hero.name) ? 1 / selected.length : 0;
  }

  // SS
  if (grade === "SS") {
    const selected = wishlistGroups.group1;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 0.05;
    const remainingWeight = 1 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    if (isReady) {
      return selected.includes(hero.name) ? selectedWeight : otherWeight;
    } else {
      return 1 / candidates.length;
    }
  }

  // S
  if (grade === "S") {
    const selected = wishlistGroups.group2;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 0.1;
    const remainingWeight = 1 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    if (isReady) {
      return selected.includes(hero.name) ? selectedWeight : otherWeight;
    } else {
      return 1 / candidates.length;
    }
  }

  // A
  if (grade === "A") {
    const selected = wishlistGroups.group3;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 1.75;
    const remainingWeight = 14 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    if (isReady) {
      return selected.includes(hero.name) ? selectedWeight : otherWeight;
    } else {
      return 14 / candidates.length;
    }
  }

  return null;
}

// 등급에 따라 무작위 영웅 추출
function getRandomHeroByGrade(grade, wishlistGroups, summonCount) {
  let candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  const wishlistReady = isWishlistFullySelected(wishlistGroups);

  if (
    summonCount >= 100 &&
    (grade === "SS" || grade === "S" || grade === "A")
  ) {
    const selected =
      grade === "SS"
        ? wishlistGroups.group1
        : grade === "S"
        ? wishlistGroups.group2
        : wishlistGroups.group3;
    candidates = candidates.filter((h) => selected.includes(h.name));
  }

  if (!wishlistReady || (grade !== "SS" && grade !== "S" && grade !== "A")) {
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  let weights = [];

  if (grade === "SS") {
    const selected = wishlistGroups.group1;
    const selectedCount = selected.length;
    const otherCount = candidates.filter(
      (h) => !selected.includes(h.name)
    ).length;

    const selectedWeight = 0.05;
    const remainingWeight = 1 - selectedCount * selectedWeight;
    const otherWeight = otherCount > 0 ? remainingWeight / otherCount : 0;

    weights = candidates.map((h) =>
      selected.includes(h.name) ? selectedWeight : otherWeight
    );
  } else if (grade === "S") {
    const selected = wishlistGroups.group2;
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

// 등급에 따라 무작위 펫 추출
function getRandomPetByGrade(grade, petData) {
  const candidates = petData.filter((p) => p.grade === grade);
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

// 영웅 10연차 소환 처리 함수
function summonTenHeroes(wishlistGroups, guaranteedS = false, summonCount = 0) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getGradeByProbability(summonCount);
    const hero = getRandomHeroByGrade(grade, wishlistGroups, summonCount);
    if (hero) results.push({ ...hero, flipped: false });
  }

  let lastHero;

  // 확정 로직 필요시 SS/S 따로 넣을 수 있음
  const lastGrade = guaranteedS ? "S" : getGradeByProbability(summonCount);
  const hero = getRandomHeroByGrade(lastGrade, wishlistGroups, summonCount);
  lastHero = hero ? { ...hero, flipped: false } : null;

  if (lastHero) results.push(lastHero);
  return results;
}

// 펫 10연차 소환 처리 함수
function summonTenPets(petData, summonCount) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getPetGradeByProbability();
    const pet = getRandomPetByGrade(grade, petData);
    if (pet) results.push({ ...pet, flipped: false });
  }
  const grade = getPetGradeByProbability();
  const pet = getRandomPetByGrade(grade, petData);
  if (pet) results.push({ ...pet, flipped: false });

  return results;
}

// 위시리스트 그룹 판단 함수
function getWishlistGroup(hero) {
  if (hero.grade === "SS") return "group1";
  if (hero.grade === "S") return "group2";
  if (hero.grade === "A") return "group3";
  return null;
}

// 펫 소환 최종 확률 함수
function getPetGradeByProbability() {
  const rand = Math.random() * 100;
  if (rand < 1) return "S";
  if (rand < 10) return "A";
  if (rand < 41.5) return "B";
  return "C";
}

// 위시리스트 그룹별 최대 선택 개수
const MAX_SELECT = {
  group1: 1, // SS
  group2: 3, // S
  group3: 4, // A
};

export default function SummonSimulation() {
  const [summonedHeroes, setSummonedHeroes] = useState([]);
  const [summonCount, setSummonCount] = useState(0);
  const [showWishlist, setShowWishlist] = useState(false);
  const [petSummonCount, setPetSummonCount] = useState(0);
  const [summonedPets, setSummonedPets] = useState([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [wishlist, setWishlist] = useState({
    group1: [],
    group2: [],
    group3: [],
  });

  // 펫 소환
  const handlePetSummon = () => {
    setSummonedPets((prev) => prev.map((p) => ({ ...p, flipped: false })));
    const newPets = summonTenPets(pets, petSummonCount);
    const hasS = newPets.some((p) => p.grade === "S");

    setTimeout(() => {
      setSummonedPets(newPets);
      setPetSummonCount((prev) => {
        if (hasS) return 0;
        return Math.min(prev + 10, 100);
      });
    }, 400);
  };

  // 영웅 소환
  const handleSummon = () => {
    setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));
    const newHeroes = summonTenHeroes(wishlist, false, summonCount);
    const hasS = newHeroes.some((h) => h.grade === "S" || h.grade === "SS");
    const hasPickupS = newHeroes.some(
      (h) =>
        (h.grade === "S" || h.grade === "SS") &&
        [...wishlist.group1, ...wishlist.group2].includes(h.name)
    );

    setTimeout(() => {
      setSummonedHeroes(newHeroes);
      setSummonCount((prev) => {
        if (hasPickupS) return 0;
        if (hasS && prev < 100) return 100;
        return Math.min(prev + 10, 200);
      });
    }, 400);
  };

  // 카드 뒤집기
  const handleFlip = (idx) => {
    setSummonedHeroes((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, flipped: true } : h))
    );
  };

  // 위시리스트 클릭
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

  const handlePetFlip = (idx) => {
    setSummonedPets((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, flipped: true } : p))
    );
  };

  const progressPercent = Math.min((summonCount / 200) * 100, 100);

  return (
    <div className="summon-page page">
      <h2 className="summon-title">소환 시뮬레이션</h2>
      <div className="button-row">
        <button
          className="summon-button"
          onClick={() => {
            handleSummon();
            setActiveTab("hero");
          }}
          disabled={!isWishlistFullySelected(wishlist)}
        >
          영웅 10회 소환
        </button>

        <button
          className="summon-button"
          onClick={() => {
            handlePetSummon();
            setActiveTab("pet");
          }}
        >
          펫 10회 소환
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
        <div className="progress-text">{`영웅 소환${summonCount}/200`}</div>
      </div>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(petSummonCount / 100) * 100}%` }}
        />
        <div className="progress-text">{`펫소환 ${petSummonCount}/100`}</div>
      </div>
      {activeTab === "hero" && (
        <div className="card-grid">
          {summonedHeroes.map((hero, idx) => (
            <div
              key={idx}
              className={`card ${hero.flipped ? "flipped" : ""} ${
                hero.grade === "SS"
                  ? "grade-SS"
                  : hero.grade === "S"
                  ? "grade-S"
                  : ""
              }`}
              onClick={() => handleFlip(idx)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={
                      hero.grade === "SS" ||
                      hero.grade === "S" ||
                      hero.grade === "A"
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
      )}
      {activeTab === "pet" && (
        <div className="card-grid">
          {summonedPets.map((pet, idx) => (
            <div
              key={idx}
              className={`card ${pet.flipped ? "flipped" : ""} ${
                pet.grade === "S" ? "grade-S" : ""
              }`}
              onClick={() => handlePetFlip(idx)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={
                      pet.grade === "S" || pet.grade === "A"
                        ? "/스페셜.png"
                        : "/펫일반.png"
                    }
                    alt="펫카드 뒷면"
                    className="card-image"
                  />
                </div>
                <div className="card-back">
                  <img
                    src={`/도감/펫/아이콘/${pet.name}.png`}
                    alt={pet.name}
                    className="card-image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showWishlist && (
        <div className="wishlist-tooltip">
          <h3>위시리스트 선택</h3>
          {/* 그룹 1: SS */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">그룹 1: SS (최대 1명)</h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "SS" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group1.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
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
          {/* 그룹 2: S */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">그룹 2: S (최대 3명)</h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "S" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group2.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
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
          {/* 그룹 3: A */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">그룹 3: A (최대 4명)</h4>
            <div className="wishlist-grid">
              {heroes
                .filter((h) => h.grade === "A" && !h.excludeFromSummon)
                .map((hero) => {
                  const selected = wishlist.group3.includes(hero.name);
                  const prob = getHeroProbability(hero, wishlist, summonCount);
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
          ⚠️ 영웅소환은 위시리스트를 선택해주세요.
        </div>
      )}
    </div>
  );
}
