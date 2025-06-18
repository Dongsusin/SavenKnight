import { useState } from "react";
import "./Raid.css";

const raidData = [
  {
    id: 1,
    name: "파멸의 눈동자",
    image: "/레이드/파멸의 눈동자.png",
    description: "거대한 눈이 세상을 지켜보고 있다.",
  },
  {
    id: 2,
    name: "우마왕",
    image: "/레이드/우마왕.png",
    description: "광폭한 소 왕의 맹공격!",
  },
  {
    id: 3,
    name: "강철의 포식자",
    image: "/레이드/강철의 포식자.png",
    description: "모든 금속을 삼키는 거대한 포식자.",
  },
];

export default function Raid() {
  const [selectedId, setSelectedId] = useState(raidData[0].id);
  const selectedRaid = raidData.find((r) => r.id === selectedId);

  return (
    <div className="raid-container page">
      <div className="raid-list">
        {raidData.map((raid) => (
          <div
            key={raid.id}
            className={`raid-tab ${raid.id === selectedId ? "active" : ""}`}
            onClick={() => setSelectedId(raid.id)}
          >
            <img src={raid.image} alt={raid.name} className="raid-tab-img" />
            <div className="raid-tab-name">{raid.name}</div>
          </div>
        ))}
      </div>

      <div className="raid-detail">
        <div className="raid-bg">
          <img src={selectedRaid.image} alt={selectedRaid.name} />
        </div>
        <div className="raid-info">
          <h2>{selectedRaid.name}</h2>
          <p>{selectedRaid.description}</p>
        </div>
      </div>
    </div>
  );
}
