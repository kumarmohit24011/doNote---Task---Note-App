
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { toggleTaskCompletion, deleteTask } = useAppStore();
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  const NoTasks = ({ title, description }: { title: string, description: string }) => (
    <div className="text-center py-16">
        <h3 className="font-semibold text-2xl font-headline">{title}</h3>
        <p className="text-muted-foreground mt-3 text-lg">{description}</p>
    </div>
  )

  return (
    <Tabs defaultValue="incomplete">
      <TabsList className="grid w-full grid-cols-2 mb-6 h-12 text-lg">
        <TabsTrigger value="incomplete">
          Incomplete
          <Badge variant="secondary" className="ml-3 text-base">{incompleteTasks.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <Badge variant="secondary" className="ml-3 text-base">{completedTasks.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="incomplete">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-4">
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <NoTasks title="All tasks completed!" description="Great job staying on top of your work." />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="completed">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="space-y-4">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleCompletion={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <NoTasks title="No completed tasks" description="Completed tasks will appear here." />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
