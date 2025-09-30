
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

const quotes = [
    "The secret of getting ahead is getting started.",
    "A goal without a plan is just a wish.",
    "The journey of a thousand miles begins with a single step.",
    "Well begun is half done.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Action is the foundational key to all success."
];

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { toggleTaskCompletion, deleteTask } = useAppStore();
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  const NoTasks = ({ title, description }: { title: string, description: string }) => (
    <div className="text-center py-10">
        <h3 className="font-semibold text-xl font-headline">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  )

  return (
    <Tabs defaultValue="incomplete">
      <TabsList className="grid w-full grid-cols-2 mb-4 h-10 text-sm">
        <TabsTrigger value="incomplete">
          Incomplete
          <Badge variant="secondary" className="ml-2 text-xs">{incompleteTasks.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <Badge variant="secondary" className="ml-2 text-xs">{completedTasks.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="incomplete">
        {incompleteTasks.length > 0 && (
             <div className="flex items-start gap-3 text-xs text-muted-foreground bg-card/80 p-3 rounded-lg mb-4 border">
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                <p className="font-medium">"{randomQuote}"</p>
            </div>
        )}
        <Card>
          <CardContent className="p-2 md:p-3">
            <div className="space-y-3">
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
          <CardContent className="p-2 md:p-3">
            <div className="space-y-3">
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
