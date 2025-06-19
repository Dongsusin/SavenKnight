import { useState } from "react";
import "./Raid.css";

const raidData = [
  {
    id: 1,
    name: "파멸의 눈동자",
    image: "/레이드/선택/파멸의눈동자.png",
    bg: "/레이드/배경/파멸의눈동자.png",
    rewardsByStage: [
      "EXP: 600, 골드: 1000, 4성 드래곤 장비",
      "EXP: 700, 골드: 1100, 4성 드래곤 장비",
      "EXP: 800, 골드: 1200, 4~5성 드래곤 장비",
      "EXP: 900, 골드: 1300, 4~5성 드래곤 장비",
      "EXP: 1000, 골드: 1400, 4~5성 드래곤 장비",
      "EXP: 1100, 골드: 1600, 5성 드래곤 장비",
      "EXP: 1200, 골드: 1800, 5~6성 드래곤 장비",
      "EXP: 1300, 골드: 2000, 5~6성 드래곤 장비",
      "EXP: 1400, 골드: 2200, 5~6성 드래곤 장비",
      "EXP: 1500, 골드: 2400, 6성 드래곤 장비",
    ],
    bossStatsByStage: [
      {
        atk: 349,
        def: 432,
        hp: 10492,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 376,
        def: 464,
        hp: 12100,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 411,
        def: 508,
        hp: 15954,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 603,
        def: 652,
        hp: 24045,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 830,
        def: 796,
        hp: 34438,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 15,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1144,
        def: 940,
        hp: 47569,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 30,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1578,
        def: 1174,
        hp: 70508,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 60,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 2097,
        def: 1462,
        hp: 125502,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 90,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 2798,
        def: 1822,
        hp: 194679,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 3729,
        def: 2272,
        hp: 298381,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
    ],
  },
  {
    id: 2,
    name: "우마왕",
    image: "/레이드/선택/우마왕.png",
    bg: "/레이드/배경/우마왕.png",
    rewardsByStage: [
      "EXP: 600, 골드: 1000, 4성 우마왕 장비",
      "EXP: 700, 골드: 1100, 4성 우마왕 장비",
      "EXP: 800, 골드: 1200, 4~5성 우마왕 장비",
      "EXP: 900, 골드: 1300, 4~5성 우마왕 장비",
      "EXP: 1000, 골드: 1400, 4~5성 우마왕 장비",
      "EXP: 1100, 골드: 1600, 5성 우마왕 장비",
      "EXP: 1200, 골드: 1800, 5~6성 우마왕 장비",
      "EXP: 1300, 골드: 2000, 5~6성 우마왕 장비",
      "EXP: 1400, 골드: 2200, 5~6성 우마왕 장비",
      "EXP: 1500, 골드: 2400, 6성 우마왕 장비",
    ],
    bossStatsByStage: [
      {
        atk: 366,
        def: 0,
        hp: 14276,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 403,
        def: 0,
        hp: 26712,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 449,
        def: 0,
        hp: 42486,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 657,
        def: 0,
        hp: 69037,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 906,
        def: 0,
        hp: 111940,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 15,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1206,
        def: 0,
        hp: 170011,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 30,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1606,
        def: 0,
        hp: 253638,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 60,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 2090,
        def: 0,
        hp: 457526,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 90,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 2723,
        def: 0,
        hp: 700618,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 3538,
        def: 0,
        hp: 1087311,
        spd: 200,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
    ],
  },
  {
    id: 3,
    name: "강철의 포식자",
    image: "/레이드/선택/강철의포식자.png",
    bg: "/레이드/배경/강철의포식자.png",
    rewardsByStage: [
      "EXP: 600, 골드: 1000, 4성 히드라 장비",
      "EXP: 700, 골드: 1100, 4성 히드라 장비",
      "EXP: 800, 골드: 1200, 4~5성 히드라 장비",
      "EXP: 900, 골드: 1300, 4~5성 히드라 장비",
      "EXP: 1000, 골드: 1400, 4~5성 히드라 장비",
      "EXP: 1100, 골드: 1600, 5성 히드라 장비",
      "EXP: 1200, 골드: 1800, 5~6성 히드라 장비",
      "EXP: 1300, 골드: 2000, 5~6성 히드라 장비",
      "EXP: 1400, 골드: 2200, 5~6성 히드라 장비",
      "EXP: 1500, 골드: 2400, 6성 히드라 장비",
    ],
    bossStatsByStage: [
      {
        atk: 322,
        def: 486,
        hp: 4881,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 348,
        def: 606,
        hp: 8327,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 374,
        def: 846,
        hp: 11919,
        spd: 60,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 548,
        def: 1086,
        hp: 17888,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 0,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 755,
        def: 1326,
        hp: 25586,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 15,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1040,
        def: 1566,
        hp: 35207,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 30,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1435,
        def: 1956,
        hp: 52260,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 60,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 1906,
        def: 2421,
        hp: 77270,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 90,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 2544,
        def: 2736,
        hp: 114090,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
      {
        atk: 3390,
        def: 3126,
        hp: 168899,
        spd: 30,
        critRate: 0,
        critDmg: 0,
        acc: 100,
        weakHit: 0,
        block: 0,
        dmgReduction: 0,
        res: 0,
      },
    ],
  },
];

export default function Raid() {
  const [selectedId, setSelectedId] = useState(raidData[0].id);
  const [selectedStage, setSelectedStage] = useState(1);

  const selectedRaid = raidData.find((r) => r.id === selectedId);
  const boss = selectedRaid.bossStatsByStage?.[selectedStage - 1];

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
        </div>
      </div>
    </div>
  );
}
