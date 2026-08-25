import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type NextOrObserver,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export function subscribeToAuthChanges(
  observer: NextOrObserver<User>,
): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), observer);
}

export async function getAuthToken(forceRefresh = false): Promise<string | null> {
  const user = getFirebaseAuth().currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}
