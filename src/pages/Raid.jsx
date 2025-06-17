import "./Raid.css";

export default function Raid() {
  const raidData = [
    { id: 1, name: "파멸의 눈동자", image: "/레이드/파멸의 눈동자.png" },
    { id: 2, name: "우마왕", image: "/레이드/우마왕.png" },
    { id: 3, name: "강철의 포식자", image: "/레이드/강철의 포식자.png" },
  ];

  return (
    <div className="raid-page page">
      <h1>레이드</h1>

      <div className="raid-cards">
        {raidData.map((raid) => (
          <div key={raid.id} className="raid-card">
            <img src={raid.image} alt={raid.name} />
            <div className="raid-name">{raid.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
