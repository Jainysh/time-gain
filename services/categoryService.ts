import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Category } from "@/types";

const COLLECTION_NAME = "categories";

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Category)
  );
};

export const addCategory = async (category: Omit<Category, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), category);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  const ref = doc(db, COLLECTION_NAME, id);
  return await updateDoc(ref, data);
};

// Seed initial data if empty
export const seedCategories = async () => {
  const current = await getCategories();
  if (current.length === 0) {
    await addCategory({ name: "Work", color: "#5C8BC3" }); // Blueish
    await addCategory({ name: "Personal Growth", color: "#68B684" }); // Greenish
    await addCategory({ name: "Home", color: "#D97757" }); // Reddish
  }
};
