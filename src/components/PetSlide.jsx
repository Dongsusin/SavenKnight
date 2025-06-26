import { useNavigate } from "react-router-dom";
import pets from "../data/pets.json";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export default function PetSlide() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const unsubscribes = pets.map((pet) => {
      const ref = doc(db, "petLikes", pet.id.toString());
      return onSnapshot(ref, (snap) => {
        setLikes((prev) => ({
          ...prev,
          [pet.id]: snap.exists() ? snap.data() : { count: 0, users: [] },
        }));
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const handlePetLike = async (petId) => {
    if (!user) return alert("로그인이 필요합니다.");

    const ref = doc(db, "petLikes", petId.toString());
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
    <div className="hero-slide-container">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="hero-slide-card"
          onClick={() => navigate("/dex", { state: { group: "펫" } })}
        >
          <img
            src={`/도감/펫/아이콘/${pet.name}.png`}
            alt={pet.name}
            className="hero-slide-img"
          />
          <button
            className={`like-button small ${
              user && likes[pet.id]?.users?.includes(user.uid) ? "liked" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation(); // 클릭이 카드 내비게이션으로 퍼지지 않도록 막음
              handlePetLike(pet.id);
            }}
          >
            추천 {likes[pet.id]?.count || 0}
          </button>
        </div>
      ))}
    </div>
  );
}
