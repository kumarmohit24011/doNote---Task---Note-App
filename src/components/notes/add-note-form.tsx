
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppStore } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

const noteFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(3, { message: "Content must be at least 3 characters." }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

const quotes = [
    "Great ideas start with a single thought.",
    "Every creation begins with a decision to try.",
    "Capture the fleeting moments of inspiration.",
    "Turn your can'ts into cans and your dreams into plans.",
];


export function AddNoteForm({ onFinished }: { onFinished?: () => void }) {
  const { addNote } = useAppStore();
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: NoteFormValues) {
    try {
        await addNote(data);
        toast({ title: "Note created!", description: "Your idea has been saved." });
        form.reset();
        onFinished?.();
    } catch (error) {
        toast({ title: "Error", description: "Could not create note. Please try again.", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3 text-xs text-muted-foreground bg-secondary/70 p-3 rounded-md">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="font-medium">"{randomQuote}"</p>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ideas for new project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Jot down your thoughts..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving Note...' : 'Save Note'}
        </Button>
      </form>
    </Form>
  );
}
