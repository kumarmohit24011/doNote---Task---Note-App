
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { NoteCard } from "@/components/notes/note-card";
import { AddNoteForm } from "@/components/notes/add-note-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotesPage() {
  const { notes } = useAppStore();
  
  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h1 className="text-xl font-bold font-headline mb-2">My Notes</h1>
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-bold font-headline">Add a new note</CardTitle>
            </CardHeader>
            <CardContent>
                <AddNoteForm />
            </CardContent>
        </Card>
      </div>

      {notes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center py-10 border-2 border-dashed rounded-lg bg-card">
          <div>
            <h2 className="text-lg font-semibold font-headline">No Notes Yet</h2>
            <p className="text-muted-foreground mt-1 text-xs">Use the form above to create your first note.</p>
          </div>
        </div>
      )}
    </div>
  );
}
