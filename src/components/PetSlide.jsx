import { useNavigate } from "react-router-dom";
import pets from "../data/pets.json";

export default function PetSlide({ likes, handleLike, user }) {
  const navigate = useNavigate();

  return (
    <div className="hero-slide-container">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="hero-slide-card"
          onClick={() => navigate("/dex", { state: { group: "펫" } })}
        >
          <button
            className={`like-button ${
              user && likes[pet.id]?.users?.includes(user.uid) ? "liked" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!user) return alert("로그인이 필요합니다.");
              handleLike(pet.id);
            }}
          >
            추천 {likes[pet.id]?.count || 0}
          </button>
          <img
            src={`/도감/펫/아이콘/${pet.name}.png`}
            alt={pet.name}
            className="hero-slide-img"
          />
        </div>
      ))}
    </div>
  );
}
