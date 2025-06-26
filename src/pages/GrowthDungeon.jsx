import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import heroes from "../data/heroes.json";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dungeonList from "../data/dungeonData.json";
import "./GrowthDungeon.css";

export default function GrowthDungeon() {
  const location = useLocation();
  const selectedNameFromHome = location.state?.name;
  const initialId = selectedNameFromHome
    ? dungeonList.find((d) => d.name === selectedNameFromHome)?.id || 1
    : 1;

  const [user] = useAuthState(auth);
  const [showHeroPopup, setShowHeroPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showTeamRegister, setShowTeamRegister] = useState(false);

  const [heroVotes, setHeroVotes] = useState([]);
  const [teamVotes, setTeamVotes] = useState([]);
  const [selectedTeamHeroes, setSelectedTeamHeroes] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);

  const [selectedId, setSelectedId] = useState(initialId);
  const [selectedStage, setSelectedStage] = useState(1);
  const [visibleSkills, setVisibleSkills] = useState([]);
  const selectedDungeon = dungeonList.find((d) => d.id === selectedId);
  const boss = selectedDungeon?.bossStatsByStage?.[selectedStage - 1];
  const selectedSkills =
    selectedDungeon?.skillsByStage?.[selectedStage - 1] ||
    selectedDungeon?.skills ||
    [];

  useEffect(() => {
    setVisibleSkills(Array(selectedSkills.length).fill(true));
  }, [selectedId, selectedStage]);

  useEffect(() => {
    const q = collection(
      db,
      "growthDungeons",
      selectedId.toString(),
      "heroVotes"
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // 추천수 기준으로 정렬
      setHeroVotes(
        list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      );
    });
    return () => unsubscribe();
  }, [selectedId]);

  useEffect(() => {
    const q = collection(db, "growthDungeons", selectedId.toString(), "teams");

    return onSnapshot(q, (snap) => {
      const teams = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // 추천수 기준으로 정렬
      setTeamVotes(
        teams.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      );
    });
  }, [selectedId, selectedStage]);

  const handleHeroVote = async (heroId, likes = []) => {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(
      db,
      "growthDungeons",
      selectedId.toString(),
      "heroVotes",
      heroId.toString()
    );
    const docSnap = await getDoc(ref);

    if (!docSnap.exists()) {
      await setDoc(ref, {
        heroId,
        likes: [user.uid],
        createdAt: serverTimestamp(),
      });
    } else {
      const alreadyLiked = likes.includes(user.uid);
      await updateDoc(ref, {
        likes: alreadyLiked
          ? likes.filter((id) => id !== user.uid)
          : [...likes, user.uid],
      });
    }
  };

  const handleTeamVote = async (teamId, likes = []) => {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(
      db,
      "growthDungeons",
      selectedId.toString(),
      "teams",
      teamId
    );

    await updateDoc(ref, {
      likes: likes.includes(user.uid)
        ? likes.filter((id) => id !== user.uid)
        : [...likes, user.uid],
    });
  };

  const handleSelectHeroSlot = (slotIndex, heroId) => {
    const updated = [...selectedTeamHeroes];
    updated[slotIndex] = heroId;
    setSelectedTeamHeroes(updated);
  };

  const handleSubmitTeam = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    if (selectedTeamHeroes.some((id) => !id))
      return alert("빈 슬롯이 있습니다.");

    await addDoc(
      collection(db, "growthDungeons", selectedId.toString(), "teams"),
      {
        heroes: selectedTeamHeroes,
        likes: [],
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      }
    );
    setSelectedTeamHeroes([null, null, null, null, null]);
    setActiveSlotIndex(null);
    setShowTeamRegister(false);
  };

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
      "화상",
      "물리 공격력 증가",
      "광폭화",
      "빙결",
      "최대 생명력 증가",
      "기절",
      "방어력 증가",
      "마법 공격력 증가",
      "감전",
      "모든 피해 무효화",
      "즉사",
      "방어력 감소",
      "관통 고정 피해",
      "대상의 턴제 버프 감소",
    ];

    let highlighted = text;

    numberPatterns.forEach((regex) => {
      highlighted = highlighted.replace(
        regex,
        (match) =>
          `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
      );
    });

    buffKeywords
      .sort((a, b) => b.length - a.length)
      .forEach((keyword) => {
        const regex = new RegExp(keyword, "g");
        highlighted = highlighted.replace(
          regex,
          `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
        );
      });

    return highlighted;
  };

  if (!selectedDungeon || !boss) return null;

  return (
    <div className="growth-container page">
      <div className="dungeon-list">
        {dungeonList.map((dungeon) => (
          <div
            key={dungeon.id}
            className={`dungeon-tab ${
              dungeon.id === selectedId ? "active" : ""
            }`}
            onClick={() => {
              setSelectedId(dungeon.id);
              setSelectedStage(1);
            }}
            style={{ backgroundImage: `url(${dungeon.image})` }}
          ></div>
        ))}
      </div>

      <div className="dungeon-detail">
        <div className="dungeon-info">
          <div className="dungeon-top">
            <div className="dungeon-image">
              <img src={selectedDungeon.bg} alt="보스 이미지" />
            </div>

            <div className="boss-stats-box">
              <div className="boss-stat-list two-column">
                <div>
                  <div>
                    <strong>
                      {["물의원소", "빛의원소"].includes(selectedDungeon.name)
                        ? "마법 공격력"
                        : "물리 공격력"}
                      :
                    </strong>{" "}
                    {boss.atk.toLocaleString()}
                  </div>
                  <div>
                    <strong>방어력:</strong> {boss.def.toLocaleString()}
                  </div>
                  <div>
                    <strong>생명력:</strong> {boss.hp.toLocaleString()}
                  </div>
                  <div>
                    <strong>속공:</strong> {boss.spd}
                  </div>
                  <div>
                    <strong>치명타 확률:</strong> {boss.critRate}%
                  </div>
                  <div>
                    <strong>치명타 피해:</strong> {boss.critDmg}%
                  </div>
                </div>
                <div>
                  <div>
                    <strong>약점 공격 확률:</strong> {boss.weakHit}%
                  </div>
                  <div>
                    <strong>막기 확률:</strong> {boss.block}%
                  </div>
                  <div>
                    <strong>받는 피해 감소:</strong> {boss.dmgReduction}%
                  </div>
                  <div>
                    <strong>효과 적중:</strong> {boss.acc}%
                  </div>
                  <div>
                    <strong>효과 저항:</strong> {boss.res}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dungeon-bottom">
            <div className="stage-skill-wrapper">
              <div className="stage">
                <p>단계 선택</p>
                <div className="stage-select">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      className={selectedStage === i + 1 ? "active" : ""}
                      onClick={() => setSelectedStage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="skill-preview">
                <p>보스 스킬</p>
                <div className="skill-images">
                  {selectedSkills.map((skill, idx) =>
                    visibleSkills[idx] ? (
                      <div key={idx} className="skill-tooltip-wrapper">
                        <img
                          src={`/성장던전/스킬/${selectedDungeon.name}-${
                            idx + 1
                          }.png`}
                          alt={skill.name}
                          onError={() => {
                            const newVisible = [...visibleSkills];
                            newVisible[idx] = false;
                            setVisibleSkills(newVisible);
                          }}
                        />
                        <div className="skill-tooltip">
                          <strong>{skill.name}</strong>
                          {skill.skillcooldown !== 0 && (
                            <p>쿨타임: {skill.skillcooldown}초</p>
                          )}
                          {skill.effects?.map((e, i) => {
                            const targetColor =
                              e.detail === "버프"
                                ? "#00ccff"
                                : e.detail === "공격"
                                ? "#ff3300"
                                : "#ffcc00";
                            return (
                              <div key={i} style={{ marginBottom: "4px" }}>
                                {e.target && (
                                  <div
                                    className="skill-target"
                                    style={{
                                      color: targetColor,
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {e.target}
                                  </div>
                                )}
                                {Array.isArray(e.effect) ? (
                                  e.effect.map((line, j) => (
                                    <div
                                      key={j}
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(line),
                                      }}
                                    />
                                  ))
                                ) : (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: highlightKeywords(e.effect || ""),
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="reward-section">
            <p>획득 가능 보상</p>
            <div className="reward-text">
              {(
                selectedDungeon.rewardsByStage[selectedStage - 1] ||
                "보상 정보 없음"
              )
                .split(",")
                .map((part, idx) => (
                  <div key={idx}>{part.trim()}</div>
                ))}
            </div>
          </div>
          <div className="suggestion">
            <button onClick={() => setShowHeroPopup(true)}>추천 영웅</button>
            <button onClick={() => setShowTeamPopup(true)}>추천 덱</button>
          </div>
        </div>
      </div>

      {showHeroPopup && (
        <div className="hero-popup-overlay">
          <div className="hero-popup">
            <button
              className="popup-close"
              onClick={() => setShowHeroPopup(false)}
            >
              닫기
            </button>
            <h3>{selectedDungeon.name} 추천 영웅</h3>
            <div className="hero-list">
              {heroes
                .filter((hero) => hero.category !== "특수영웅") // 🔽 필터 추가
                .map((hero) => {
                  const vote = heroVotes.find(
                    (v) => parseInt(v.heroId) === hero.id
                  );
                  const likes = vote?.likes || [];
                  const liked = user && likes.includes(user.uid);

                  return (
                    <div key={hero.id} className="hero-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                      />
                      <button
                        className={`vote-button ${liked ? "liked" : ""}`}
                        onClick={() => {
                          if (!user) {
                            alert("로그인이 필요합니다.");
                            return;
                          }
                          handleHeroVote(hero.id, likes);
                        }}
                      >
                        추천: {likes.length}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {showTeamPopup && (
        <div className="team-popup-overlay">
          <div className="team-popup">
            <button
              className="popup-close"
              onClick={() => setShowTeamPopup(false)}
            >
              닫기
            </button>
            <h3>{selectedDungeon.name} 추천 덱</h3>

            {!showTeamRegister ? (
              <>
                <div className="team-list">
                  {teamVotes.filter((team) =>
                    team.heroes.every((id) => {
                      const hero = heroes.find((h) => h.id === id);
                      return hero?.category !== "특수영웅";
                    })
                  ).length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#aaa",
                        marginTop: "20px",
                      }}
                    >
                      아직 등록된 덱이 없습니다. 덱을 추천해주세요!
                    </p>
                  ) : (
                    teamVotes
                      .filter((team) =>
                        team.heroes.every((id) => {
                          const hero = heroes.find((h) => h.id === id);
                          return hero?.category !== "특수영웅";
                        })
                      )
                      .map((team) => (
                        <div key={team.id} className="team-card">
                          <div className="team-heroes">
                            {team.heroes.map((id) => {
                              const hero = heroes.find((h) => h.id === id);
                              return (
                                <img
                                  key={id}
                                  src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                                  alt={hero.name}
                                />
                              );
                            })}
                          </div>
                          <div className="team-meta">
                            <button
                              onClick={() =>
                                handleTeamVote(team.id, team.likes)
                              }
                            >
                              추천 {team.likes?.length || 0}
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <div className="team-add-button-wrap">
                  <button
                    onClick={() => setShowTeamRegister(true)}
                    className="submit-team-button"
                  >
                    새 덱 등록하기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="team-selection-area">
                  <div className="selected-team">
                    {selectedTeamHeroes.map((heroId, i) => {
                      const hero = heroes.find((h) => h.id === heroId);
                      return (
                        <div key={i} className="team-slot">
                          {hero ? (
                            <img
                              src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                              alt={hero.name}
                              onClick={() => handleSelectHeroSlot(i, null)}
                            />
                          ) : (
                            <div
                              className="team-slot-empty"
                              onClick={() => setActiveSlotIndex(i)}
                            >
                              +
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleSubmitTeam}
                    className="submit-team-button"
                  >
                    등록 완료
                  </button>
                </div>
                {activeSlotIndex !== null && (
                  <div className="hero-select-list">
                    {heroes
                      .filter((hero) => hero.category !== "특수영웅")
                      .map((hero) => (
                        <div
                          key={hero.id}
                          className="hero-item"
                          onClick={() => {
                            handleSelectHeroSlot(activeSlotIndex, hero.id);
                            setActiveSlotIndex(null);
                          }}
                        >
                          <img
                            src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                            alt={hero.name}
                            title={hero.name}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
