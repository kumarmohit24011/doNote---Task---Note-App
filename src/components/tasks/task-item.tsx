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
import { ChevronDown } from "lucide-react";

export function TaskItem({
  task,
  onToggleCompletion,
}: {
  task: Task;
  onToggleCompletion: (id: string) => void;
}) {
  const priorityStyles = {
    high: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    medium: "bg-accent text-accent-foreground hover:bg-accent/90",
    low: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      className="rounded-lg border bg-card p-4 transition-all hover:shadow-md animate-in fade-in-0 duration-300"
    >
      <Collapsible>
        <div className="flex items-start gap-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-1"
            aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-grow grid gap-1">
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
                className={cn("capitalize", priorityStyles[task.priority])}
              >
                {task.priority}
              </Badge>
              <span className={cn(
                "text-sm text-muted-foreground",
                isOverdue && "text-destructive font-medium"
              )}>
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          {task.description && (
            <CollapsibleTrigger asChild>
              <button className="p-1 rounded-full hover:bg-muted -mr-2" aria-label="Toggle task description">
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </button>
            </CollapsibleTrigger>
          )}
        </div>
        {task.description && (
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-sm text-muted-foreground mt-2 pl-10 pt-2 border-t mt-4">
              {task.description}
            </p>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
