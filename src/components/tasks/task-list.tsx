"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { toggleTaskCompletion } = useAppStore();
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <Tabs defaultValue="incomplete">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="incomplete">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={toggleTaskCompletion}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground pt-4">
                  All tasks completed! Great job!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="completed">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={toggleTaskCompletion}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground pt-4">
                  No completed tasks yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
