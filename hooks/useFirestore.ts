"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";

const NO_CONSTRAINTS: QueryConstraint[] = [];

export function useCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = NO_CONSTRAINTS
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    try {
      const colRef = collection(getFirebaseFirestore(), collectionName);
      const q = query(colRef, ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: T[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as T[];
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn(`Firestore collection [${collectionName}] read warning:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to subscribe to collection";
      setError(message);
      setLoading(false);
      return () => {};
    }
  }, [collectionName, constraints]);

  useEffect(() => {
    const unsub = fetchData();
    return () => unsub();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDoc<T = DocumentData>(collectionName: string, docId?: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(getFirebaseFirestore(), collectionName, docId);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch document";
      setError(message);
      setLoading(false);
    }
  }, [collectionName, docId]);

  return { data, loading, error };
}
