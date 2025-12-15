import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Todo } from "@/types";

const COLLECTION_NAME = "todos";

export const getTodos = async (completed: boolean = false): Promise<Todo[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("isCompleted", "==", completed)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Todo));
};

export const addTodo = async (todo: Omit<Todo, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), todo);
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const ref = doc(db, COLLECTION_NAME, id);
  return await updateDoc(ref, data);
};

export const deleteTodo = async (id: string) => {
  const ref = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(ref);
};

export const completeTodo = async (id: string, comment: string) => {
  const ref = doc(db, COLLECTION_NAME, id);
  return await updateDoc(ref, {
    isCompleted: true,
    completedAt: Date.now(),
    closingComment: comment,
  });
};
