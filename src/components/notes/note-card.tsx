
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Note } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreVertical, Trash2, Pencil, Save, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/components/providers/app-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";

const noteEditSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    content: z.string().min(3, { message: "Content must be at least 3 characters." }),
});

type NoteEditValues = z.infer<typeof noteEditSchema>;


export function NoteCard({ note }: { note: Note }) {
  const { updateNote, deleteNote } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<NoteEditValues>({
    resolver: zodResolver(noteEditSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
    },
  });

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
      toast({ title: "Note deleted", description: `"${note.title}" was successfully deleted.` });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete note. Please try again.", variant: "destructive" });
    }
  };

  async function onEditSubmit(data: NoteEditValues) {
    try {
        await updateNote(note.id, data);
        toast({ title: "Note updated!", description: "Your changes have been saved." });
        setIsEditing(false);
    } catch (error) {
        toast({ title: "Error", description: "Could not update note. Please try again.", variant: "destructive" });
    }
  }

  if (isEditing) {
    return (
        <Card className="flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="flex flex-col h-full">
                    <CardHeader>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Note title" {...field} className="text-xl font-bold font-headline p-0 border-0 shadow-none focus-visible:ring-0"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea placeholder="Jot down your thoughts..." {...field} className="text-md min-h-[120px] p-0 border-0 shadow-none focus-visible:ring-0" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                            <X className="mr-2" /> Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2" /> Save
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col animate-in fade-in-0 zoom-in-95 duration-500 hover:shadow-xl transition-shadow bg-card/80 dark:bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="pr-4 text-xl font-headline">{note.title}</CardTitle>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 flex-shrink-0 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer text-base" onClick={() => { form.reset(); setIsEditing(true); }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer text-base">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-headline">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-lg">
                    This action cannot be undone. This will permanently delete your note titled "{note.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        {note.createdAt && (
          <CardDescription className="text-sm">
            {format(new Date(note.createdAt), "MMMM d, yyyy")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-md text-muted-foreground whitespace-pre-wrap line-clamp-[8]">
          {note.content}
        </p>
      </CardContent>
    </Card>
  );
}

