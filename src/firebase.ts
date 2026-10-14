import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getSHA256Hash } from "boring-webcrypto-sha256";

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

export async function createPlaylist(n: string, d: string, i: string, e: Date, p: string) {
  const docRef = await addDoc(collection(db, "playlists"), {
    name: n,
    description: d,
    icon: i,
    expiration: e,
    password: p
  })
  return docRef.id;
}

export async function fetchPlaylist(id: string) {
  const playlistRef = doc(db, "playlists", id);
  const playlistSnap = await getDoc(playlistRef);
  if (playlistSnap.exists()) {
    if (playlistSnap.data().expiration.toMillis() < new Date()) {
      await deleteDoc(playlistRef);
    } else {
      const reformat = JSON.stringify(playlistSnap.data());
      return JSON.parse(reformat);
    }
  }
  else {
    return null;
  }

}

export async function editPlaylist(id: string, n: string, d: string, i: string, c: Array<string>, p: string) {
  const data = await fetchPlaylist(id);
  console.log(data.password);
  console.log(getSHA256Hash(p));
  if (data.password == await getSHA256Hash(p)) {
    updateDoc(doc(db, "playlists", id), { name: n, description: d, icon: i, content: c })
    return true;
  }
  else {
    return false;
  }
}
