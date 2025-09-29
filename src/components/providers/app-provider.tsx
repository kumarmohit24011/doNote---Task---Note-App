"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Task, Note } from "@/lib/types";

const sampleTasks: Task[] = [
  { id: '1', title: 'Finalize project proposal', description: 'Draft and finalize the proposal for the Q3 project.', dueDate: '2024-08-15', priority: 'high', completed: false },
  { id: '2', title: 'Schedule team meeting', description: 'Organize a meeting to discuss project milestones.', dueDate: '2024-08-10', priority: 'medium', completed: false },
  { id: '3', title: 'Buy groceries', description: 'Milk, bread, eggs, and cheese.', dueDate: '2024-08-08', priority: 'low', completed: true },
];

const sampleNotes: Note[] = [
    { id: '1', title: 'Meeting Notes 2024-08-05', content: 'Discussed Q3 roadmap. Key takeaways: focus on user retention.', createdAt: new Date().toISOString() },
    { id: '2', title: 'Brainstorming ideas', content: 'New feature ideas: AI-powered scheduling, dark mode improvements.', createdAt: new Date().toISOString() },
];

interface AppStore {
  tasks: Task[];
  notes: Note[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompletion: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("focusflow-tasks");
      const storedNotes = localStorage.getItem("focusflow-notes");
      
      setTasks(storedTasks ? JSON.parse(storedTasks) : sampleTasks);
      setNotes(storedNotes ? JSON.parse(storedNotes) : sampleNotes);

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setTasks(sampleTasks);
      setNotes(sampleNotes);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("focusflow-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("focusflow-notes", JSON.stringify(notes));
    }
  }, [notes, isInitialized]);


  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };
  
  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  if (!isInitialized) {
      return null;
  }

  return (
    <AppContext.Provider value={{ tasks, notes, addTask, updateTask, toggleTaskCompletion, addNote, updateNote, deleteNote }}>
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
