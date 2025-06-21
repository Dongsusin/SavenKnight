import { useNavigate } from "react-router-dom";
import pets from "../data/pets.json";

export default function PetSlide() {
  const navigate = useNavigate();

  return (
    <div className="hero-slide-container">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="hero-slide-card"
          onClick={() => navigate(`/dex`)}
        >
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
