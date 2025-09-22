// services/userSettingsService.ts
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";

export interface UserSettings {
  allowNotifications: boolean;
  darkMode?: boolean;
}

const SETTINGS_COLLECTION = "userSettings";

const defaultSettings: UserSettings = {
  allowNotifications: false,
  darkMode: false,
};

export const userSettingsService = {
  async get(): Promise<UserSettings | null> {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return null;

    const docRef = doc(FIREBASE_DB, SETTINGS_COLLECTION, user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }

    return { ...defaultSettings, ...snap.data() } as UserSettings;
  },

  async set(settings: UserSettings): Promise<void> {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error("User not signed in");

    const docRef = doc(FIREBASE_DB, SETTINGS_COLLECTION, user.uid);
    await setDoc(docRef, { ...defaultSettings, ...settings }, { merge: true });
  },

  async update(partial: Partial<UserSettings>): Promise<void> {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error("User not signed in");

    const docRef = doc(FIREBASE_DB, SETTINGS_COLLECTION, user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, { ...defaultSettings, ...partial });
    } else {
      await updateDoc(docRef, partial);
    }
  },

  /**
   * Subscribe to realtime updates for the user's settings.
   * Returns an unsubscribe function.
   */
  subscribe(callback: (settings: UserSettings | null) => void): Unsubscribe {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) throw new Error("User not signed in");

    const docRef = doc(FIREBASE_DB, SETTINGS_COLLECTION, user.uid);
    return onSnapshot(docRef, (snap) => {
      if (!snap.exists()) {
        setDoc(docRef, defaultSettings);
        callback(defaultSettings);
      } else {
        callback({ ...defaultSettings, ...snap.data() } as UserSettings);
      }
    });
  },
};
