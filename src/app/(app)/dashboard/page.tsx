
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, StickyNote, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function RecentTaskItem({ task }: { task: Task }) {
  const priorityStyles = {
    high: "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/60 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-400",
  };
  return (
    <div className="flex items-center gap-4 hover:bg-secondary p-3 rounded-lg transition-colors">
      <div className="grid gap-1 flex-1">
        <p className="text-md font-medium leading-none">{task.title}</p>
        <p className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-medium">
        <Badge variant="outline" className={cn("capitalize text-sm font-normal", priorityStyles[task.priority])}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, notes } = useAppStore();

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const recentNotes = notes.slice(0, 4);
  
  const openTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Open Tasks</CardTitle>
            <ListTodo className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{openTasks.length}</div>
            <p className="text-md text-muted-foreground">tasks to be completed</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Total Notes</CardTitle>
            <StickyNote className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{notes.length}</div>
            <p className="text-md text-muted-foreground">notes created</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <RecentTaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-md text-center text-muted-foreground py-6">No upcoming tasks. <Link href="/tasks" className="text-primary hover:underline">Add one!</Link></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Recent Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="grid gap-1.5 p-3 rounded-lg hover:bg-secondary transition-colors">
                  <p className="text-md font-semibold">{note.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-md text-center text-muted-foreground py-6">No recent notes. <Link href="/notes" className="text-primary hover:underline">Create one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
