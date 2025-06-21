import { useState } from "react";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import "./SummonSimulation.css";

// 소환 등급 확률
function getGradeByProbability(summonCount) {
  const rand = Math.random() * 100;

  if (summonCount >= 200) {
    return "S"; 
  }

  if (rand < 1) return "S";
  if (rand < 15) return "A";
  if (rand < 55) return "B";
  return "C";
}

const handleSummon = () => {
  if (!isWishlistFullySelected(wishlist)) {
    return;
  }

  setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));

  const newHeroes = summonTenHeroes(wishlist, false, summonCount);
  const hasS = newHeroes.some((h) => h.grade === "S");
  const hasPickupS = newHeroes.some(
    (h) =>
      h.grade === "S" &&
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



function isWishlistFullySelected(wishlist) {
  return (
    wishlist.group1.length === MAX_SELECT.group1 &&
    wishlist.group2.length === MAX_SELECT.group2 &&
    wishlist.group3.length === MAX_SELECT.group3
  );
}

function getHeroProbability(hero, wishlistGroups, summonCount) {
  const grade = hero.grade;
  const candidates = heroes.filter(
    (h) => h.grade === grade && !h.excludeFromSummon
  );

  const isReady = isWishlistFullySelected(wishlistGroups);

  // 100회 이후: 위시리스트 영웅만 등장 → 나머지 확률 0
  if (summonCount >= 100 && (grade === "S" || grade === "A")) {
    const selected =
      grade === "S"
        ? [...wishlistGroups.group1, ...wishlistGroups.group2]
        : wishlistGroups.group3;
    return selected.includes(hero.name) ? (grade === "S" ? 1 / selected.length : 14 / selected.length) : 0;
  }

  // 기존 확률 계산 방식 유지
  if (grade === "S") {
    const selected = [...wishlistGroups.group1, ...wishlistGroups.group2];
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


// 확률 기반 영웅 선택 (위시 반영)
function getRandomHeroByGrade(grade, wishlistGroups, summonCount) {
  let candidates = heroes.filter((h) => h.grade === grade && !h.excludeFromSummon);

  const wishlistReady = isWishlistFullySelected(wishlistGroups);

  // 100회 이상부터는 위시리스트 영웅만 등장
  if (summonCount >= 100 && (grade === "S" || grade === "A")) {
    const selected =
      grade === "S"
        ? [...wishlistGroups.group1, ...wishlistGroups.group2]
        : wishlistGroups.group3;
    candidates = candidates.filter((h) => selected.includes(h.name));
  }

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

// 랜덤으로 펫을 뽑는 함수 추가
function getRandomPetByGrade(grade, petData) {
  const candidates = petData.filter(p => p.grade === grade);

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

function summonTenHeroes(wishlistGroups, guaranteedS = false, summonCount = 0) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getGradeByProbability(summonCount);
    const hero = getRandomHeroByGrade(grade, wishlistGroups, summonCount);
    if (hero) results.push({ ...hero, flipped: false });
  }

  let lastHero;

  // 90~100회 구간: 아무 S급 영웅 1장이 등장
  if (summonCount >= 90 && summonCount < 100) {
    const sHeroes = heroes.filter(h => h.grade === "S" && !h.excludeFromSummon);
    const randomIndex = Math.floor(Math.random() * sHeroes.length);
    lastHero = { ...sHeroes[randomIndex], flipped: false };
  } 
  // 190~200회 구간: 픽업 S급 영웅 1장이 등장
  else if (summonCount >= 190 && summonCount < 200) {
    const pickupS = heroes.filter(
      (h) =>
        h.grade === "S" &&
        !h.excludeFromSummon &&
        ([...wishlistGroups.group1, ...wishlistGroups.group2].includes(h.name))
    );
    const randomIndex = Math.floor(Math.random() * pickupS.length);
    lastHero = { ...pickupS[randomIndex], flipped: false };
  } 
  // 나머지 구간: 보통 확률대로 마지막 1명
  else {
    const lastGrade = guaranteedS ? "S" : getGradeByProbability(summonCount);
    const hero = getRandomHeroByGrade(lastGrade, wishlistGroups, summonCount);
    lastHero = hero ? { ...hero, flipped: false } : null;
  }

  if (lastHero) results.push(lastHero);
  return results;
}

function summonTenPets(petData, summonCount) {
  const results = [];

  for (let i = 0; i < 9; i++) {
    const grade = getPetGradeByProbability();
    const pet = getRandomPetByGrade(grade, petData);
    if (pet) results.push({ ...pet, flipped: false });
  }

  // 마지막 1장 처리
  let lastPet;
  if (summonCount >= 90 && summonCount < 100) {
    const sPets = petData.filter(p => p.grade === "S"); // S급 필터
    const randomIndex = Math.floor(Math.random() * sPets.length);
    lastPet = { ...sPets[randomIndex], flipped: false }; // S급 추가
  } else {
    const grade = getPetGradeByProbability();
    const pet = getRandomPetByGrade(grade, petData);
    lastPet = pet ? { ...pet, flipped: false } : null;
  }

  if (lastPet) results.push(lastPet);
  return results;
}





function getWishlistGroup(hero) {
  if (hero.grade === "S" && hero.group === "스페셜") return "group1";
  if (hero.grade === "S") return "group2";
  if (hero.grade === "A") return "group3";
  return null;
}

function getPetGradeByProbability() {
  const rand = Math.random() * 100;

  if (rand < 1) return "S"; // 1% 확률로 S급
  if (rand < 10) return "A"; // 9% 확률로 A급 (1% + 9%)
  if (rand < 41.5) return "B"; // 31.5% 확률로 B급 (10% + 31.5%)
  return "C"; // 나머지 58.5% 확률로 C급
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
const [petSummonCount, setPetSummonCount] = useState(0);
const [summonedPets, setSummonedPets] = useState([]);
const [activeTab, setActiveTab] = useState("hero");

  const [wishlist, setWishlist] = useState({
    group1: [],
    group2: [],
    group3: [],
  });

  const handlePetSummon = () => {
  setSummonedPets((prev) => prev.map((p) => ({ ...p, flipped: false })));

  const newPets = summonTenPets(pets, petSummonCount);
  const hasS = newPets.some((p) => p.grade === "S");

  setTimeout(() => {
    setSummonedPets(newPets);
    setPetSummonCount((prev) => {
      if (hasS && prev < 100) return 100;
      return Math.min(prev + 10, 100);
    });
  }, 400);
};




  const handleSummon = () => {
  setSummonedHeroes((prev) => prev.map((h) => ({ ...h, flipped: false })));

  const newHeroes = summonTenHeroes(wishlist, false, summonCount);
  const hasS = newHeroes.some((h) => h.grade === "S");
  const hasPickupS = newHeroes.some(
    (h) =>
      h.grade === "S" &&
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

  const handlePetFlip = (idx) => {
  setSummonedPets((prev) =>
    prev.map((p, i) => (i === idx ? { ...p, flipped: true } : p))
  );
};


  // 진행률 계산 (0~200회 기준, 퍼센트)
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


      {/* 영웅 카드 */}
{activeTab === "hero" && (
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
)}

{/* 펫 카드 */}
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
            <img src="/펫일반.png" alt="펫카드 뒷면" className="card-image" />
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

          {/* 그룹 3 */}
          <div className="wishlist-group">
            <h4 className="wishlist-group-title">그룹 3: A급 (최대 4명)</h4>
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
