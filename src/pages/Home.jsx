import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlide from "../components/HeroSlide";
import PetSlide from "../components/PetSlide";
import CharacterSelectPopup from "../components/CharacterSelectPopup";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import heroes from "../data/heroes.json";
import pets from "../data/pets.json";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";

const ABILITY_SEARCH_KEYWORDS = [
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
  "기절",
  "마비",
  "감전",
  "빙결",
  "침묵",
  "수면",
  "석화",
  "실명",
  "기절 면역",
  "감전 면역",
  "마비 면역",
  "빙결 면역",
  "침묵 면역",
  "수면 면역",
  "행동 제어 면역",
  "석화 면역",
  "실명 면역",
  "즉사",
  "출혈",
  "화상",
  "중독",
  "화상 면역",
  "즉사 면역",
  "출혈 면역",
  "중독 면역",
  "턴제 버프 감소",
  "버프 해제",
  "디버프 면역",
  "디버프 해제",
  "피해 면역",
  "피해 무효화",
  "불사",
  "축복",
  "권능",
  "위장",
  "링크",
  "부활",
  "보호막",
  "회복",
  "지속 회복",
  "피해량 비례 회복",
  "협공",
  "반격",
  "관통",
  "방어 무시",
  "고정 피해",
  "도발",
  "흡혈",
  "쿨타임 감소",
  "쿨타임 초기화",
  "폭발",
  "스킬 변환",
  "집중 공격",
  "영멸",
  "생명력 전환",
  "처형",
  "쿨타임 증가",
];

export default function Home() {
  const navigate = useNavigate();
  const [previewTeam, setPreviewTeam] = useState(Array(5).fill(null));
  const [selectingIndex, setSelectingIndex] = useState(null);
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState([
    {
      title: "정식 오픈",
      start: "2025-05-15",
      end: "2025-05-15",
    },
    {
      title: "제이브, 레이첼, 바네사 영웅 픽업 소환 및 성장 이벤트 안내",
      start: "2025-05-15",
      end: "2025-05-28",
    },
    {
      title: "태오/타카 업데이트",
      start: "2025-05-29",
      end: "2025-05-29",
    },
    {
      title: "태오, 타카 영웅 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-05-29",
      end: "2025-06-11",
    },
    {
      title: "시나리오 이벤트 : [늦게 피는 꽃]",
      start: "2025-05-29",
      end: "2025-06-11",
    },
    {
      title: "연희 업데이트",
      start: "2025-06-12",
      end: "2025-06-12",
    },
    {
      title: "연희 영웅 픽업 소환 및 영웅 성장 이벤트",
      start: "2025-06-12",
      end: "2025-06-25",
    },
    {
      title: "골드 러시 이벤트",
      start: "2025-06-12",
      end: "2025-06-25",
    },
    {
      title: "멜키르 업데이트",
      start: "2025-06-26",
      end: "2025-06-26",
    },
    {
      title: "멜키르 시나리오 이벤트 [최후의 시간선]",
      start: "2025-06-26",
      end: "2025-07-09",
    },
    {
      title: "멜키르 픽업 소환 및 영웅 성장 이벤트 안내",
      start: "2025-06-26",
      end: "2025-07-09",
    },
    {
      title: "길드전 대비! 레이드 장비 추가 획득 이벤트",
      start: "2025-06-26",
      end: "2025-07-09",
    },
  ]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getEventsForDate = (date) => {
    const target = formatDate(date);
    return events.filter((e) => e.start <= target && target <= e.end);
  };

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

    return () => {
      [...heroUnsubs, ...petUnsubs].forEach((unsub) => unsub());
    };
  }, []);

  const handleLike = async (id) => {
    if (!user) return alert("로그인이 필요합니다.");

    const ref = doc(db, "likes", id.toString());
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
    <div className="page home-layout">
      <div className="main">
        {/* 왼쪽 섹션 */}
        <aside className="home-sidebar">
          <section className="home-panel">
            <h2>업데이트 게시판</h2>
            <ul>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6254363">
                  [2025-06-26]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6184591">
                  [2025-06-12]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6103024">
                  [2025-05-29]업데이트 내역
                </a>
              </li>
              <li>
                <a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6056683">
                  [2025-05-21]업데이트 내역
                </a>
              </li>
            </ul>
          </section>

          <section className="home-panel">
            <h2>쿠폰 코드</h2>
            <ul className="coupon-list">
              <li>
                <div className="coupon-code">SENARESAMEWAY</div>
                <div className="coupon-reward">열쇠 상자 3개</div>
              </li>
              <li>
                <div className="coupon-code">SENAREYOUNGLAEGI</div>
                <div className="coupon-reward">골드 30만</div>
              </li>
              <li>
                <div className="coupon-code">SENAREGSIK</div>
                <div className="coupon-reward">희귀 영웅 소환권 1개</div>
              </li>
              <li>
                <div className="coupon-code">SENAREMOOVING</div>
                <div className="coupon-reward">진화 재료 상자(중) 30개</div>
              </li>
              <li>
                <div className="coupon-code">SORRY4WAITING</div>
                <div className="coupon-reward">진화 재료 상자(상) 30개</div>
              </li>
              <li>
                <div className="coupon-code">SEVENKNIGHTSFOREVER</div>
                <div className="coupon-reward">희귀 영웅 선택권 1개 </div>
              </li>
            </ul>
          </section>

          <section className="home-panel">
            <h2>효과별 검색</h2>
            <div className="ability-shortcut-list">
              {ABILITY_SEARCH_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  className="ability-shortcut-button"
                  onClick={() =>
                    navigate("/dex", {
                      state: { group: "검색", ability: keyword },
                    })
                  }
                >
                  {keyword}
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* 중앙 섹션 */}
        <main className="home-main">
          <section className="home-panel">
            <h2>이벤트 캘린더</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date, view }) => {
                if (view === "month" && date.getDay() === 4) {
                  return "thursday-tile";
                }
                return null;
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const target = formatDate(date);
                const dayEvents = events.filter(
                  (e) => e.start <= target && target <= e.end
                );
                if (dayEvents.length === 0) return null;
                return (
                  <div
                    className="event-dot-bar"
                    title={dayEvents
                      .map((e) => `${e.title} (${e.start}~${e.end})`)
                      .join("\n")}
                  ></div>
                );
              }}
            />

            {getEventsForDate(selectedDate).length > 0 && (
              <div className="calendar-selected-event">
                {formatDate(selectedDate)}의 이벤트:
                <ul>
                  {getEventsForDate(selectedDate).map((e, i) => (
                    <li key={i}>
                      • {e.title} ({e.start} ~ {e.end})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="home-panel">
            <h2>영웅 도감</h2>
            <HeroSlide likes={likes} handleLike={handleLike} user={user} />
          </section>

          <section className="home-panel">
            <h2>펫 도감</h2>
            <div>
              <PetSlide likes={likes} handleLike={handleLike} user={user} />
            </div>
          </section>

          <section className="home-panel">
            <h2>팀 편성</h2>
            <div className="mini-team-preview">
              {previewTeam.map((member, index) => (
                <div
                  key={index}
                  className="mini-slot"
                  onClick={() => setSelectingIndex(index)}
                >
                  {member ? (
                    <img
                      src={`/도감/${member.group}/아이콘/${member.name}.png`}
                      alt={member.name}
                      style={{ width: "60px", height: "60px" }}
                    />
                  ) : (
                    <div className="empty-slot">+</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                className="team-navigate-button"
                onClick={() => navigate("/team")}
              >
                팀 편성하러 가기
              </button>
            </div>
            {selectingIndex !== null && (
              <CharacterSelectPopup
                onSelect={(hero) => {
                  const updated = [...previewTeam];
                  updated[selectingIndex] = hero;
                  setPreviewTeam(updated);
                  setSelectingIndex(null);
                }}
                onClose={() => setSelectingIndex(null)}
              />
            )}
          </section>
        </main>

        {/* 오른쪽 섹션 */}
        <aside className="home-sidebar">
          <section className="home-panel">
            <h2>레이드</h2>
            <ul className="home-raid-list">
              {[
                { name: "파멸의눈동자", img: "/레이드/선택/파멸의눈동자.png" },
                { name: "우마왕", img: "/레이드/선택/우마왕.png" },
                { name: "강철의포식자", img: "/레이드/선택/강철의포식자.png" },
              ].map((raid, i) => (
                <li
                  key={raid.name}
                  className={`home-raid-card ${i === 0 ? "selected" : ""}`}
                  onClick={() =>
                    navigate("/raid", { state: { name: raid.name } })
                  }
                >
                  <img src={raid.img} alt={raid.name} />
                  <span>{raid.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="home-panel">
            <h2>성장 던전</h2>
            <ul className="GrowthDungeon-list">
              {[
                { name: "불의원소", img: "/성장던전/배경/불의원소.png" },
                { name: "물의원소", img: "/성장던전/배경/물의원소.png" },
                { name: "땅의원소", img: "/성장던전/배경/땅의원소.png" },
                { name: "빛의원소", img: "/성장던전/배경/빛의원소.png" },
                { name: "암흑의원소", img: "/성장던전/배경/암흑의원소.png" },
                { name: "골드", img: "/성장던전/배경/골드.png" },
              ].map((GrowthDungeon, i) => (
                <li
                  key={GrowthDungeon.name}
                  className={`GrowthDungeon-card ${i === 0 ? "selected" : ""}`}
                  onClick={() =>
                    navigate("/growth-dungeon", {
                      state: { name: GrowthDungeon.name },
                    })
                  }
                >
                  <img src={GrowthDungeon.img} alt={GrowthDungeon.name} />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
