
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { useAppStore } from "@/components/providers/app-provider";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardDescription } from "../ui/card";

const chartConfig = {
  completed: {
    label: "Tasks Completed",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function TaskProgressChart() {
  const { tasks } = useAppStore();

  const chartData = React.useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i)).reverse();
    
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    
    return last7Days.map(day => {
        const completedCount = completedTasks.filter(task => {
            if (!task.completedAt) return false;
            // Firebase server timestamp can be a number, handle this case.
            const completedDate = typeof task.completedAt === 'number' ? new Date(task.completedAt) : parseISO(task.completedAt as unknown as string);
            return isSameDay(day, completedDate);
        }).length;
        
        return {
            date: format(day, "MMM d"),
            shortDate: format(day, "EEE"),
            completed: completedCount
        };
    });
  }, [tasks]);

  return (
    <div className="h-[250px] w-full">
      <CardDescription className="mb-4 text-sm text-center text-muted-foreground">
        Tasks completed over the last 7 days.
      </CardDescription>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="shortDate"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
           <YAxis 
            tickLine={false} 
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            width={20}
           />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                labelKey="date" 
                labelClassName="text-xs"
                indicator="dot"
            />}
          />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
