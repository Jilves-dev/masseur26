import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const unsub = onSnapshot(
  ref,
  (snap) => {
    setDocuments(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    setError(null);
  },
  (err) => {
    console.error('useCollection', collectionName, err);
    setError(err.message);
    setDocuments([]);   // ← ratkaisee !documents-jumin: lopettaa spinnerin
  }
);
    return () => unsub();
  }, [collectionName]);

  return { documents, error };
};
