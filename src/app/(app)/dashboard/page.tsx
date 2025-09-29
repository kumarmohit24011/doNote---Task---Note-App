
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, StickyNote } from "lucide-react";
import Link from "next/link";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function TaskItem({ task }: { task: Task }) {
  const priorityStyles = {
    high: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    medium: "bg-accent text-accent-foreground hover:bg-accent/90",
    low: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  return (
    <div className="flex items-center gap-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{task.title}</p>
        <p className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-medium">
        <Badge className={cn("capitalize", priorityStyles[task.priority])}>
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

  const recentNotes = notes
    .slice(0, 3);
  
  const openTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks waiting to be completed</p>
          </CardContent>
        </Card>
        <Card>
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
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming tasks. <Link href="/tasks" className="text-primary underline">Add one!</Link></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="grid gap-1">
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent notes. <Link href="/notes" className="text-primary underline">Create one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
