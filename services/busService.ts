// services/busService.ts
import { FIREBASE_DB } from "@/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  estimatedDuration: number;
  fare: number;
  createdAt: Date;
  updatedAt: Date;
}

const ROUTES_COLLECTION = "busRoutes";

export const busRouteService = {
  // Fetch all routes once
  async getAll(): Promise<BusRoute[]> {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(FIREBASE_DB, ROUTES_COLLECTION)
    );
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as DocumentData),
    })) as BusRoute[];
  },

  // Fetch one route by ID
  async getById(id: string): Promise<BusRoute | null> {
    const docRef = doc(FIREBASE_DB, ROUTES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as DocumentData) } as BusRoute;
  },

  // Create a new route
  async create(
    route: Omit<BusRoute, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(FIREBASE_DB, ROUTES_COLLECTION), {
      ...route,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // Update route
  async update(id: string, updateData: Partial<BusRoute>): Promise<BusRoute | null> {
    const docRef = doc(FIREBASE_DB, ROUTES_COLLECTION, id);

    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) return null;

    return {
      id: updatedSnap.id,
      ...(updatedSnap.data() as DocumentData),
    } as BusRoute;
  },

  // Delete route
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(FIREBASE_DB, ROUTES_COLLECTION, id));
  },

  // Real-time subscription
  subscribe(callback: (routes: BusRoute[]) => void): Unsubscribe {
    const q = collection(FIREBASE_DB, ROUTES_COLLECTION);
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as DocumentData),
      })) as BusRoute[];
      callback(data);
    });
  },
};
