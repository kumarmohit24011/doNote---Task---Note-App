
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
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
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
import { type ReactNode } from "react";
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
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
        isMobile && "text-lg"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
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
          <Button variant="secondary" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback>
                <UserIcon/>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    if (!user) return null;
    
  return (
    <AppProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-lg font-headline">FocusFlow</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-4 text-base font-medium">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <Activity className="h-6 w-6 text-primary" />
                    <span className="sr-only">FocusFlow</span>
                  </Link>
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
            <UserMenu />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
