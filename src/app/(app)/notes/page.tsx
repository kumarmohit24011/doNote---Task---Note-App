
"use client";

import { useState } from "react";
import { useAppStore } from "@/components/providers/app-provider";
import { NoteCard } from "@/components/notes/note-card";
import { AddNoteForm } from "@/components/notes/add-note-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { notes } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-headline">My Notes</h1>
        <Button variant="outline" size="sm" onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? <X className="mr-2 h-3 w-3" /> : <PlusCircle className="mr-2 h-3 w-3" />}
            {isFormOpen ? 'Cancel' : 'Add Note'}
        </Button>
      </div>

      <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <Card className="mb-4">
              <CardContent className="p-4">
                  <AddNoteForm onFinished={() => setIsFormOpen(false)} />
              </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>


      {notes.length > 0 ? (
        <div className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", isFormOpen && "mt-0")}>
          {notes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>
      ) : (
        <div className={cn("flex-1 flex items-center justify-center text-center py-10 border-2 border-dashed rounded-lg bg-card", isFormOpen && "hidden")}>
          <div>
            <h2 className="text-lg font-semibold font-headline">No Notes Yet</h2>
            <p className="text-muted-foreground mt-1 text-xs">Click "Add Note" to create your first note.</p>
          </div>
        </div>
      )}
    </div>
  );
}
