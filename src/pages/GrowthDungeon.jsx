import { useState } from "react";
import "./GrowthDungeon.css";

const dungeonList = [
  {
    id: 1,
    name: "불의 원소 던전",
    image: "/성장던전/선택/불의원소.png",
    bg: "/성장던전/배경/불의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 불의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 불의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 불의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 불의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 불의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 불의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 불의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 불의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 불의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 불의 원소 상급: 20",
    ],
  },
  {
    id: 2,
    name: "물의 원소 던전",
    image: "/성장던전/선택/물의원소.png",
    bg: "/성장던전/배경/물의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 물의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 물의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 물의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 물의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 물의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 물의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 물의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 물의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 물의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 물의 원소 상급: 20",
    ],
  },
  {
    id: 3,
    name: "땅의 원소 던전",
    image: "/성장던전/선택/땅의원소.png",
    bg: "/성장던전/배경/땅의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 땅의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 땅의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 땅의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 땅의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 땅의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 땅의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 땅의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 땅의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 땅의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 땅의 원소 상급: 20",
    ],
  },
  {
    id: 4,
    name: "빛의 원소 던전",
    image: "/성장던전/선택/빛의원소.png",
    bg: "/성장던전/배경/빛의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 빛의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 빛의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 빛의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 빛의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 빛의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 빛의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 빛의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 빛의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 빛의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 빛의 원소 상급: 20",
    ],
  },
  {
    id: 5,
    name: "암흑의 원소 던전",
    image: "/성장던전/선택/암흑의원소.png",
    bg: "/성장던전/배경/암흑의원소.png",
    rewardsByStage: [
      "EXP: 450, 골드: 1400, 암흑의 원소 하급: 5",
      "EXP: 500, 골드: 1600, 암흑의 원소 하급: 10",
      "EXP: 550, 골드: 1800, 암흑의 원소 하급: 20",
      "EXP: 600, 골드: 2000, 암흑의 원소 중급: 5",
      "EXP: 650, 골드: 2200, 암흑의 원소 중급: 10",
      "EXP: 700, 골드: 2400, 암흑의 원소 중급: 15",
      "EXP: 750, 골드: 2600, 암흑의 원소 상급: 5",
      "EXP: 800, 골드: 2800, 암흑의 원소 상급: 10",
      "EXP: 850, 골드: 3000, 암흑의 원소 상급: 15",
      "EXP: 900, 골드: 3200, 암흑의 원소 상급: 20",
    ],
  },
  {
    id: 6,
    name: "골드 던전",
    image: "/성장던전/선택/골드.png",
    bg: "/성장던전/배경/골드.png",
    rewardsByStage: [
      "EXP: 450, 골드: 50000",
      "EXP: 500, 골드: 60000",
      "EXP: 550, 골드: 70000",
      "EXP: 600, 골드: 80000",
      "EXP: 650, 골드: 100000",
      "EXP: 700, 골드: 120000",
      "EXP: 750, 골드: 150000",
      "EXP: 800, 골드: 180000",
      "EXP: 850, 골드: 210000",
      "EXP: 900, 골드: 250000",
    ],
  },
];

export default function GrowthDungeon() {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedStage, setSelectedStage] = useState(1);

  const selectedDungeon = dungeonList.find((d) => d.id === selectedId);

  return (
    <div className="growth-container">
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
            style={{
              backgroundImage: `url(${dungeon.image})`,
            }}
          ></div>
        ))}
      </div>

      <div className="dungeon-detail">
        <div className="dungeon-bg">
          <img src={selectedDungeon.bg} alt="던전 배경" />
        </div>

        <div className="dungeon-info">
          <h2>{selectedDungeon.name}</h2>

          <div className="reward-section">
            <p>획득 가능 보상</p>
            <div className="reward-text">
              {selectedDungeon.rewardsByStage?.[selectedStage - 1] ||
                "보상 정보 없음"}
            </div>
          </div>

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
      </div>
    </div>
  );
}
