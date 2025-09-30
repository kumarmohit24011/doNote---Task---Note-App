
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
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function TaskItem({
  task,
  onToggleCompletion,
  onDelete,
}: {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const priorityStyles = {
    high: "border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-green-500/80 bg-green-500/10 text-green-700 dark:text-green-400",
  };
  
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      className={cn(
        "rounded-lg border bg-card/80 dark:bg-card p-3 transition-all animate-in fade-in-0 duration-300",
        task.completed ? "bg-muted/60" : "hover:bg-card"
      )}
    >
      <Collapsible>
        <div className="flex items-start gap-3.5">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-0.5 h-4 w-4"
            aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-grow grid gap-1.5">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium text-sm leading-none cursor-pointer",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn("capitalize text-xs font-normal", priorityStyles[task.priority])}
              >
                {task.priority}
              </Badge>
              <span className={cn(
                "text-xs text-muted-foreground",
                isOverdue && "text-destructive font-semibold"
              )}>
                {format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 -mt-1 -mr-1">
            {task.description && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Toggle task description">
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            )}
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold font-headline">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    This will permanently delete the task: "{task.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(task.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {task.description && (
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t pl-8">
              {task.description}
            </p>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
