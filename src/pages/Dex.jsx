import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import { useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Dex.css";

const GROUPS = ["스페셜", "일반", "아소드", "아이사", "기타", "펫", "검색"];
// 검색 필터용 키워드 상수 배열
const ABILITY_KEYWORDS = [
  "물리 공격력 증가",
  "마법 공격력 증가",
  "모든 공격력 증가",
  "방어력 증가",
  "모든 피해량 증가",
  "감쇄",
  "약점 공격 확률 증가",
  "치명타 확률 증가",
  "치명타 피해 증가",
  "효과 적중 증가",
  "효과 저항 증가",
  "물리 피해량 증가",
  "마법 피해량 증가",
  "물리 감쇄",
  "마법 감쇄",
  "막기 확률 증가",
  "3인 공격기 감쇄",
  "5인 공격기 감쇄",
  "주는 회복량 증가",
  "받는 회복량 증가",
  "효과 적용 확률 증가",
  "즉사 효과 적용 확률 증가",
  "피해량 증가",
  "효과 적중률 증가",
  "최대 생명력 증가",
  "치명타 피해량 증가",
];

const ABILITY_KEYWORDS2 = [
  "물리 공격력 감소",
  "마법 공격력 감소",
  "모든 공격력 감소",
  "방어력 감소",
  "모든 피해량 감소",
  "약점 공격 확률 감소",
  "치명타 확률 감소",
  "치명타 피해 감소",
  "효과 적중 감소",
  "효과 저항 감소",
  "물리 취약",
  "마법 취약",
  "물리 피해량 감소",
  "마법 피해량 감소",
  "막기 확률 감소",
  "빗나감 확률 증가",
  "받는 회복량 감소",
  "주는 회복량 감소",
  "회복 불가",
];

const ABILITY_KEYWORDS3 = [
  "기절",
  "마비",
  "감전",
  "빙결",
  "침묵",
  "수면",
  "석화",
  "실명",
];
const ABILITY_KEYWORDS4 = [
  "기절 면역",
  "감전 면역",
  "마비 면역",
  "빙결 면역",
  "침묵 면역",
  "수면 면역",
  "행동 제어 면역",
  "석화 면역",
  "실명 면역",
];
const ABILITY_KEYWORDS5 = ["즉사", "출혈", "화상", "중독"];
const ABILITY_KEYWORDS6 = ["화상 면역", "즉사 면역", "출혈 면역", "중독 면역"];
const ABILITY_KEYWORDS7 = ["턴제 버프 감소", "버프 해제"];
const ABILITY_KEYWORDS8 = ["디버프 면역", "디버프 해제"];
const ABILITY_KEYWORDS9 = [
  "피해 면역",
  "피해 무효화",
  "불사",
  "축복",
  "권능",
  "위장",
  "링크",
  "부활",
];
const ABILITY_KEYWORDS10 = ["보호막", "회복", "지속 회복", "피해량 비례 회복"];
const ABILITY_KEYWORDS11 = ["협공", "반격", "관통", "방어 무시", "고정 피해"];
const ABILITY_KEYWORDS12 = [
  "도발",
  "흡혈",
  "쿨타임 감소",
  "쿨타임 초기화",
  "폭발",
  "스킬 변환",
];
const ABILITY_KEYWORDS13 = [
  "집중 공격",
  "영멸",
  "생명력 전환",
  "처형",
  "쿨타임 증가",
];
// 스킬 설명 내 숫자/키워드 강조 처리 함수
const highlightKeywords = (text) => {
  const goldColor = "#ffcc00";
  const blueColor = "#00ccff";
  const numberPatterns = [/\d+%/g];
  const buffKeywords = ABILITY_KEYWORDS;

  let highlighted = text;
  numberPatterns.forEach((regex) => {
    highlighted = highlighted.replace(
      regex,
      (match) =>
        `<span style=\"color: ${goldColor}; font-weight: bold;\">${match}</span>`
    );
  });
  buffKeywords
    .sort((a, b) => b.length - a.length)
    .forEach((keyword) => {
      const regex = new RegExp(keyword, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style=\"color: ${blueColor}; font-weight: bold;\">${keyword}</span>`
      );
    });
  return highlighted;
};

export default function Dex() {
  const location = useLocation();
  const initialGroup = location.state?.group || "스페셜";
  const initialAbility = location.state?.ability || null;
  const initialSearchName = location.state?.name || "";
  // 현재 선택된 그룹: 스페셜 / 일반 / 펫 / 검색 등
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  // 효과 검색 키워드 상태
  const [selectedAbility, setSelectedAbility] = useState(initialAbility);
  const [user] = useAuthState(auth);
  // 추천 수 상태: 영웅 / 펫
  const [likes, setLikes] = useState({});
  const [petLikes, setPetLikes] = useState({});
  const [searchName, setSearchName] = useState(initialSearchName);

  const nameFilteredHeroes = heroes.filter((hero) =>
    hero.name.toLowerCase().includes(searchName.toLowerCase())
  );
  const nameFilteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchName.toLowerCase())
  );
  // 현재 그룹이 '펫'인지 여부
  const isPetGroup = selectedGroup === "펫";
  // 현재 그룹이 '검색'인지 여부
  const isSearchGroup = selectedGroup === "검색";

  const entries = isPetGroup
    ? pets
    : heroes.filter((hero) => hero.group === selectedGroup);
  const categoryKey = isPetGroup ? "rarity" : "category";
  const categories = [...new Set(entries.map((entry) => entry[categoryKey]))];

  const filteredHeroes = selectedAbility
    ? heroes.filter((hero) => {
        const effects = [
          ...(hero.passives?.map((p) => p.effect) || []),
          ...(hero.skills?.flat().map((s) => s.effect) || []),
          ...(hero.skillup?.flat() || []),
          ...(hero.twotranscendenceSkillUp?.flat() || []),
          ...(hero.sixtranscendenceSkillUp?.flat() || []),
        ];
        return effects.some((text) => text.includes(selectedAbility));
      })
    : [];
  // Firestore에서 추천 수 실시간 구독
  useEffect(() => {
    const heroUnsubs = heroes.map((hero) => {
      const ref = doc(db, "likes", hero.id.toString());
      return onSnapshot(ref, (snap) => {
        setLikes((prev) => ({
          ...prev,
          [hero.id]: snap.exists() ? snap.data() : { count: 0, users: [] },
        }));
      });
    });

    const petUnsubs = pets.map((pet) => {
      const ref = doc(db, "likes", pet.id.toString());
      return onSnapshot(ref, (snap) => {
        setLikes((prev) => ({
          ...prev,
          [pet.id]: snap.exists() ? snap.data() : { count: 0, users: [] },
        }));
      });
    });

    const petLikeUnsubs = pets.map((pet) => {
      const ref = doc(db, "petLikes", pet.id.toString());
      return onSnapshot(ref, (snap) => {
        setPetLikes((prev) => ({
          ...prev,
          [pet.id]: snap.exists() ? snap.data() : { count: 0, users: [] },
        }));
      });
    });

    return () => {
      [...heroUnsubs, ...petUnsubs, ...petLikeUnsubs].forEach((unsub) =>
        unsub()
      );
    };
  }, []);
  // 영웅 추천 클릭 시 처리
  const handleLike = async (heroId) => {
    if (!user) return alert("로그인이 필요합니다.");

    const ref = doc(db, "likes", heroId.toString());
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
  // 펫 추천 클릭 시 처리
  const handlePetLike = async (petId) => {
    if (!user) return alert("로그인이 필요합니다.");

    const ref = doc(db, "petLikes", petId.toString());
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

  return (
    <div className="page hero-dex">
      <aside className="hero-dex-sidebar">
        {GROUPS.map((group) => (
          <div
            key={group}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedAbility(null);
              setSearchName("");
            }}
            className={selectedGroup === group ? "active" : ""}
          >
            {group}
          </div>
        ))}
      </aside>

      <main className="hero-dex-content">
        <h2>{selectedGroup}</h2>

        {isSearchGroup ? (
          <section className="hero-ability-search two-column">
            <div className="search-top">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="영웅 또는 펫 이름을 입력하세요"
              />
            </div>
            <div className="search-bottom">
              <div className="ability-filter-column">
                {[
                  { title: "능력치 증가", list: ABILITY_KEYWORDS },
                  { title: "능력치 감소", list: ABILITY_KEYWORDS2 },
                  { title: "행동 제어", list: ABILITY_KEYWORDS3 },
                  { title: "행동 제어 면역", list: ABILITY_KEYWORDS4 },
                  { title: "지속 피해", list: ABILITY_KEYWORDS5 },
                  { title: "지속 피해 면역", list: ABILITY_KEYWORDS6 },
                  { title: "버프해제", list: ABILITY_KEYWORDS7 },
                  { title: "디버프 면역/해제", list: ABILITY_KEYWORDS8 },
                  { title: "생존", list: ABILITY_KEYWORDS9 },
                  { title: "회복 및 보호막", list: ABILITY_KEYWORDS10 },
                  { title: "특수 공격", list: ABILITY_KEYWORDS11 },
                  { title: "특수 버프", list: ABILITY_KEYWORDS12 },
                  { title: "특수 디버프", list: ABILITY_KEYWORDS13 },
                ].map(({ title, list }) => (
                  <div key={title} className="ability-group">
                    <h4 className="ability-title">{title}</h4>
                    <div className="ability-filter">
                      {list.map((keyword) => (
                        <button
                          key={keyword}
                          className={
                            selectedAbility === keyword ? "active" : ""
                          }
                          onClick={() => setSelectedAbility(keyword)}
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hero-result-column">
                {searchName && (
                  <>
                    <h3>이름 검색 결과</h3>
                    <div className="hero-cards">
                      {nameFilteredHeroes.map((hero) => (
                        <Link to={`/hero/${hero.name}`} key={hero.id}>
                          <div className="hero-card">
                            <button
                              className={`like-button ${
                                user &&
                                likes[hero.id]?.users?.includes(user.uid)
                                  ? "liked"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLike(hero.id);
                              }}
                            >
                              추천 {likes[hero.id]?.count || 0}
                            </button>
                            <img
                              src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                              alt={hero.name}
                              className="image"
                            />
                          </div>
                        </Link>
                      ))}
                      {nameFilteredPets.map((pet) => (
                        <div className="hero-card" key={pet.id}>
                          <img
                            src={`/도감/펫/아이콘/${pet.name}.png`}
                            alt={pet.name}
                            className="image"
                          />
                          <button
                            className={`like-button ${
                              user &&
                              petLikes[pet.id]?.users?.includes(user.uid)
                                ? "liked"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePetLike(pet.id);
                            }}
                          >
                            추천 {petLikes[pet.id]?.count || 0}
                          </button>
                        </div>
                      ))}
                      {nameFilteredHeroes.length === 0 &&
                        nameFilteredPets.length === 0 && (
                          <p style={{ color: "#aaa" }}>검색 결과가 없습니다.</p>
                        )}
                    </div>
                  </>
                )}

                <h3>해당 효과를 가진 캐릭터</h3>
                {selectedAbility ? (
                  <div className="hero-cards">
                    {filteredHeroes.map((hero) => (
                      <Link to={`/hero/${hero.name}`} key={hero.id}>
                        <div className="hero-card">
                          <button
                            className={`like-button ${
                              user && likes[hero.id]?.users?.includes(user.uid)
                                ? "liked"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLike(hero.id);
                            }}
                          >
                            추천 {likes[hero.id]?.count || 0}
                          </button>
                          <img
                            src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                            alt={hero.name}
                            className="image"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#aaa" }}>능력을 선택하세요.</p>
                )}
              </div>
            </div>
          </section>
        ) : (
          categories.map((category) => {
            const filtered = entries.filter(
              (entry) => entry[categoryKey] === category
            );
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
                        <img
                          src={imagePath}
                          alt={entry.name}
                          className="image"
                        />
                        <button
                          className={`like-button ${
                            user &&
                            petLikes[entry.id]?.users?.includes(user.uid)
                              ? "liked"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) {
                              alert("로그인이 필요합니다.");
                              return;
                            }
                            handlePetLike(entry.id);
                          }}
                        >
                          추천 {petLikes[entry.id]?.count || 0}
                        </button>
                        {skillPath && (
                          <div className="pet-skill-tooltip-wrapper">
                            <img
                              src={skillPath}
                              alt={entry.name}
                              className="pet-skill-icon"
                            />
                            <div className="skill-tooltip">
                              <strong>{entry.skill}</strong>
                              {Array.isArray(entry.des) ? (
                                entry.des.map((line, idx) => (
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
                                    __html: highlightKeywords(
                                      entry.skillDescription
                                    ),
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
                          <button
                            className={`like-button ${
                              user && likes[entry.id]?.users?.includes(user.uid)
                                ? "liked"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                alert("로그인이 필요합니다.");
                                return;
                              }
                              handleLike(entry.id);
                            }}
                          >
                            추천 {likes[entry.id]?.count || 0}
                          </button>

                          <img
                            src={imagePath}
                            alt={entry.name}
                            className="image"
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>
    </div>
  );
}
