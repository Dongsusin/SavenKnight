import React, { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import equipmentData from "../data/equipment.json";
import statByGradeAndType from "../data/statByGradeAndType.json";
import maxStatByGradeAndType from "../data/maxStatByGradeAndType.json";
import enhanceBonusByGradeAndType from "../data/enhanceBonusByGradeAndType.json";
import weaponMainStatTable from "../data/weaponMainStatTable.json";
import armorMainStatTable from "../data/armorMainStatTable.json";
import subStatTable from "../data/subStatTable.json";
import setEffectTable from "../data/setEffectTable.json";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./HeroDetail.css";

export default function HeroDetail() {
  // URL 파라미터에서 영웅 이름 가져오기
  const { name } = useParams();
  // 탭 상태, 레벨/강화/초월 등 수치 상태
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("스킬");
  const [level, setLevel] = useState(1);
  const [enhance, setEnhance] = useState(0);
  const [transcend, setTranscend] = useState(0);
  // 장비, 서브스탯 상태
  const [substats, setSubstats] = useState({});
  const [substatUpgrades, setSubstatUpgrades] = useState({});
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [selectedEquipSlot, setSelectedEquipSlot] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState({});
  // 로그인 유저 정보 및 추천 관련 상태
  const [user] = useAuthState(auth);
  const [likeData, setLikeData] = useState({ count: 0, users: [] });
  // 장비 추천 팝업 상태
  const [showRecommendPopup, setShowRecommendPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  // 장비 세트 종류별 착용 개수 계산
  function getSetCounts() {
    const counts = {};
    Object.values(selectedEquipments).forEach((item) => {
      if (!item?.set) return;
      counts[item.set] = (counts[item.set] || 0) + 1;
    });
    return counts;
  }
  // 주스탯 옵션 반환
  function getMainStatOptions(itemType) {
    return Object.keys(
      itemType === "무기" ? weaponMainStatTable : armorMainStatTable
    );
  }
  // 부스탯 옵션 반환
  function getSubStatOptions() {
    return Object.keys(subStatTable);
  }
  // 주스탯 수치 계산 함수
  function calcMainStat(statName, level, isWeapon) {
    const table = isWeapon ? weaponMainStatTable : armorMainStatTable;
    const entry = table[statName];
    if (!entry) return null;

    const total = entry.base + level * entry.perLevel;
    return entry.isPercent ? `${total.toFixed(1)}%` : Math.floor(total);
  }
  // 부스탯 수치 계산 함수
  function calcSubStat(statName, level) {
    const entry = subStatTable[statName];
    if (!entry) return null;

    const bonusSteps = Math.floor(level / 3);
    const total = entry.base + bonusSteps * entry.per3Level;
    return entry.isPercent ? `${total.toFixed(1)}%` : Math.floor(total);
  }
  // 부스탯 강화 가능한 포인트 수 계산
  function getAvailableSubstatPoints(level) {
    let points = 0;
    if (level >= 9) points++;
    if (level >= 12) points++;
    if (level >= 15) points++;
    return points;
  }
  // 숫자 변화 애니메이션 효과 컴포넌트
  function AnimatedNumber({ value, duration = 500 }) {
    const [displayValue, setDisplayValue] = useState(value);
    const raf = useRef(null);
    const start = useRef(null);
    const from = useRef(value);

    useEffect(() => {
      from.current = displayValue;
      cancelAnimationFrame(raf.current);
      start.current = null;

      const step = (timestamp) => {
        if (!start.current) start.current = timestamp;
        const progress = Math.min((timestamp - start.current) / duration, 1);
        const next = Math.floor(
          from.current + (value - from.current) * progress
        );
        setDisplayValue(next);
        if (progress < 1) {
          raf.current = requestAnimationFrame(step);
        }
      };

      raf.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf.current);
    }, [value, duration]);

    return <span>{displayValue.toLocaleString()}</span>;
  }
  // 이름이 변경되면 탭과 스킬 인덱스 초기화
  useEffect(() => {
    setSelectedSkillIndex(0);
    setActiveTab("스킬");
  }, [name]);
  // 추천 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!user || !hero?.id) return alert("로그인이 필요합니다.");

    const ref = doc(db, "likes", hero.id.toString());
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { count: 0, users: [] };
    const alreadyLiked = data.users.includes(user.uid);

    const updated = alreadyLiked
      ? {
          count: Math.max(0, data.count - 1),
          users: data.users.filter((uid) => uid !== user.uid),
        }
      : {
          count: data.count + 1,
          users: [...data.users, user.uid],
        };

    await setDoc(ref, updated);
  };
  const isLiked = user && likeData.users.includes(user.uid);
  // 모든 영웅 목록 중 현재 영웅 찾기
  const allHeroes = heroes.flat ? heroes.flat() : heroes;
  const hero = allHeroes.find((h) => h.name === name);
  if (!hero) return <div>존재하지 않는 영웅입니다.</div>;
  // 이전/다음 영웅 탐색
  const sortedHeroes = [...allHeroes].sort((a, b) => a.id - b.id);
  const currentIndex = sortedHeroes.findIndex((h) => h.id === hero.id);
  const prevHero = sortedHeroes[currentIndex - 1] || null;
  const nextHero = sortedHeroes[currentIndex + 1] || null;
  // 아이콘, 스킬 이미지 경로
  const imagePath = `/도감/${hero.group}/아이콘/${hero.name}.png`;
  const skillImages = Array.from(
    { length: hero.skills?.length || 0 },
    (_, i) => {
      const skillPath = `/도감/${hero.group}/스킬/${hero.name}-${i + 1}.png`;
      return skillPath;
    }
  );
  // 스킬 설명 내 숫자 및 버프 키워드 강조 처리 함수
  const highlightKeywords = (text) => {
    const goldColor = "#ffcc00";
    const blueColor = "#00ccff";

    const numberPatterns = [
      /\d+턴/g,
      /\d+회/g,
      /\d+%/g,
      /\d+번째/g,
      /\b\d{1,3}(,\d{3})*\b/g,
      /\b\d+\b/g,
    ];

    const buffKeywords = [
      "대상의 턴제 버프 감소",
      "기절",
      "링크",
      "기절 면역",
      "디버프 해제",
      "방어력 증가",
      "감쇄",
      "감전",
      "물리 공격력 증가",
      "부활",
      "화상",
      "모든 공격력 감소",
      "방어력 감소",
      "물리 취약",
      "마법 취약",
      "약점 공격 확률 증가",
      "침묵",
      "물리 피해량 증가",
      "모든 피해 무효화",
      "빙결",
      "최대 생명력 비례 공격력 증가",
      "최대 생명력 비례 방어력 증가",
      "효과 적중 증가",
      "효과 저항 증가",
      "효과 적용 확률 증가",
      "피해 대상이 1명 줄어들 때마다",
      "만큼 피해량 증가",
      "관통",
      "공격력 비례 방어력 증가",
      "반격",
      "즉사",
      "불사",
      "감전",
      "출혈",
      "스킬 쿨타임 증가",
      "석화",
      "모든 피해 면역",
      "버프 해제",
      "처형",
      "보호막",
      "영멸",
      "받는 회복량 감소",
      "권능",
      "치명타 확률",
      "치명타 피해",
      "수면",
      "방어 무시",
      "마법 공격력 증가",
      "마법 피해량 증가",
      "마법 공격력 감소",
      "마법 피해 면역",
      "지속 회복",
      "화상 면역",
      "실명",
      "매의 발톱",
      "흡혈",
      "연속 발동",
      "치명타 확률 증가",
      "치명타 피해 증가",
      "물리 피해 면역",
      "도발",
      "현재 생명력 비율을",
      "로 전환",
      "중독",
      "저격 자세",
      "위장",
      "사냥술",
      "출혈 면역",
      "마비 면역",
      "물리 공격력 감소",
      "중독 면역",
      "막기 확률 증가",
      "물리 감쇄",
      "빗나감 활률 증가",
      "피해량 감소",
      "고정 피해",
      "회복 불가",
      "감전 면역",
      "마력 정화",
      "피해량 감소",
      "석화 면역",
      "마비",
      "피해량 증가",
      "방어무시",
      "빙결 면역",
      "효과 저항 감소",
      "출혈 폭발",
      "집중 공격",
      "마력 억류",
      "축복",
      "혼란",
      "공격력 비례 치명타 확률 증가",
      "인고",
    ];

    let highlighted = text;

    numberPatterns.forEach((regex) => {
      highlighted = highlighted.replace(
        regex,
        (match) =>
          `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
      );
    });

    const sortedBuffKeywords = [...buffKeywords].sort(
      (a, b) => b.length - a.length
    );

    sortedBuffKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
      );
    });

    return highlighted;
  };

  function handleEquipSlotClick(slotType, slotIndex) {
    setSelectedEquipSlot({ slotType, slotIndex });
    setEquipModalOpen(true);
  }

  function getEquipmentStatBonus(statKey) {
    let flatBonus = 0;
    let percentBonus = 0;

    const percentToBaseStatMap = {
      "공격력%": "공격력",
      "방어력%": "방어력",
      "생명력%": "생명력",
    };

    Object.entries(selectedEquipments).forEach(([key, equip]) => {
      if (!equip) return;

      const isWeapon = equip.type === "무기";
      const isArmor = equip.type === "방어구";
      const level = equip.level ?? 0;
      if (isWeapon && statKey === "공격력") {
        flatBonus += 64 + 16 * level;
      }
      if (isArmor) {
        if (statKey === "방어력") flatBonus += 39 + 10 * level;
        if (statKey === "생명력") flatBonus += 224 + 57 * level;
      }
      if (equip.stats?.[statKey]) {
        flatBonus += equip.stats[statKey];
      }

      const mainStat = substats[key]?.main;
      if (mainStat) {
        const value = calcMainStat(mainStat, level, isWeapon);
        const mappedKey = percentToBaseStatMap[mainStat] || mainStat;
        if (mappedKey === statKey) {
          if (typeof value === "string" && value.endsWith("%")) {
            percentBonus += parseFloat(value);
          } else {
            flatBonus += parseFloat(value);
          }
        }
      }

      const subList = substats[key]?.subs ?? [];
      const upgrades = substatUpgrades[key] ?? {};
      subList.forEach((subName, i) => {
        const value = calcSubStat(subName, (upgrades[i] ?? 0) * 3);
        const mappedKey = percentToBaseStatMap[subName] || subName;
        if (mappedKey === statKey) {
          if (typeof value === "string" && value.endsWith("%")) {
            percentBonus += parseFloat(value);
          } else {
            flatBonus += parseFloat(value);
          }
        }
      });

      if (equip.type === "장신구") {
        const accessoryBonus = getAccessoryBonus(equip);
        if (!accessoryBonus) return;

        if (statKey === "공격력") percentBonus += accessoryBonus.공격력;
        if (statKey === "방어력") percentBonus += accessoryBonus.방어력;
        if (statKey === "생명력") percentBonus += accessoryBonus.생명력;
      }
    });

    const setCounts = getSetCounts();
    Object.entries(setCounts).forEach(([setName, count]) => {
      const effect = setEffectTable[setName];
      if (!effect) return;

      let chosenEffects = [];
      if (count >= 4 && effect["4세트"]) {
        chosenEffects = effect["4세트"];
      } else if (count >= 2 && effect["2세트"]) {
        chosenEffects = effect["2세트"];
      }

      chosenEffects.forEach(({ stat, value }) => {
        const mappedKey = percentToBaseStatMap[stat] || stat.replace("%", "");
        if (mappedKey === statKey) {
          percentBonus += value;
        }
      });
    });

    return { flatBonus, percentBonus };
  }

  const getAccessoryStats = (level = 0) => {
    const base = 2.5;
    const per = 0.5;
    return base + per * level;
  };

  const getAccessoryBonus = (item) => {
    if (!item || item.type !== "장신구") return null;
    const bonus = getAccessoryStats(item.level ?? 0);

    return {
      공격력: bonus,
      방어력: bonus,
      생명력: bonus,
      label: item.specialEffect || null,
    };
  };
  useEffect(() => {
    if (!hero?.id) return;
    const ref = doc(db, "likes", hero.id.toString());
    const unsubscribe = onSnapshot(ref, (snap) => {
      setLikeData(snap.exists() ? snap.data() : { count: 0, users: [] });
    });
    return () => unsubscribe();
  }, [hero?.id]);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  async function handleRecommendSubmit() {
    if (!user) return alert("로그인이 필요합니다.");

    const allEmpty = Object.values(selectedEquipments).every((item) => !item);
    if (allEmpty) {
      alert("장비를 하나 이상 장착해야 추천할 수 있습니다.");
      return;
    }

    const ref = collection(db, "recommendations", hero.id.toString(), "builds");
    await addDoc(ref, {
      authorUid: user.uid,
      authorName: user.displayName || user.email,
      equipment: selectedEquipments,
      substats,
      upgrades: substatUpgrades,
      createdAt: serverTimestamp(),
      likes: [],
    });

    alert("추천 완료!");
    setShowRecommendPopup(false);
  }

  useEffect(() => {
    if (!showViewPopup || !hero?.id) return;
    const q = collection(db, "recommendations", hero.id.toString(), "builds");
    onSnapshot(q, (snap) => {
      setRecommendations(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
  }, [showViewPopup, hero?.id]);

  async function handleVote(id, likes) {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(db, "recommendations", hero.id.toString(), "builds", id);
    const already = likes.includes(user.uid);
    await updateDoc(ref, {
      likes: already
        ? likes.filter((uid) => uid !== user.uid)
        : [...likes, user.uid],
    });
  }

  return (
    <div className="hero-detail page">
      {/* 도감으로 돌아가기 */}
      <Link to="/dex" className="back-button">
        ← 돌아가기
      </Link>
      {/* 이전 영웅으로 이동 */}
      {prevHero ? (
        <Link to={`/hero/${prevHero.name}`} className="nav-button fixed-left">
          ←
        </Link>
      ) : (
        <span className="nav-button fixed-left disabled">←</span>
      )}
      {/* 다음 영웅으로 이동 */}
      {nextHero ? (
        <Link to={`/hero/${nextHero.name}`} className="nav-button fixed-right">
          →
        </Link>
      ) : (
        <span className="nav-button fixed-right disabled">→</span>
      )}

      <section className="hero-info">
        <div className="info-left">
          {/* 이름, PV 버튼 */}
          <h2>{hero.name}</h2>
          {hero.youtube && (
            <button
              onClick={() => setYoutubeOpen(true)}
              className="youtube-button"
            >
              영웅 PV
            </button>
          )}
          {/* 등급 */}
          <p className="info-category">{hero.category}</p>
          {/* 영웅 아이콘, 추천 버튼 */}
          <div className="info-hero-card">
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
              style={{ marginBottom: "10px" }}
            >
              추천 {likeData.count || 0}
            </button>
            <img src={imagePath} alt={hero.name} className="main-image" />
          </div>
          {/* 별칭 */}
          <p className="info-title">{hero.title}</p>
          {/* 강화 / 초월 / 레벨 조정 UI */}
          <div className="stat-settings">
            {[
              { label: "레벨", toggle: true },
              {
                label: "강화",
                value: enhance,
                setValue: setEnhance,
                min: 0,
                max: 5,
              },
              {
                label: "초월",
                value: transcend,
                setValue: setTranscend,
                min: 0,
                max: 12,
              },
            ].map(({ label, value, setValue, min, max, toggle }) => (
              <div className="stat-adjust-box" key={label}>
                <span className="stat-label">{label}</span>
                {toggle && label === "레벨" ? (
                  <div className="level-toggle-buttons">
                    <button
                      className={level === 1 ? "active" : ""}
                      onClick={() => setLevel(1)}
                    >
                      기본
                    </button>
                    <button
                      className={level === 30 ? "active" : ""}
                      onClick={() => setLevel(30)}
                    >
                      최대
                    </button>
                  </div>
                ) : (
                  <div className="stat-stepper">
                    <button
                      onClick={() => setValue(Math.max(min, value - 1))}
                      disabled={value <= min}
                    >
                      <FaChevronLeft />
                    </button>
                    <span className="stat-value-text">
                      {label === "강화" ? `+${value}` : value}
                    </span>
                    <button
                      onClick={() => setValue(Math.min(max, value + 1))}
                      disabled={value >= max}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="info-right">
          {/* 탭 버튼: 스킬 / 스탯 / 장비 */}
          <div className="tab-buttons">
            {["스킬", "스탯", "장비"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "active-tab" : ""}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* 스킬 */}
          {activeTab === "스킬" && (
            <>
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
              {/* 선택된 스킬의 상세 설명 */}
              {selectedSkillIndex !== null &&
                hero.skills &&
                hero.skills[selectedSkillIndex] && (
                  <div className="skill-description">
                    <p className="skill-title">
                      <strong>{hero.skilltitle?.[selectedSkillIndex]}</strong>
                      {hero.skillcooldown?.[selectedSkillIndex] > 0 &&
                        ` (쿨타임 ${hero.skillcooldown[selectedSkillIndex]}초)`}
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
                                typeof line.effect === "string"
                                  ? line.effect
                                  : ""
                              ),
                            }}
                          />
                        </div>
                      );
                    })}

                    {hero.skillup && hero.skillup[selectedSkillIndex] && (
                      <div className="skill-upgrade-box">
                        <div className="skill-upgrade-title">
                          스킬 강화 효과
                        </div>
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

                    {(hero.twotranscendenceSkillUp?.[selectedSkillIndex]
                      ?.length > 0 ||
                      hero.sixtranscendenceSkillUp?.[selectedSkillIndex]
                        ?.length > 0) && (
                      <div style={{ marginTop: "10px" }}>
                        {hero.twotranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div
                            className={`skill-transcendence-box ${
                              transcend >= 2 ? "active" : "inactive"
                            }`}
                          >
                            <p className="skill-transcendence-title">
                              2초월 효과
                            </p>
                            {hero.twotranscendenceSkillUp[
                              selectedSkillIndex
                            ].map((line, i) => (
                              <p
                                key={i}
                                dangerouslySetInnerHTML={{
                                  __html: highlightKeywords(line),
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {hero.sixtranscendenceSkillUp?.[selectedSkillIndex]
                          ?.length > 0 && (
                          <div
                            className={`skill-transcendence-box ${
                              transcend >= 6 ? "active" : "inactive"
                            }`}
                          >
                            <p className="skill-transcendence-title">
                              6초월 효과
                            </p>
                            {hero.sixtranscendenceSkillUp[
                              selectedSkillIndex
                            ].map((line, i) => (
                              <p
                                key={i}
                                dangerouslySetInnerHTML={{
                                  __html: highlightKeywords(line),
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
            </>
          )}
          {/* 스탯 */}
          {activeTab === "스탯" && (
            <div className="stat-section">
              <h3>스탯</h3>
              {/* 스탯 계산 불가능 등급 처리 */}
              {["S", "A"].includes(hero.grade) ? (
                <>
                  {/* 스탯 계산 및 출력 (공/방/생/속공 등) */}
                  <div className="stat-list">
                    {(() => {
                      const statBase =
                        hero.grade && hero.type
                          ? level === 30
                            ? maxStatByGradeAndType?.[hero.grade]?.[hero.type]
                            : statByGradeAndType?.[hero.grade]?.[hero.type]
                          : null;

                      const enhanceBonus =
                        hero.grade && hero.type
                          ? enhanceBonusByGradeAndType?.[hero.grade]?.[
                              hero.type
                            ]
                          : null;

                      const getFinalStat = (
                        base = 0,
                        enhancePerStep = 0,
                        statKey
                      ) => {
                        const enhanceBonus = enhancePerStep * enhance;
                        const baseStat = base + enhanceBonus;

                        const transcendArray = hero.transcendBonus || [];
                        const equipmentBonus = getEquipmentStatBonus(statKey);

                        const basePercent = transcendArray
                          .slice(0, Math.min(transcend, 6))
                          .filter((t) => t.stat === statKey)
                          .reduce((sum, t) => sum + t.value, 0);

                        const extraPercent =
                          transcend > 6 &&
                          ["공격력", "생명력", "방어력"].includes(statKey)
                            ? (transcend - 6) * 2
                            : 0;

                        const transcendBonus = Math.floor(
                          (baseStat * (basePercent + extraPercent)) / 100
                        );
                        const total =
                          baseStat +
                          transcendBonus +
                          equipmentBonus.flatBonus +
                          Math.floor(
                            (baseStat * equipmentBonus.percentBonus) / 100
                          );

                        return {
                          base,
                          enhanceBonus,
                          transcendBonus,
                          total,
                          flatBonus: equipmentBonus.flatBonus,
                          percentBonus: equipmentBonus.percentBonus,
                          transcendPercent: basePercent + extraPercent,
                          totalBonusFromEquip:
                            total - (baseStat + transcendBonus),
                        };
                      };

                      const getFixedStatWithTranscend = (
                        basePercent,
                        statKey
                      ) => {
                        const transcendArray = hero.transcendBonus || [];
                        const equipmentBonus = getEquipmentStatBonus(statKey);

                        const baseTranscend = transcendArray
                          .slice(0, Math.min(transcend, 6))
                          .filter((t) => t.stat === statKey)
                          .reduce((sum, t) => sum + t.value, 0);

                        const extraTranscend =
                          transcend > 6 &&
                          ["공격력", "생명력", "방어력"].includes(statKey)
                            ? (transcend - 6) * 2
                            : 0;

                        const transcendBonus = baseTranscend + extraTranscend;

                        return {
                          base: basePercent,
                          transcendBonus,
                          percentBonus: equipmentBonus.percentBonus,
                          value: `${(
                            basePercent +
                            transcendBonus +
                            equipmentBonus.percentBonus
                          ).toFixed(1)}%`,
                          totalPercentAll:
                            basePercent +
                            transcendBonus +
                            equipmentBonus.percentBonus,
                        };
                      };

                      const atkLabel = ["공격", "방어", "만능"].includes(
                        hero.type
                      )
                        ? "물리 공격력"
                        : "마법 공격력";

                      const dynamicStats = statBase
                        ? [
                            {
                              label: atkLabel,
                              ...getFinalStat(
                                statBase.공격력,
                                enhanceBonus?.공격력,
                                "공격력"
                              ),
                            },
                            {
                              label: "방어력",
                              ...getFinalStat(
                                statBase.방어력,
                                enhanceBonus?.방어력,
                                "방어력"
                              ),
                            },
                            {
                              label: "생명력",
                              ...getFinalStat(
                                statBase.생명력,
                                enhanceBonus?.생명력,
                                "생명력"
                              ),
                            },
                            {
                              label: "속공",
                              ...getFinalStat(statBase.속공, 0, "속공"),
                            },
                          ]
                        : [];

                      const fixedStats = [
                        {
                          label: "치명타 확률",
                          ...getFixedStatWithTranscend(5, "치명타 확률"),
                        },
                        {
                          label: "치명타 피해",
                          ...getFixedStatWithTranscend(150, "치명타 피해"),
                        },
                        {
                          label: "약점 공격 확률",
                          ...getFixedStatWithTranscend(0, "약점 공격 확률"),
                        },
                        {
                          label: "막기 확률",
                          ...getFixedStatWithTranscend(0, "막기 확률"),
                        },
                        {
                          label: "받는 피해 감소",
                          ...getFixedStatWithTranscend(0, "받는 피해 감소"),
                        },
                        {
                          label: "효과 적중",
                          ...getFixedStatWithTranscend(0, "효과 적중"),
                        },
                        {
                          label: "효과 저항",
                          ...getFixedStatWithTranscend(0, "효과 저항"),
                        },
                      ];

                      const finalStats = [...dynamicStats, ...fixedStats];

                      return finalStats.map((stat, i) => {
                        const isNumber = stat.hasOwnProperty("total");

                        return (
                          <div key={i} className="stat-row">
                            <div className="stat-left">
                              <span className="stat-label">{stat.label}</span>
                            </div>
                            <div className="stat-value">
                              {isNumber ? (
                                <>
                                  <span
                                    style={{
                                      color: "#FFD700",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <AnimatedNumber value={stat.total} />
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.9em",
                                      marginLeft: "6px",
                                    }}
                                  >
                                    (
                                    <span style={{ color: "#FFFFFF" }}>
                                      {stat.base.toLocaleString()}
                                    </span>
                                    {stat.enhanceBonus > 0 && (
                                      <span style={{ color: "#00FF66" }}>
                                        {" + " +
                                          stat.enhanceBonus.toLocaleString()}
                                      </span>
                                    )}
                                    {stat.transcendBonus > 0 && (
                                      <span style={{ color: "#FF6666" }}>
                                        {" + " +
                                          stat.transcendBonus.toLocaleString()}
                                      </span>
                                    )}
                                    {stat.totalBonusFromEquip > 0 && (
                                      <span style={{ color: "#33ccff" }}>
                                        {" + " +
                                          stat.totalBonusFromEquip.toLocaleString()}
                                      </span>
                                    )}
                                    )
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span
                                    style={{
                                      color: "#FFD700",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {stat.value}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.9em",
                                      marginLeft: "6px",
                                    }}
                                  >
                                    (
                                    <span style={{ color: "#FFFFFF" }}>
                                      {stat.base}%
                                    </span>
                                    {stat.transcendBonus > 0 && (
                                      <span style={{ color: "#FF6666" }}>
                                        {" + " + stat.transcendBonus}%
                                      </span>
                                    )}
                                    {stat.percentBonus > 0 && (
                                      <span style={{ color: "#33ccff" }}>
                                        {" + " + stat.percentBonus}%
                                      </span>
                                    )}
                                    )
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              ) : (
                <p style={{ color: "#aaa", textAlign: "center" }}>
                  해당 등급은 스탯 정보가 제공되지 않습니다.
                </p>
              )}

              <div className="stat-color-legend">
                <p>
                  <span className="color-box total"></span> :{" "}
                  <strong>총합</strong>
                </p>
                <p>
                  <span className="color-box base"></span>:{" "}
                  <strong>기본 수치</strong>
                </p>
                <p>
                  <span className="color-box enhance"></span>:{" "}
                  <strong>강화 수치</strong>
                </p>
                <p>
                  <span className="color-box transcend"></span>:{" "}
                  <strong>초월 수치</strong>
                </p>
                <p>
                  <span className="color-box equipment"></span>:{" "}
                  <strong>장비 수치</strong>
                </p>
              </div>
            </div>
          )}
          {/* 장비 */}
          {activeTab === "장비" && (
            <div className="equipment-section">
              <h3>장비</h3>
              {/* 장비 추천 등록/보기 버튼 */}
              <div className="recommend-buttons">
                <button onClick={() => setShowRecommendPopup(true)}>
                  현재 장비 추천하기
                </button>
                <button onClick={() => setShowViewPopup(true)}>
                  추천 장비
                </button>
              </div>
              {/* 장비 슬롯 */}
              <div className="equipment-grid">
                {[
                  { type: "무기", index: 0 },
                  { type: "방어구", index: 1 },
                  { type: "무기", index: 2 },
                  { type: "방어구", index: 3 },
                  { type: "장신구", index: 0 },
                ].map(({ type, index }) => {
                  const key = `${type}${index}`;
                  const item = selectedEquipments[key];
                  const accessory =
                    type === "장신구" ? getAccessoryBonus(item) : null;

                  return (
                    <div
                      key={key}
                      className={`equip-slot ${type}`}
                      onClick={() => {
                        if (!item) handleEquipSlotClick(type, index);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedEquipments((prev) => {
                          const updated = { ...prev };
                          delete updated[key];
                          return updated;
                        });
                        setSubstats((prev) => {
                          const updated = { ...prev };
                          delete updated[key];
                          return updated;
                        });
                        setSubstatUpgrades((prev) => {
                          const updated = { ...prev };
                          delete updated[key];
                          return updated;
                        });
                      }}
                    >
                      {item ? (
                        <div className="equipped-item mobile-layout">
                          <div className="equip-top">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="equip-image-clickable"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEquipSlotClick(type, index);
                              }}
                            />
                            <div className="equipment-stats-box">
                              <div className="equipment-stats">
                                <p className="equipment-name">
                                  <span className="equipment-desc">
                                    {(() => {
                                      const isWeapon = item.type === "무기";
                                      const isMagicType = [
                                        "마법",
                                        "치유",
                                      ].includes(hero?.type);
                                      const itemDisplayName = isWeapon
                                        ? isMagicType
                                          ? item.name2 ||
                                            item.name1 ||
                                            item.name
                                          : item.name1 || item.name
                                        : item.name;

                                      const level = item.level ?? 0;
                                      const isArmor = item.type === "방어구";
                                      const desc = [];

                                      if (isWeapon) {
                                        desc.push(`공격력 +${64 + level * 16}`);
                                      }

                                      if (isArmor) {
                                        desc.push(`방어력 +${39 + level * 10}`);
                                        desc.push(
                                          `생명력 +${224 + level * 57}`
                                        );
                                      }

                                      if (accessory) {
                                        if (accessory.공격력 > 0)
                                          desc.push(
                                            `공격력 +${accessory.공격력.toFixed(
                                              1
                                            )}%`
                                          );
                                        if (accessory.방어력 > 0)
                                          desc.push(
                                            `방어력 +${accessory.방어력.toFixed(
                                              1
                                            )}%`
                                          );
                                        if (accessory.생명력 > 0)
                                          desc.push(
                                            `생명력 +${accessory.생명력.toFixed(
                                              1
                                            )}%`
                                          );
                                      }

                                      return `${itemDisplayName} (${desc.join(
                                        ", "
                                      )})`;
                                    })()}
                                  </span>
                                </p>
                              </div>
                              {/* 강화 */}
                              <div className="enhance-controls">
                                <button
                                  onClick={() =>
                                    setSelectedEquipments((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...prev[key],
                                        level: Math.max(
                                          0,
                                          (prev[key]?.level || 0) - 1
                                        ),
                                      },
                                    }))
                                  }
                                >
                                  -
                                </button>
                                <span>+{item.level ?? 0}</span>
                                <button
                                  onClick={() =>
                                    setSelectedEquipments((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...prev[key],
                                        level: Math.min(
                                          15,
                                          (prev[key]?.level || 0) + 1
                                        ),
                                      },
                                    }))
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* 장신구 */}
                          <div className="equip-bottom">
                            {item.type !== "장신구" && (
                              <div className="substat-selection">
                                <p className="substat-title">부가 스탯 선택</p>

                                <div className="substat-row">
                                  <label>주스탯:</label>
                                  <select
                                    value={substats[key]?.main || ""}
                                    onChange={(e) =>
                                      setSubstats((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...prev[key],
                                          main: e.target.value,
                                        },
                                      }))
                                    }
                                  >
                                    <option value="">선택</option>
                                    {getMainStatOptions(item.type).map(
                                      (stat) => (
                                        <option key={stat} value={stat}>
                                          {stat}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {substats[key]?.main && (
                                    <div className="stat-display">
                                      <span className="stat-label">
                                        {substats[key].main}
                                      </span>
                                      <span className="stat-value">
                                        {calcMainStat(
                                          substats[key].main,
                                          item.level ?? 0,
                                          item.type === "무기"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {[0, 1, 2, 3].map((i) => {
                                  const statName = substats[key]?.subs?.[i];
                                  const points = substatUpgrades[key]?.[i] ?? 0;
                                  const level = item.level ?? 0;
                                  const totalPoints =
                                    getAvailableSubstatPoints(level);
                                  const currentTotalUsed = Object.values(
                                    substatUpgrades[key] || {}
                                  ).reduce((sum, val) => sum + val, 0);
                                  const remainingPoints =
                                    totalPoints - currentTotalUsed;

                                  return (
                                    <div key={i} className="substat-row">
                                      <label>부스탯 {i + 1}:</label>
                                      <select
                                        value={statName || ""}
                                        onChange={(e) => {
                                          const updatedSubs = [
                                            ...(substats[key]?.subs || []),
                                          ];
                                          updatedSubs[i] = e.target.value;
                                          setSubstats((prev) => ({
                                            ...prev,
                                            [key]: {
                                              ...prev[key],
                                              subs: updatedSubs,
                                            },
                                          }));
                                        }}
                                      >
                                        <option value="">선택</option>
                                        {getSubStatOptions().map((stat) => (
                                          <option key={stat} value={stat}>
                                            {stat}
                                          </option>
                                        ))}
                                      </select>

                                      {statName && (
                                        <div className="stat-display">
                                          <span className="stat-label">
                                            {statName}
                                          </span>
                                          <span className="stat-value">
                                            {calcSubStat(statName, points * 3)}
                                          </span>

                                          <div className="substat-point-controls">
                                            <button
                                              onClick={() => {
                                                setSubstatUpgrades((prev) => {
                                                  const current =
                                                    prev[key]?.[i] ?? 0;
                                                  if (current <= 0) return prev;
                                                  return {
                                                    ...prev,
                                                    [key]: {
                                                      ...prev[key],
                                                      [i]: current - 1,
                                                    },
                                                  };
                                                });
                                              }}
                                              disabled={points <= 0}
                                            >
                                              -
                                            </button>
                                            <span className="point-text">
                                              +{points}
                                            </span>
                                            <button
                                              onClick={() => {
                                                if (remainingPoints <= 0)
                                                  return;
                                                setSubstatUpgrades((prev) => {
                                                  const current =
                                                    prev[key]?.[i] ?? 0;
                                                  return {
                                                    ...prev,
                                                    [key]: {
                                                      ...prev[key],
                                                      [i]: current + 1,
                                                    },
                                                  };
                                                });
                                              }}
                                              disabled={remainingPoints <= 0}
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <button
                            className="unequip-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEquipments((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                return updated;
                              });
                              setSubstats((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                return updated;
                              });
                              setSubstatUpgrades((prev) => {
                                const updated = { ...prev };
                                delete updated[key];
                                return updated;
                              });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="empty-text">클릭하여 장비</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* 세트 효과 표시 */}
              <div
                className="set-bonus-display"
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  border: "1px solid #666",
                  borderRadius: "8px",
                }}
              >
                <h4 style={{ color: "#FFD700", marginBottom: "8px" }}>
                  세트 효과
                </h4>
                {Object.entries(getSetCounts()).map(([setName, count]) => {
                  const effect = setEffectTable[setName];
                  if (!effect) return null;

                  const lines = [];

                  if (count >= 2 && effect["2세트"]) {
                    lines.push(
                      <div
                        key={`${setName}-2`}
                        style={{ marginBottom: "4px", color: "#FFFFFF" }}
                      >
                        <strong style={{ color: "#00FF66" }}>
                          {setName} 2세트:
                        </strong>{" "}
                        {effect["2세트"]
                          .map(
                            (e) =>
                              `${e.stat} +${e.value}${
                                e.stat.endsWith("%") ? "%" : ""
                              }`
                          )
                          .join(", ")}
                      </div>
                    );
                  }

                  if (count >= 4 && effect["4세트"]) {
                    lines.push(
                      <div
                        key={`${setName}-4`}
                        style={{ marginBottom: "4px", color: "#FFFFFF" }}
                      >
                        <strong style={{ color: "#FF6666" }}>
                          {setName} 4세트:
                        </strong>{" "}
                        {effect["4세트"]
                          .map(
                            (e) =>
                              `${e.stat} +${e.value}${
                                e.stat.endsWith("%") ? "%" : ""
                              }`
                          )
                          .join(", ")}
                      </div>
                    );
                  }

                  return lines;
                })}
              </div>
              {/* 장비 선택 모달 */}
              {equipModalOpen && selectedEquipSlot && (
                <div className="equipment-modal-overlay">
                  <div className="equipment-modal">
                    <button
                      className="close-modal"
                      onClick={() => setEquipModalOpen(false)}
                    >
                      ✕
                    </button>
                    <h3>
                      {selectedEquipSlot.slotType.toUpperCase()} 장비 선택
                    </h3>
                    <div className="equipment-list">
                      {equipmentData
                        .filter(
                          (item) => item.type === selectedEquipSlot.slotType
                        )
                        .map((item) => {
                          const key =
                            selectedEquipSlot.slotType +
                            selectedEquipSlot.slotIndex;

                          const isMagicType = ["마법", "치유"].includes(
                            hero.type
                          );

                          let imagePath = item.image;
                          let itemName = item.name;

                          if (item.type === "무기") {
                            imagePath = isMagicType
                              ? item.image2 || item.image1 || item.image
                              : item.image1 || item.image;

                            itemName = isMagicType
                              ? item.name2 || item.name1 || item.name
                              : item.name1 || item.name;
                          }

                          return (
                            <div
                              key={item.id}
                              className="equipment-item"
                              onClick={() => {
                                setSelectedEquipments((prev) => ({
                                  ...prev,
                                  [key]: { ...item, image: imagePath },
                                }));
                                setEquipModalOpen(false);
                              }}
                            >
                              <img src={imagePath} alt={item.name} />
                              <div className="equipment-info" />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {(() => {
                const accessories = Object.values(selectedEquipments).filter(
                  (item) => item?.type === "장신구"
                );

                const effects = accessories
                  .map((acc) => getAccessoryBonus(acc)?.label)
                  .filter((label) => label);

                return effects.length > 0 ? (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "10px",
                      border: "1px dashed #888",
                      borderRadius: "8px",
                      backgroundColor: "#222",
                      color: "#FFD700",
                    }}
                  >
                    {/* 장신구 특수효과 표시 */}
                    <strong>장신구 효과</strong>
                    <div style={{ marginTop: "6px" }}>
                      {effects.map((label, idx) => (
                        <div
                          key={idx}
                          style={{ marginBottom: "4px", color: "#fff" }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
          {/* 유튜브 영상 팝업 */}
          {youtubeOpen && (
            <div
              className="youtube-popup-overlay"
              onClick={() => setYoutubeOpen(false)}
            >
              <div
                className="youtube-popup"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-button"
                  onClick={() => setYoutubeOpen(false)}
                >
                  ✖
                </button>
                <iframe
                  width="560"
                  height="315"
                  src={hero.youtube}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          {/* 장비 추천 등록 팝업 */}
          {showRecommendPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button
                  className="popup-close"
                  onClick={() => setShowRecommendPopup(false)}
                >
                  ✕
                </button>
                <h3>장비 추천</h3>

                <div className="equip-summary">
                  {Object.entries(selectedEquipments).map(([key, item]) => {
                    const level = item.level ?? 0;
                    const isWeapon = item.type === "무기";

                    const mainStat = substats[key]?.main;
                    const mainValue = mainStat
                      ? calcMainStat(mainStat, level, isWeapon)
                      : null;

                    const subList = substats[key]?.subs ?? [];
                    const upgrades = substatUpgrades[key] ?? {};

                    return (
                      <div key={key} className="recommend-equip-box">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "6px",
                          }}
                        />
                        <div className="equip-label">
                          <div
                            style={{
                              fontWeight: "bold",
                              color: "#ffd700",
                            }}
                          >
                            {item.type === "무기"
                              ? ["마법", "치유"].includes(hero?.type)
                                ? item.name2 || item.name1 || item.name
                                : item.name1 || item.name
                              : item.name}{" "}
                            +{level}
                          </div>

                          {mainStat && (
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#7cf",
                              }}
                            >
                              {mainStat}: {mainValue}
                            </div>
                          )}
                          {subList.map((sub, i) => {
                            const upLevel = (upgrades[i] ?? 0) * 3;
                            const value = calcSubStat(sub, upLevel);
                            return (
                              <div
                                key={i}
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#ccc",
                                }}
                              >
                                {sub}: {value}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button onClick={handleRecommendSubmit}>장비 추천하기</button>
              </div>
            </div>
          )}
          {/* 추천 장비 목록 팝업 */}
          {showViewPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button
                  className="popup-close"
                  onClick={() => setShowViewPopup(false)}
                >
                  ✕
                </button>
                <h3>추천 장비</h3>
                <div className="recommend-list">
                  {recommendations.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#aaa",
                        marginTop: "20px",
                      }}
                    >
                      아직 추천된 장비가 없습니다. 장비를 추천해주세요!
                    </p>
                  ) : (
                    [...recommendations]
                      .sort(
                        (a, b) =>
                          (b.likes?.length || 0) - (a.likes?.length || 0)
                      )
                      .map((rec) => (
                        <div key={rec.id} className="recommend-card">
                          <div className="equip-summary">
                            {[
                              "무기0",
                              "방어구1",
                              "무기2",
                              "방어구3",
                              "장신구0",
                            ].map((key) => {
                              const item = rec.equipment?.[key];
                              if (!item) return null;

                              const level = item.level ?? 0;
                              const isWeapon = item.type === "무기";
                              const mainStat = rec.substats?.[key]?.main;
                              const mainValue = mainStat
                                ? calcMainStat(mainStat, level, isWeapon)
                                : null;

                              const subList = rec.substats?.[key]?.subs ?? [];
                              const upgrades = rec.upgrades?.[key] ?? {};

                              return (
                                <div key={key} className="recommend-equip-box">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                      borderRadius: "6px",
                                    }}
                                  />
                                  <div className="equip-label">
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        color: "#ffd700",
                                      }}
                                    >
                                      {item.name} +{level}
                                    </div>
                                    {mainStat && (
                                      <div
                                        style={{
                                          fontSize: "0.8rem",
                                          color: "#7cf",
                                        }}
                                      >
                                        {mainStat}: {mainValue}
                                      </div>
                                    )}
                                    {subList.map((sub, i) => {
                                      const upLevel = (upgrades[i] ?? 0) * 3;
                                      const value = calcSubStat(sub, upLevel);
                                      return (
                                        <div
                                          key={i}
                                          style={{
                                            fontSize: "0.75rem",
                                            color: "#ccc",
                                          }}
                                        >
                                          {sub}: {value}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="suggestion">
                            <button
                              onClick={() => handleVote(rec.id, rec.likes)}
                            >
                              추천 {rec.likes.length}
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
