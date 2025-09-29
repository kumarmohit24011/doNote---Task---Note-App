"use server";

import { suggestTaskGrouping } from "@/ai/flows/suggest-task-grouping";
import type { Task } from "./types";
import { z } from "zod";

const SuggestionInputSchema = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
});

export async function getTaskSuggestion(tasks: Task[]) {
  const relevantTasks = tasks.map(({ title, description, dueDate, priority }) => ({ title, description, dueDate, priority }));

  try {
    const validatedInput = SuggestionInputSchema.parse({ tasks: relevantTasks });
    const result = await suggestTaskGrouping(validatedInput);
    return { success: true, suggestion: result.suggestion };
  } catch (error) {
    console.error("Error getting task suggestion:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid task data provided." };
    }
    return { success: false, error: "Failed to get suggestion from AI." };
  }
}
