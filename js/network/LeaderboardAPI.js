import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { FIREBASE_CONFIG } from "../config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export async function submitScore(name, score, difficulty) {
  try {
    await addDoc(collection(db, "leaderboard"), {
      name,
      score,
      difficulty,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getTopScores(difficulty = "all", count = 10) {
  try {
    // let q;
    // if (difficulty === "all") {
    //   q = query(
    //     collection(db, "leaderboard"),
    //     orderBy("score", "desc"),
    //     limit(count),
    //   );
    // } else {
    const q = query(
      collection(db, "leaderboard"),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      limit(count),
    );
    // }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}
