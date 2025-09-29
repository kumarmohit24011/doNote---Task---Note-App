
"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore";
import type { Task, Note } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { app } from "@/lib/firebase";

interface AppStore {
  tasks: Task[];
  notes: Note[];
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const db = getFirestore(app);

  useEffect(() => {
    if (user) {
      const tasksQuery = query(
        collection(db, "users", user.uid, "tasks"),
        orderBy("createdAt", "desc")
      );
      const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
        const tasksData: Task[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            priority: data.priority,
            completed: data.completed,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          };
        });
        setTasks(tasksData);
      });

      const notesQuery = query(
        collection(db, "users", user.uid, "notes"),
        orderBy("createdAt", "desc")
      );
      const unsubscribeNotes = onSnapshot(notesQuery, (querySnapshot) => {
        const notesData: Note[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          };
        });
        setNotes(notesData);
      });
      
      setIsInitialized(true);

      return () => {
        unsubscribeTasks();
        unsubscribeNotes();
      };
    } else {
        setTasks([]);
        setNotes([]);
        setIsInitialized(false);
    }
  }, [user, db]);

  const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt">) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      ...task,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    const taskDoc = doc(db, "users", user.uid, "tasks", id);
    await updateDoc(taskDoc, updates);
  };
  
  const toggleTaskCompletion = async (id: string) => {
    if (!user) return;
    const taskToToggle = tasks.find(t => t.id === id);
    if (taskToToggle) {
        const taskDoc = doc(db, "users", user.uid, "tasks", id);
        await updateDoc(taskDoc, { completed: !taskToToggle.completed });
    }
  };

  const deleteTask = async (id: string) => {
    if(!user) return;
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  }

  const addNote = async (note: Omit<Note, "id" | "createdAt">) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "notes"), {
        ...note,
        createdAt: serverTimestamp(),
    });
  };
  
  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;
    const noteDoc = doc(db, "users", user.uid, "notes", id);
    await updateDoc(noteDoc, updates);
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "notes", id));
  };

  if (user && !isInitialized) {
      return null;
  }

  return (
    <AppContext.Provider value={{ tasks, notes, addTask, updateTask, toggleTaskCompletion, deleteTask, addNote, updateNote, deleteNote }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
