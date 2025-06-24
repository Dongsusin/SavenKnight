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
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedAbility, setSelectedAbility] = useState(initialAbility);
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState({});

  const isPetGroup = selectedGroup === "펫";
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

  useEffect(() => {
    const unsubscribes = heroes.map((hero) => {
      const ref = doc(db, "likes", hero.id.toString());
      return onSnapshot(ref, (snap) => {
        setLikes((prev) => ({
          ...prev,
          [hero.id]: snap.exists() ? snap.data() : { count: 0, users: [] },
        }));
      });
    });
    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

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
  return (
    <div className="page hero-dex">
      <aside className="hero-dex-sidebar">
        {GROUPS.map((group) => (
          <div
            key={group}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedAbility(null);
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
            <div className="ability-filter-column">
              {[
                ABILITY_KEYWORDS,
                ABILITY_KEYWORDS2,
                ABILITY_KEYWORDS3,
                ABILITY_KEYWORDS4,
                ABILITY_KEYWORDS5,
                ABILITY_KEYWORDS6,
                ABILITY_KEYWORDS7,
                ABILITY_KEYWORDS8,
                ABILITY_KEYWORDS9,
                ABILITY_KEYWORDS10,
                ABILITY_KEYWORDS11,
                ABILITY_KEYWORDS12,
                ABILITY_KEYWORDS13,
              ].map((group, i) => (
                <div key={i} className="ability-filter">
                  {group.map((keyword) => (
                    <button
                      key={keyword}
                      className={selectedAbility === keyword ? "active" : ""}
                      onClick={() => setSelectedAbility(keyword)}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="hero-result-column">
              <h3>해당 효과를 가진 캐릭터</h3>
              {selectedAbility ? (
                <div className="hero-cards">
                  {filteredHeroes.map((hero) => (
                    <Link to={`/hero/${hero.name}`} key={hero.id}>
                      <div className="hero-card">
                        <button
                          className={`like-button ${
                            likes[entry.id]?.users?.includes(user?.uid)
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
                              likes[entry.id]?.users?.includes(user?.uid)
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
