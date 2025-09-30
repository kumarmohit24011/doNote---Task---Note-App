
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: number; // RTDB timestamp
  completedAt?: number | null; // RTDB timestamp
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number; // RTDB timestamp
}

export interface UserData {
  streak: number;
  lastCompletedDate: string; // ISO String
}
