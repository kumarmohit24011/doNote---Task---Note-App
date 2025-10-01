
export type Priority = "low" | "medium" | "high";
export type Reminder = "none" | "5-minutes-before" | "1-hour-before" | "1-day-before";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
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
