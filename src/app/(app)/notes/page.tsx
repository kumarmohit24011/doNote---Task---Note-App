
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NoteCard } from "@/components/notes/note-card";
import { AddNoteForm } from "@/components/notes/add-note-form";

export default function NotesPage() {
  const { notes } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold font-headline">My Notes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">Add a new note</DialogTitle>
            </DialogHeader>
            <AddNoteForm onFinished={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {notes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center py-16 border-2 border-dashed rounded-lg mt-6 bg-card">
          <div>
            <h2 className="text-2xl font-semibold font-headline">No Notes Yet</h2>
            <p className="text-muted-foreground mt-3 text-lg">Click "Add Note" to create your first note.</p>
          </div>
        </div>
      )}
    </div>
  );
}
