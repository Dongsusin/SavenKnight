const admin = require("firebase-admin");
const heroes = require("./src/data/heroes.json");
const pets = require("./src/data/pets.json");

const serviceAccount = require("./src/data/sevenknight-1e2cd-firebase-adminsdk-fbsvc-5f8bea56f2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function initLikes() {
  const likesRef = db.collection("likes");

  for (const hero of heroes) {
    if (!hero.id || hero.category === "특수영웅") continue;

    await likesRef.doc(hero.id.toString()).set({
      count: 0,
      users: [],
    });
  }
  console.log("✅ likes 초기화 완료");
}

async function initPetLikes() {
  const petLikesRef = db.collection("petLikes");

  for (const pet of pets) {
    if (!pet.id) continue;

    await petLikesRef.doc(pet.id.toString()).set({
      count: 0,
      users: [],
    });
  }
  console.log("✅ petLikes 초기화 완료");
}

async function main() {
  try {
    await initLikes();
    await initPetLikes();
    console.log("🎉 전체 초기화 완료");
    process.exit(0);
  } catch (err) {
    console.error("❌ 오류 발생:", err);
    process.exit(1);
  }
}

main();
