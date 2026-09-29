import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDllTGeXlDaOaGocEx1emgQSgfNvjMDHbA",
  authDomain: "sharelist-playlist-maker.firebaseapp.com",
  projectId: "sharelist-playlist-maker",
  storageBucket: "sharelist-playlist-maker.firebasestorage.app",
  messagingSenderId: "124995052237",
  appId: "1:124995052237:web:e0214c42d83c1e53b9bf84"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createPlaylist(n: string, d: string, i: string, c: Array<string>, e: Date, p: string) {
  const docRef = await addDoc(collection(db, "playlists"), {
    name: n,
    description: d,
    icon: i,
    content: c,
    expiration: e,
    password: p
  })
  return docRef.id;
}

export async function fetchPlaylist(id: string) {
  const playlistRef = doc(db, "playlists", id);
  const playlistSnap = await getDoc(playlistRef);

  if (playlistSnap.exists()) {
    return playlistSnap.data();
  } else {
    return null;
  }
}
