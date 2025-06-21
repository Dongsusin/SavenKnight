import { useNavigate } from "react-router-dom";
import heroes from "../data/heroes.json";
import "./HeroSlide.css";

export default function HeroSlide() {
  const navigate = useNavigate();

  return (
    <div className="hero-slide-container">
      {heroes.map((hero) => (
        <div
          key={hero.id}
          className="hero-slide-card"
          onClick={() => navigate(`/hero/${hero.name}`)}
        >
          <img
            src={`/도감/${hero.group}/아이콘/${hero.name}.png`}
            alt={hero.name}
            className="hero-slide-img"
          />
        </div>
      ))}
    </div>
  );
}
