import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
} from "firebase/firestore";
import { auth, db } from "../firebase";
import raidData from "../data/raidData.json";
import heroes from "../data/heroes.json";
import "./Raid.css";

export default function Raid() {
  const location = useLocation();
  const selectedNameFromHome = location.state?.name;
  const initialId = selectedNameFromHome
    ? raidData.find((r) => r.name === selectedNameFromHome)?.id ||
      raidData[0].id
    : raidData[0].id;

  const [selectedId, setSelectedId] = useState(initialId);
  const [selectedStage, setSelectedStage] = useState(1);
  const [visibleSkills, setVisibleSkills] = useState([]);
  const [user] = useAuthState(auth);

  const selectedRaid = raidData.find((r) => r.id === selectedId);
  const boss = selectedRaid?.bossStatsByStage?.[selectedStage - 1];
  const selectedSkills =
    selectedRaid?.skillsByStage?.[selectedStage - 1] ||
    selectedRaid?.skills ||
    [];

  useEffect(() => {
    setVisibleSkills(Array(selectedSkills.length).fill(true));
  }, [selectedId, selectedStage]);

  const [showHeroPopup, setShowHeroPopup] = useState(false);
  const [heroVotes, setHeroVotes] = useState([]);

  useEffect(() => {
    const q = query(
      collection(
        db,
        "raids",
        selectedId.toString(),
        "stages",
        selectedStage.toString(),
        "heroVotes"
      ),
      orderBy("likes", "desc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHeroVotes(list);
    });
    return () => unsubscribe();
  }, [selectedId, selectedStage]);

  const handleHeroVote = async (heroId, likes = []) => {
    if (!user) return alert("로그인이 필요합니다.");
    const ref = doc(
      db,
      "raids",
      selectedId.toString(),
      "stages",
      selectedStage.toString(),
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
      "기절",
      "마법 감쇄",
      "누적 공격력 증가",
      "석화",
      "출혈",
      "홍담 소환",
      "감쇄",
      "피해량 증가",
      "마비",
      "방어력 감소",
      "맹독",
      "물리 감쇄",
      "방어력 증가",
      "물리 공격력 증가",
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

  return (
    <div className="raid-container page">
      <div className="raid-list">
        {raidData.map((raid) => (
          <div
            key={raid.id}
            className={`raid-tab ${raid.id === selectedId ? "active" : ""}`}
            onClick={() => {
              setSelectedId(raid.id);
              setSelectedStage(1);
            }}
          >
            <img src={raid.image} alt={raid.name} className="raid-tab-img" />
            <div className="raid-tab-name">{raid.name}</div>
          </div>
        ))}
      </div>

      <div className="raid-detail">
        <div className="dungeon-info">
          <div className="raid-top">
            <div className="raid-bg">
              <img src={selectedRaid.bg} alt={selectedRaid.name} />
            </div>

            {boss && (
              <div className="raid-stats-box">
                <div className="raid-stat-list">
                  <div>
                    <div>
                      <strong>공격력:</strong> {boss.atk}
                    </div>
                    <div>
                      <strong>방어력:</strong> {boss.def}
                    </div>
                    <div>
                      <strong>체력:</strong> {boss.hp}
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
                      <strong>약점공격:</strong> {boss.weakHit}%
                    </div>
                    <div>
                      <strong>막기 확률:</strong> {boss.block}%
                    </div>
                    <div>
                      <strong>받피감:</strong> {boss.dmgReduction}%
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
            )}
          </div>

          <div className="stage-skill-wrapper">
            <div className="stage">
              <p>단계 선택</p>
              <div className="stage-select">
                {selectedRaid.rewardsByStage.map((_, i) => (
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

            <div className="skill-section">
              <p>보스 스킬</p>
              <div className="raid-skill-images">
                {selectedSkills.map((skill, idx) =>
                  visibleSkills[idx] ? (
                    <div key={idx} className="skill-tooltip-wrapper">
                      <img
                        src={`/레이드/스킬/${selectedRaid.name}-${idx + 1}.png`}
                        alt={skill.name}
                        onError={() => {
                          const updated = [...visibleSkills];
                          updated[idx] = false;
                          setVisibleSkills(updated);
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

          <div className="reward-section">
            <p>획득 가능 보상</p>
            <div className="reward-text">
              {(selectedRaid.rewardsByStage?.[selectedStage - 1] || "")
                .split(",")
                .map((text, idx) => (
                  <div key={idx}>{text.trim()}</div>
                ))}
            </div>
          </div>

          <button className="suggestion" onClick={() => setShowHeroPopup(true)}>
            추천 영웅
          </button>
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
            <h3>추천 영웅</h3>
            <div className="hero-list">
              {heroes.map((hero) => {
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
    </div>
  );
}
