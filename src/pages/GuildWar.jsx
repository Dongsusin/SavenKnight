import React, { useState } from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import monsterData from "../data/guildWarMonsters.json";
import siegeSkillData from "../data/siegeSkillData.json";
import heroes from "../data/heroes.json";

import "./GuildWar.css";
// 요일 탭 배열
const days = [
  "수호자의성",
  "포디나의성",
  "불멸의성",
  "죽음의성",
  "고대용의성",
  "혹한의성",
  "지옥의성",
];

export default function GuildWar() {
  // 요일, 몬스터, 팝업 관련 상태값
  const [selectedDay, setSelectedDay] = useState("수호자의성");
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showHeroPopup, setShowHeroPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  // 추천 영웅/팀 관련 상태값
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
  // 로그인 유저
  const [user] = useAuthState(auth);
  // 해당 요일의 몬스터 라운드 배열
  const [showTeamRegister, setShowTeamRegister] = useState(false);
  const rounds = monsterData[selectedDay] || [];
  // 모바일 감지
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // 창 크기 변경 시 반응형 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 스킬 설명에서 숫자 및 키워드 강조 처리
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
      "현재 생명력 비율을",
      "로 전환",
      "기절",
      "물리 피해량",
      "1인 공격기",
      "5인 공격기",
      "링크",
      "보호막",
      "광폭화",
      "감전",
      "관통",
      "화상",
      "방어력 감소",
      "모든 공격력 감소",
      "침묵",
      "마법 피해량",
      "연속 발동",
      "모든 피해 무효화",
      "용염",
      "피해 대상이 1명 줄어들 때마다",
      "만큼 피해량 증가",
      "치명타 확률",
      "치명타 피해",
      "반격",
      "빙결",
      "혹한의 기운",
      "혹한의 숨결",
      "즉사",
    ];

    let highlighted = text;

    buffKeywords
      .sort((a, b) => b.length - a.length)
      .forEach((keyword) => {
        const regex = new RegExp(
          keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "g"
        );
        highlighted = highlighted.replace(
          regex,
          `<span style="color: ${blueColor}; font-weight: bold;">${keyword}</span>`
        );
      });

    numberPatterns.forEach((regex) => {
      highlighted = highlighted.replace(
        regex,
        (match) =>
          `<span style="color: ${goldColor}; font-weight: bold;">${match}</span>`
      );
    });

    return highlighted;
  };
  // 슬롯 클릭 시 영웅 선택
  const handleSelectHeroSlot = (slotIndex, heroId) => {
    const updated = [...selectedTeamHeroes];
    updated[slotIndex] = heroId;
    setSelectedTeamHeroes(updated);
  };
  // 추천 영웅 구독
  useEffect(() => {
    const q = collection(db, "guildwars", selectedDay, "heroVotes");
    return onSnapshot(q, (snap) => {
      const votes = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHeroVotes(votes);
    });
  }, [selectedDay]);
  // 추천 팀 구독
  useEffect(() => {
    const q = collection(db, "guildwars", selectedDay, "teams");
    return onSnapshot(q, (snap) => {
      const teams = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeamVotes(teams);
    });
  }, [selectedDay]);
  // 영웅 추천 등록/취소 처리
  const handleHeroVote = async (heroId, likes = []) => {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(
      db,
      "guildwars",
      selectedDay,
      "heroVotes",
      heroId.toString()
    );

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        heroId,
        likes: [user.uid],
        createdAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        likes: likes.includes(user.uid)
          ? likes.filter((id) => id !== user.uid)
          : [...likes, user.uid],
      });
    }
  };
  // 팀 추천 등록/취소 처리
  const handleTeamVote = async (teamId, likes = []) => {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(db, "guildwars", selectedDay, "teams", teamId);
    await updateDoc(ref, {
      likes: likes.includes(user.uid)
        ? likes.filter((id) => id !== user.uid)
        : [...likes, user.uid],
    });
  };
  // 새 추천 덱 등록 처리
  const handleSubmitTeam = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    if (selectedTeamHeroes.some((id) => !id))
      return alert("빈 슬롯이 있습니다.");

    await addDoc(collection(db, "guildwars", selectedDay, "teams"), {
      heroes: selectedTeamHeroes,
      likes: [],
      authorName: user.displayName || user.email,
      createdAt: serverTimestamp(),
    });

    setSelectedTeamHeroes([null, null, null, null, null]);
    setActiveSlotIndex(null);
    setShowTeamRegister(false);
  };

  useEffect(() => {
    setSelectedMonster(null);
  }, [selectedDay]);

  return (
    <div className="guildwar-page page">
      {/* 요일 탭 */}
      <div className="day-tab-container">
        {days.map((day) => (
          <button
            key={day}
            className={`day-tab ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      {/* 라운드별 몬스터 출력 */}
      <div className="dungeon-info">
        <div className="round-list">
          {rounds.map((round, idx) => (
            <div className="round-card" key={idx}>
              <h2>Round {idx + 1}</h2>
              <div className="monster-row">
                {round.length > 0 ? (
                  round.map((monster, mIdx) => (
                    <div key={mIdx} className="monster-card">
                      <img
                        src={`/공성전/${selectedDay}/아이콘/${monster.name}(${
                          idx + 1
                        }라).png`}
                        alt={monster.name}
                        className="monster-image"
                        onClick={() =>
                          setSelectedMonster({ ...monster, round: idx + 1 })
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="no-data">해당 라운드 정보 없음</div>
                )}
              </div>
            </div>
          ))}
          {/* 추천 버튼 */}
          <div className="suggestion">
            <button onClick={() => setShowHeroPopup(true)}>추천 영웅</button>
            <button onClick={() => setShowTeamPopup(true)}>추천 덱</button>
          </div>
        </div>
        {/* 데스크탑용 스킬 정보 사이드 패널 */}
        {!isMobile && (
          <div className="monster-detail-side-panel">
            {selectedMonster ? (
              <div className="monster-detail-popup">
                <h3>{selectedMonster.name}</h3>
                <img
                  src={`/공성전/${selectedDay}/아이콘/${selectedMonster.name}(${selectedMonster.round}라).png`}
                  alt={selectedMonster.name}
                  className="monster-detail-image"
                />
                {/* 스킬 이미지 + 설명 툴팁 (레이드 스타일) */}
                <div className="guildwar-skill-list">
                  {[1, 2, 3, 4].map((n) => {
                    const skillData =
                      siegeSkillData?.[selectedDay]?.[selectedMonster.name]?.[
                        selectedMonster.round
                      ]?.[n - 1];
                    if (!skillData) return null;

                    const skillList = Array.isArray(skillData)
                      ? skillData
                      : [skillData];

                    return (
                      <div className="guildwar-skill-block" key={n}>
                        <img
                          src={`/공성전/${selectedDay}/스킬/${selectedMonster.name}-${n}.png`}
                          alt={`${selectedMonster.name} 스킬${n}`}
                          className="skill-image"
                          onError={(e) => (e.target.style.display = "none")}
                          style={{ marginBottom: "8px" }}
                        />
                        <div className="skill-des">
                          {skillList.map((skill, i) => (
                            <div key={i}>
                              {skill.name && <strong>{skill.name}</strong>}
                              {skill.target && (
                                <div
                                  className="target"
                                  style={{
                                    color:
                                      skill.detail === "버프"
                                        ? "#00ccff"
                                        : skill.detail === "공격"
                                        ? "#ff3300"
                                        : "#ffcc00",
                                  }}
                                >
                                  {skill.target}
                                </div>
                              )}
                              {Array.isArray(skill.description)
                                ? skill.description.map((line, j) => (
                                    <div
                                      className="line"
                                      key={j}
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(line),
                                      }}
                                    />
                                  ))
                                : skill.description && (
                                    <div
                                      className="line"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightKeywords(
                                          skill.description
                                        ),
                                      }}
                                    />
                                  )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="monster-detail-placeholder">
                몬스터를 클릭해 상세 정보를 확인하세요
              </div>
            )}
          </div>
        )}
      </div>
      {/* 팝업 */}
      {selectedMonster && isMobile && (
        <div
          className="monster-detail-popup-overlay"
          onClick={() => setSelectedMonster(null)}
        >
          <div
            className="monster-detail-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedMonster(null)}
            >
              ✕
            </button>
            {/* 스킬 이미지 + 설명 툴팁 (레이드 스타일) */}
            <div className="guildwar-skill-list">
              {[1, 2, 3, 4].map((n) => {
                const skillData =
                  siegeSkillData?.[selectedDay]?.[selectedMonster.name]?.[
                    selectedMonster.round
                  ]?.[n - 1];
                if (!skillData) return null;

                const skillList = Array.isArray(skillData)
                  ? skillData
                  : [skillData];

                return (
                  <div className="guildwar-skill-block" key={n}>
                    <img
                      src={`/공성전/${selectedDay}/스킬/${selectedMonster.name}-${n}.png`}
                      alt={`${selectedMonster.name} 스킬${n}`}
                      className="skill-image"
                      onError={(e) => (e.target.style.display = "none")}
                      style={{ marginBottom: "8px" }}
                    />
                    <div className="skill-des">
                      {skillList.map((skill, i) => (
                        <div key={i}>
                          {skill.name && <strong>{skill.name}</strong>}
                          {skill.target && (
                            <div
                              className="target"
                              style={{
                                color:
                                  skill.detail === "버프"
                                    ? "#00ccff"
                                    : skill.detail === "공격"
                                    ? "#ff3300"
                                    : "#ffcc00",
                              }}
                            >
                              {skill.target}
                            </div>
                          )}
                          {Array.isArray(skill.description)
                            ? skill.description.map((line, j) => (
                                <div
                                  className="line"
                                  key={j}
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(line),
                                  }}
                                />
                              ))
                            : skill.description && (
                                <div
                                  className="line"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightKeywords(
                                      skill.description
                                    ),
                                  }}
                                />
                              )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* 추천 영웅 팝업 */}
      {showHeroPopup && (
        <div className="hero-popup-overlay">
          <div className="hero-popup">
            <button
              className="popup-close"
              onClick={() => setShowHeroPopup(false)}
            >
              닫기
            </button>
            <h3>{selectedDay} 추천 영웅</h3>
            <div className="hero-list">
              {/* 1. 추천 수 있는 영웅 (likes.length > 0) */}
              {[...heroVotes]
                .filter((v) => (v.likes?.length || 0) > 0)
                .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                .map((vote) => {
                  const hero = heroes.find(
                    (h) => h.id === parseInt(vote.heroId)
                  );
                  if (!hero || hero.category === "특수영웅") return null;

                  const likes = vote.likes || [];
                  const liked = user && likes.includes(user.uid);

                  return (
                    <div key={hero.id} className="hero-item">
                      <img
                        src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                        alt={hero.name}
                      />
                      <button
                        className={`${liked ? "liked" : ""}`}
                        onClick={() => {
                          if (!user) {
                            alert("로그인이 필요합니다.");
                            return;
                          }
                          handleHeroVote(hero.id, likes);
                        }}
                      >
                        추천:{likes.length}
                      </button>
                    </div>
                  );
                })}

              {/* 2. 추천 정보가 없거나 추천 수가 0인 영웅 */}
              {heroes
                .filter((hero) => {
                  if (hero.category === "특수영웅") return false;
                  const voted = heroVotes.find(
                    (v) => parseInt(v.heroId) === hero.id
                  );
                  return !voted || (voted.likes?.length || 0) === 0;
                })
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
                        onClick={() => {
                          if (!user) {
                            alert("로그인이 필요합니다.");
                            return;
                          }
                          handleHeroVote(hero.id, likes);
                        }}
                      >
                        추천:{likes.length}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {/* 추천 덱 팝업 */}
      {showTeamPopup && (
        <div className="team-popup-overlay">
          <div className="team-popup">
            <button
              className="popup-close"
              onClick={() => setShowTeamPopup(false)}
            >
              닫기
            </button>
            <h3>{selectedDay} 추천 덱</h3>

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
                    [
                      ...teamVotes
                        .filter((team) =>
                          team.heroes.every((id) => {
                            const hero = heroes.find((h) => h.id === id);
                            return hero?.category !== "특수영웅";
                          })
                        )
                        .filter((team) => (team.likes?.length || 0) > 0)
                        .sort(
                          (a, b) =>
                            (b.likes?.length || 0) - (a.likes?.length || 0)
                        ),

                      ...teamVotes
                        .filter((team) =>
                          team.heroes.every((id) => {
                            const hero = heroes.find((h) => h.id === id);
                            return hero?.category !== "특수영웅";
                          })
                        )
                        .filter((team) => (team.likes?.length || 0) === 0),
                    ].map((team) => (
                      <div key={team.id} className="team-card">
                        <div className="team-heroes">
                          {team.heroes.map((id) => {
                            const hero = heroes.find((h) => h.id === id);
                            return (
                              <img
                                key={id}
                                src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
                                alt={hero.name}
                                title={hero.name}
                              />
                            );
                          })}
                        </div>
                        <div className="team-meta">
                          <button
                            onClick={() => handleTeamVote(team.id, team.likes)}
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
