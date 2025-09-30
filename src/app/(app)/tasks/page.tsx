
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskList } from "@/components/tasks/task-list";
import { AddTaskForm } from "@/components/tasks/add-task-form";

export default function TasksPage() {
  const { tasks } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-headline">My Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-headline">Add a new task</DialogTitle>
            </DialogHeader>
            <AddTaskForm onFinished={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TaskList tasks={tasks} />
    </div>
  );
}
