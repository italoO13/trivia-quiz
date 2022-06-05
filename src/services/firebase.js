// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCuDxUcoUdjy9dDGbaRJYmIQD27imyH1c',
  authDomain: 'kkkk-7c71b.firebaseapp.com',
  databaseURL: 'https://kkkk-7c71b.firebaseio.com',
  projectId: 'kkkk-7c71b',
  storageBucket: 'kkkk-7c71b.appspot.com',
  messagingSenderId: '331483482932',
  appId: '1:331483482932:web:ef75614e175571b46cf361',
  measurementId: 'G-LPDSNK6ZHH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// iniciando db
const db = getFirestore(app);

export const readDb = async () => {
  let dados = [];
  const snapshot = await getDocs(collection(db, 'ranking'));
  snapshot.forEach((doc) => {
    dados = [...dados, doc.data()];
  });
  return dados;
};

export const addDb = async (name, img, score) => {
  try {
    await addDoc(collection(db, 'ranking'), {
      name,
      img,
      score,
    });
  } catch (e) {
    console.error('Não foi possível adicionar ao banco de dados', e);
  }
};
