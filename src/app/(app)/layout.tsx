
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/components/providers/app-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Activity,
  LayoutDashboard,
  Menu,
  StickyNote,
  ListTodo,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/notes", icon: StickyNote, label: "Notes" },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isMobile,
  onClick
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
        isActive && "bg-primary/10 text-primary font-semibold",
        isMobile && "text-xl"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

function UserMenu() {
    const { user } = useAuth();
  
    const handleSignOut = async () => {
      await signOut(auth);
    };
  
    if (!user) return null;
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/50">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback>
                <UserIcon/>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 py-1">
              <p className="text-md font-medium leading-none">{user.displayName}</p>
              <p className="text-sm leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-base py-2">
            <LogOut className="mr-3 h-5 w-5" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    if (!user) return null;
    
  return (
    <AppProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-4">
            <div className="flex h-20 items-center border-b px-8">
              <Link href="/" className="flex items-center gap-3 font-semibold text-primary">
                <Activity className="h-7 w-7" />
                <span className="text-2xl font-headline font-bold">doNote</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-6 text-lg font-medium">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-secondary/50">
          <header className="flex h-20 items-center gap-4 border-b bg-card px-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Select a page to navigate to.
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 text-xl font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-3 text-lg font-semibold mb-4 text-primary"
                  >
                    <Activity className="h-7 w-7" />
                    <span className="text-2xl font-headline font-bold">doNote</span>
                  </Link>
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile onClick={() => setIsSheetOpen(false)} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
            <UserMenu />
          </header>
          <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
