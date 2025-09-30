
"use client";

import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Trash2, Frown, Meh } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


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
    high: "border-red-500/60 bg-red-500/10 text-red-600 dark:text-red-400",
    medium: "border-yellow-500/60 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    low: "border-sky-500/60 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };
  
  const dueDate = new Date(task.dueDate);
  const isTaskOverdue = !task.completed && dueDate < new Date(new Date().setHours(0,0,0,0));
  const isDueToday = !task.completed && isToday(dueDate);

  return (
    <div
      className={cn(
        "rounded-lg border bg-card/80 dark:bg-card p-2.5 transition-all animate-in fade-in-0 duration-300",
        task.completed ? "bg-muted/60" : "hover:bg-card"
      )}
    >
      <Collapsible>
        <div className="flex items-start gap-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-0.5"
            aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-grow grid gap-1">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "font-medium text-xs leading-none cursor-pointer",
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
              <div className="flex items-center gap-1">
                {(isTaskOverdue || isDueToday) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {isTaskOverdue && <Frown className="h-3.5 w-3.5 text-destructive" />}
                        {isDueToday && <Meh className="h-3.5 w-3.5 text-yellow-600" />}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{isTaskOverdue ? "This task is overdue!" : "This task is due today."}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <span className={cn(
                  "text-xs text-muted-foreground",
                  isTaskOverdue && "text-destructive font-semibold"
                )}>
                  {format(dueDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 -mt-1 -mr-1">
            {task.description && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Toggle task description">
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            )}
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base font-bold font-headline">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
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
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t pl-7">
              {task.description}
            </p>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
