
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, StickyNote, Quote } from "lucide-react";
import Link from "next/link";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" }
];

function RecentTaskItem({ task }: { task: Task }) {
  const priorityStyles = {
    high: "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/60 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-400",
  };
  return (
    <div className="flex items-center gap-4 hover:bg-secondary p-2.5 rounded-lg transition-colors">
      <div className="grid gap-1 flex-1">
        <p className="text-sm font-medium leading-none">{task.title}</p>
        <p className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-medium">
        <Badge variant="outline" className={cn("capitalize text-xs font-normal", priorityStyles[task.priority])}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, notes } = useAppStore();
  const [randomQuote, setRandomQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const recentNotes = notes.slice(0, 4);
  
  const openTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Quote className="h-6 w-6 text-primary" />
            {randomQuote ? (
              <div>
                <blockquote className="text-sm font-semibold text-primary">
                  "{randomQuote.text}"
                </blockquote>
                <p className="text-xs text-primary/80 mt-1">- {randomQuote.author}</p>
              </div>
            ) : (
                <div className="h-8 w-full animate-pulse rounded-md bg-primary/20" />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks to be completed</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">notes created</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-lg font-bold font-headline">Upcoming Tasks</div>
          </CardHeader>
          <CardContent className="grid gap-1.5 pt-0">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <RecentTaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No upcoming tasks. <Link href="/tasks" className="text-primary hover:underline">Add one!</Link></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-lg font-bold font-headline">Recent Notes</div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="grid gap-1 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No recent notes. <Link href="/notes" className="text-primary hover:underline">Create one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
