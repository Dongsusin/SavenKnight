import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">

      <div className="home-content">
        {/* 왼쪽 섹션 */}
        <div className="home-section left-section">
          <h3>업데이트</h3>
          <ul className="update-list">
            <li><a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6184591" target="_blank">[2025-06-12] 업데이트 내역</a></li>
            <li><a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6103024" target="_blank">[2025-05-29] 업데이트 내역</a></li>
            <li><a href="https://game.naver.com/lounge/sena_rebirth/board/detail/6056683" target="_blank">[2025-05-21] 업데이트 내역</a></li>
          </ul>
        </div>

        {/* 중앙 섹션*/}

        {/* 오른쪽 섹션 */}
        <div className="home-section right-section">
          <h3>공지사항</h3>
          <p>현재 공지사항이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
