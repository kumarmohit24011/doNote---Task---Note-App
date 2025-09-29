
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, StickyNote } from "lucide-react";
import Link from "next/link";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/components/tasks/task-item";

function RecentTaskItem({ task }: { task: Task }) {
  const priorityStyles = {
    high: "border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };
  return (
    <div className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded-lg">
      <div className="grid gap-1 flex-1">
        <p className="text-sm font-medium leading-none">{task.title}</p>
        <p className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-medium">
        <Badge variant="outline" className={cn("capitalize text-xs", priorityStyles[task.priority])}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, notes, toggleTaskCompletion } = useAppStore();

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const recentNotes = notes
    .slice(0, 3);
  
  const openTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Open Tasks</CardTitle>
            <ListTodo className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openTasks.length}</div>
            <p className="text-sm text-muted-foreground">tasks waiting to be completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Notes</CardTitle>
            <StickyNote className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{notes.length}</div>
            <p className="text-sm text-muted-foreground">notes created</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <RecentTaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No upcoming tasks. <Link href="/tasks" className="text-primary underline">Add one!</Link></p>
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
                <div key={note.id} className="grid gap-1.5 p-2 rounded-lg hover:bg-muted/50">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No recent notes. <Link href="/notes" className="text-primary underline">Create one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
