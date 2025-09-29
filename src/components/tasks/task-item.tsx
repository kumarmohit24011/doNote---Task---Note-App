"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, GripVertical } from "lucide-react";

export function TaskItem({
  task,
  onToggleCompletion,
}: {
  task: Task;
  onToggleCompletion: (id: string) => void;
}) {
  const priorityStyles = {
    high: "border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };
  
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-all animate-in fade-in-0 duration-300",
        task.completed ? "bg-muted/50" : "hover:bg-muted/50"
      )}
    >
      <Collapsible>
        <div className="flex items-start gap-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-1"
            aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-grow grid gap-1.5">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium leading-none cursor-pointer",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn("capitalize text-xs", priorityStyles[task.priority])}
              >
                {task.priority}
              </Badge>
              <span className={cn(
                "text-sm text-muted-foreground",
                isOverdue && "text-destructive font-semibold"
              )}>
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          {task.description && (
            <CollapsibleTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-muted -mr-2" aria-label="Toggle task description">
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
          )}
        </div>
        {task.description && (
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-sm text-muted-foreground mt-3 pl-8 pt-3 border-t">
              {task.description}
            </p>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
