"use client";

import { useState, useTransition } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTaskSuggestion } from "@/lib/actions";
import { Task } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function ProductivitySuggestion({ tasks }: { tasks: Task[] }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetSuggestion = () => {
    if (tasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Add some open tasks to get a productivity suggestion.",
      });
      return;
    }

    startTransition(async () => {
      const result = await getTaskSuggestion(tasks);
      if (result.success) {
        setSuggestion(result.suggestion);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          AI Productivity Hub
        </CardTitle>
        <CardDescription>
          Let AI analyze your open tasks and suggest a smart way to group them.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        {suggestion ? (
          <Alert>
            <AlertTitle>Suggestion</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">{suggestion}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg h-full flex items-center justify-center">
            Click the button to get your personalized productivity plan!
          </div>
        )}
        <Button onClick={handleGetSuggestion} disabled={isPending} className="w-full mt-4">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Suggest Task Grouping"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
