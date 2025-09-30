
"use client";

import { useAppStore } from "@/components/providers/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, StickyNote, Quote, Flame } from "lucide-react";
import Link from "next/link";
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Don’t wait. The time will never be just right.", author: "Napoleon Hill" },
  { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Go the extra mile. It’s never crowded.", author: "Wayne Dyer" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Don’t stop when you’re tired. Stop when you’re done.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Roy T. Bennett" },
  { text: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Don’t limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "George Horace Lorimer" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "It’s going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don’t wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "Work hard in silence, let success be your noise.", author: "Frank Ocean" },
  { text: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Stay positive, work hard, make it happen.", author: "Unknown" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
  { text: "Failure is not the opposite of success; it’s part of success.", author: "Arianna Huffington" },
  { text: "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" },
  { text: "The best way to predict your future is to create it.", author: "Peter Drucker" },
  { text: "Do what you can with all you have, wherever you are.", author: "Theodore Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The man who has confidence in himself gains the confidence of others.", author: "Hasidic Proverb" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Reading is to the mind, as exercise is to the body.", author: "Brian Tracy" },
  { text: "Fake it until you make it! Act as if you had all the confidence you require until it becomes your reality.", author: "Brian Tracy" },
  { text: "For every reason it’s not possible, there are hundreds of people who have faced the same circumstances and succeeded.", author: "Jack Canfield" },
  { text: "Things work out best for those who make the best of how things work out.", author: "John Wooden" },
  { text: "A champion is defined not by their wins but by how they can recover when they fall.", author: "Serena Williams" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "If you want to achieve greatness stop asking for permission.", author: "Anonymous" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Hustle in silence and let your success make the noise.", author: "Unknown" },
  { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
  { text: "Sometimes later becomes never. Do it now.", author: "Unknown" },
  { text: "Success is what comes after you stop making excuses.", author: "Luis Galarza" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "If you want something you’ve never had, you must be willing to do something you’ve never done.", author: "Thomas Jefferson" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Don’t be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { text: "Don’t let the fear of losing be greater than the excitement of winning.", author: "Robert Kiyosaki" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Imagine your life is perfect in every respect; what would it look like?", author: "Brian Tracy" },
  { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Don’t be afraid to give up the good to go for the great.", author: "Kenny Rogers" },
  { text: "Do what you love and success will follow. Passion is the fuel behind a successful career.", author: "Meg Whitman" },
  { text: "When you have a dream, you’ve got to grab it and never let go.", author: "Carol Burnett" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "Success only comes to those who dare to attempt.", author: "Mallika Tripathi" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "I never dreamed about success. I worked for it.", author: "Estee Lauder" },
  { text: "Your passion is waiting for your courage to catch up.", author: "Isabelle Lafleche" },
  { text: "Don’t be afraid to start over. It’s a chance to build something better this time.", author: "Unknown" },
  { text: "Difficulties in life don’t come to destroy you, but to help you realize your hidden potential.", author: "Unknown" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Your time is limited, don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { text: "Courage is one step ahead of fear.", author: "Coleman Young" },
  { text: "Winners are not afraid of losing. But losers are.", author: "Robert Kiyosaki" },
  { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
  { text: "Don’t let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { text: "If you’re going through hell, keep going.", author: "Winston Churchill" },
  { text: "There are no limits to what you can accomplish, except the limits you place on your own thinking.", author: "Brian Tracy" },
  { text: "Don’t give up, the beginning is always the hardest.", author: "Unknown" },
  { text: "Success is stumbling from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Ambition is enthusiasm with a purpose.", author: "Frank Tyger" },
  { text: "Opportunities multiply as they are seized.", author: "Sun Tzu" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  { text: "Start small, think big. Don’t worry about too many things at once.", author: "Steve Jobs" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Never bend your head. Always hold it high. Look the world straight in the eye.", author: "Helen Keller" }
];


function RecentTaskItem({ task }: { task: Task }) {
  const priorityStyles = {
    high: "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-400",
    medium: "border-yellow-500/60 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    low: "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-400",
  };
  return (
    <div className="flex items-center gap-4 hover:bg-secondary p-2.5 rounded-lg transition-colors">
      <div className="grid gap-1 flex-1">
        <p className="text-sm font-medium leading-none">{task.title}</p>
        <p className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-medium">
        <Badge variant="outline" className={cn("capitalize text-xs font-normal", priorityStyles[task.priority])}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, notes, streak } = useAppStore();
  const [randomQuote, setRandomQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const recentNotes = notes.slice(0, 4);
  
  const openTasks = tasks.filter(task => !task.completed);

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Quote className="h-6 w-6 text-primary" />
            {randomQuote ? (
              <div>
                <blockquote className="text-sm font-semibold text-primary">
                  "{randomQuote.text}"
                </blockquote>
                <p className="text-xs text-primary/80 mt-1">- {randomQuote.author}</p>
              </div>
            ) : (
                <div className="h-8 w-full animate-pulse rounded-md bg-primary/20" />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks to be completed</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">notes created</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">day completion streak</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="text-lg font-bold font-headline">Upcoming Tasks</div>
          </CardHeader>
          <CardContent className="grid gap-1.5 pt-0">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => <RecentTaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No upcoming tasks. <Link href="/tasks" className="text-primary hover:underline">Add one!</Link></p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-lg font-bold font-headline">Recent Notes</div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div key={note.id} className="grid gap-1 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No recent notes. <Link href="/notes" className="text-primary hover:underline">Create one!</Link></p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
