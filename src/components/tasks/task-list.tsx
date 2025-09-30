
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useState, useEffect } from "react";

const getQuotes = (count: number) => {
    if (count === 0) return [];
    const quotes = [
        { pre: "You have ", count, post: ` pending task${count > 1 ? 's' : ''}. Time to get to work!` },
        { pre: "Don't give up, only ", count, post: ` task${count > 1 ? 's' : ''} left. You've got this!` },
        { pre: "Just ", count, post: ` task${count > 1 ? 's' : ''} remaining. Do it now!` },
        { pre: "Keep going! You're almost there, only ", count, post: ` task${count > 1 ? 's' : ''} to go.` },
        { pre: "Tackle these ", count, post: ` task${count > 1 ? 's' : ''} and enjoy your day!` },
        { pre: "What are you waiting for? ", count, post: ` task${count > 1 ? 's' : ''} await!` }
    ];
    return quotes;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { toggleTaskCompletion, deleteTask } = useAppStore();
  const [randomQuote, setRandomQuote] = useState<{pre: string, count: number, post: string} | null>(null);
  
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  useEffect(() => {
    const quotes = getQuotes(incompleteTasks.length);
    if (quotes.length > 0) {
        setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    } else {
        setRandomQuote(null);
    }
  }, [incompleteTasks.length]);

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
        {incompleteTasks.length > 0 && randomQuote && (
             <div className="flex items-center gap-3 text-base text-primary font-semibold bg-primary/10 p-3.5 rounded-lg mb-4 border border-primary/20">
                <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                    "{randomQuote.pre}<span className="text-destructive font-bold">{randomQuote.count}</span>{randomQuote.post}"
                </p>
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
