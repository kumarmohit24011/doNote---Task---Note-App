
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
  runTransaction,
} from "firebase/database";
import type { Task, Note, UserData, Reminder } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { app } from "@/lib/firebase";
import { isSameDay, startOfYesterday, subMinutes, subHours, subDays, parseISO } from 'date-fns';

interface AppStore {
  tasks: Task[];
  notes: Note[];
  streak: number;
  showConfetti: boolean;
  completionMessage: string;
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt" | "completedAt" | "reminderSent">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setShowConfetti: (show: boolean) => void;
  setCompletionMessage: (message: string) => void;
}

const AppContext = createContext<AppStore | null>(null);

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [streak, setStreak] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const db = getDatabase(app);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (user) {
      const userDataRef = ref(db, `users/${user.uid}/userData`);
      const unsubscribeUserData = onValue(userDataRef, (snapshot) => {
        const userData: UserData = snapshot.val();
        if (userData) {
          // Check if the streak should be reset
          const today = new Date();
          const lastCompleted = userData.lastCompletedDate ? new Date(userData.lastCompletedDate) : null;
          if (lastCompleted && !isSameDay(today, lastCompleted) && lastCompleted < startOfYesterday()) {
            // It's been more than a day, reset streak
            update(userDataRef, { streak: 0 });
            setStreak(0);
          } else {
            setStreak(userData.streak || 0);
          }
        }
      });
      
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
        unsubscribeUserData();
      };
    } else {
      setTasks([]);
      setNotes([]);
      setStreak(0);
      setIsInitialized(false);
    }
  }, [user, db]);

  // Reminder checking logic
  useEffect(() => {
    const checkReminders = () => {
        if (!user || 'Notification' !in window || Notification.permission !== 'granted') {
            return;
        }

        const now = new Date();
        tasks.forEach(task => {
            if (task.completed || task.reminder === 'none' || task.reminderSent) {
                return;
            }

            const dueDate = parseISO(task.dueDate);
            let reminderTime: Date | null = null;
            
            switch (task.reminder) {
                case '5-minutes-before':
                    reminderTime = subMinutes(dueDate, 5);
                    break;
                case '1-hour-before':
                    reminderTime = subHours(dueDate, 1);
                    break;
                case '1-day-before':
                    reminderTime = subDays(dueDate, 1);
                    break;
                default:
                    break;
            }

            if (reminderTime && now >= reminderTime) {
                new Notification('Task Reminder', {
                    body: `Your task "${task.title}" is due soon.`,
                    icon: '/icon-192x192.png',
                });
                updateTask(task.id, { reminderSent: true });
            }
        });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [tasks, user]);


  const addTask = async (task: Omit<Task, "id" | "completed" | "createdAt" | "completedAt" | "reminderSent">) => {
    if (!user) return;
    const tasksRef = ref(db, `users/${user.uid}/tasks`);
    await push(tasksRef, {
      ...task,
      completed: false,
      reminderSent: false,
      createdAt: serverTimestamp(),
      completedAt: null,
    });
    setCompletionMessage("Task Added!");
    setShowConfetti(true);
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
      const updates: Partial<Task> = { 
        completed: newCompletedState,
        completedAt: newCompletedState ? serverTimestamp() : null,
      };
      await update(taskRef, updates);

      if (newCompletedState) {
        setShowConfetti(true);
        setCompletionMessage("Great Job!");

        // Update streak
        const userDataRef = ref(db, `users/${user.uid}/userData`);
        runTransaction(userDataRef, (currentData: UserData | null) => {
          if (currentData) {
            const today = new Date();
            const lastCompleted = currentData.lastCompletedDate ? new Date(currentData.lastCompletedDate) : null;
            if (!lastCompleted || !isSameDay(today, lastCompleted)) {
                // If last completion was yesterday, increment streak, otherwise start from 1
                const newStreak = (lastCompleted && isSameDay(lastCompleted, startOfYesterday())) ? (currentData.streak || 0) + 1 : 1;
                currentData.streak = newStreak;
                currentData.lastCompletedDate = today.toISOString();
            }
          } else {
            // No previous data, start a new streak
            return { streak: 1, lastCompletedDate: new Date().toISOString() };
          }
          return currentData;
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
        streak,
        showConfetti,
        completionMessage,
        setShowConfetti,
        setCompletionMessage,
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
