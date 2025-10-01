
export type Priority = "low" | "medium" | "high";
export type Reminder = "none" | "on-due-date";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 string
  priority: Priority;
  reminder: Reminder;
  reminderSent: boolean;
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
