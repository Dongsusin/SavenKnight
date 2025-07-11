import React, { useState } from "react";
import "./CouponBoxGrid.css";

export default function CouponBoxGrid() {
  // 번호별 코드
  const couponMap = {
    1: "RINKARMA",
    2: "SECRETCODE",
    5: "LOVESENA",
    6: "SENAREGOGO",
    8: "GOODLUCK",
    10: "7777777",
    12: "SURPRISE",
    13: "THEMONTHOFSENA",
    15: "7SENASENA7",
    16: "INTOTHESENA",
    18: "REBIRTHBACK",
    19: "WELCOMEBACK",
    24: "GUILDWAR",
    25: "HEROSOMMON",
    27: "INFOCODEX",
    33: "BONVOYAGE",
    35: "INFINITETOWER",
    36: "STORYEVENT",
    37: "EVANKARIN",
    38: "SENARAID",
    39: "WELCOMESENA",
    41: "MOREKEYS",
    42: "SHOWMETHEMONEY",
    44: "MAILBOX",
    46: "RELEASEPET",
    48: "NOHOSCHRONICLE",
    49: "UPDATES",
    50: "THANKYOU",
    51: "SENAHAJASENA",
    55: "FORTAGNIA",
    56: "YUISSONG",
    57: "YONGSANIM",
    59: "ADVENTURER",
    62: "LEGENDSRAID",
    67: "TREASURE",
    68: "THEHOLYCROSS",
    69: "VALKYRIE",
    70: "LOVELYRUBY",
    72: "SENAEVENTS",
    73: "CMMAY",
    74: "PDKIMJUNGKI",
    75: "FUSEGETSPECIAL",
    76: "DARKKNIGHTS",
  };

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleCopy = () => {
    if (selectedCoupon && selectedCoupon.code !== "없음") {
      navigator.clipboard.writeText(selectedCoupon.code);
      alert("쿠폰 코드가 복사되었습니다!");
    }
  };

  // 1~77까지 생성
  const boxes = Array.from({ length: 77 }, (_, i) => {
    const number = i + 1;
    const code = couponMap[number] || "없음";
    return { number, code };
  });

  return (
    <div>
      <div className="coupon-grid">
        {boxes.map((box) => (
          <div
            key={box.number}
            className="coupon-box"
            onClick={() => setSelectedCoupon(box)}
          >
            <img src="/쿠폰상자.png" alt="box" className="box-image" />
            <span className="box-number">{box.number}</span>
          </div>
        ))}
      </div>

      {/* 팝업 모달 */}
      {selectedCoupon && (
        <div className="coupon-modal">
          <div className="coupon-modal-content">
            <h3>쿠폰 정보</h3>
            <p>코드: {selectedCoupon.code}</p>
            <div className="button">
              {selectedCoupon.code !== "없음" ? (
                <button onClick={handleCopy}>코드 복사</button>
              ) : (
                <p style={{ color: "gray" }}>사용할 수 있는 코드가 없습니다.</p>
              )}
              <button onClick={() => setSelectedCoupon(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
