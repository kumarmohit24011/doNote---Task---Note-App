
"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
  serverTimestamp,
  query,
  orderByChild,
} from "firebase/database";
import type { Task, Note } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { app } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { PartyPopper } from "lucide-react";

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
  const db = getDatabase(app);

  useEffect(() => {
    if (user) {
      const tasksRef = query(ref(db, `users/${user.uid}/tasks`), orderByChild('createdAt'));
      const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
        const tasksData: Task[] = [];
        snapshot.forEach((childSnapshot) => {
          tasksData.push({ id: childSnapshot.key!, ...childSnapshot.val() });
        });
        setTasks(tasksData.reverse());
      });

      const notesRef = query(ref(db, `users/${user.uid}/notes`), orderByChild('createdAt'));
      const unsubscribeNotes = onValue(notesRef, (snapshot) => {
        const notesData: Note[] = [];
        snapshot.forEach((childSnapshot) => {
          notesData.push({ id: childSnapshot.key!, ...childSnapshot.val() });
        });
        setNotes(notesData.reverse());
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
    const tasksRef = ref(db, `users/${user.uid}/tasks`);
    await push(tasksRef, {
      ...task,
      completed: false,
      createdAt: serverTimestamp(),
    });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;
    const taskRef = ref(db, `users/${user.uid}/tasks/${id}`);
    await update(taskRef, updates);
  };

  const toggleTaskCompletion = async (id: string) => {
    if (!user) return;
    const taskToToggle = tasks.find((t) => t.id === id);
    if (taskToToggle) {
      const newCompletedState = !taskToToggle.completed;
      const taskRef = ref(db, `users/${user.uid}/tasks/${id}`);
      await update(taskRef, { completed: newCompletedState });

      if (newCompletedState) {
        toast({
          title: "Great job!",
          description: (
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">You completed a task!</span>
            </div>
          )
        });
      }
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    const taskRef = ref(db, `users/${user.uid}/tasks/${id}`);
    await remove(taskRef);
  };

  const addNote = async (note: Omit<Note, "id" | "createdAt">) => {
    if (!user) return;
    const notesRef = ref(db, `users/${user.uid}/notes`);
    await push(notesRef, {
      ...note,
      createdAt: serverTimestamp(),
    });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return;
    const noteRef = ref(db, `users/${user.uid}/notes/${id}`);
    await update(noteRef, updates);
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    const noteRef = ref(db, `users/${user.uid}/notes/${id}`);
    await remove(noteRef);
  };

  if (user && !isInitialized) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        notes,
        addTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
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
