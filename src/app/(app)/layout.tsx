
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppProvider, useAppStore } from "@/components/providers/app-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Activity,
  LayoutDashboard,
  Menu,
  StickyNote,
  ListTodo,
  LogOut,
  User as UserIcon,
  Palette,
  Check,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type ReactNode, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useTheme } from "@/components/providers/theme-provider";

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
        "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
        isActive && "bg-primary/10 text-primary font-semibold",
        isMobile ? "text-lg" : "text-sm"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function UserMenu() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
  
    const handleSignOut = async () => {
      await signOut(auth);
    };
  
    if (!user) return null;
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-primary/50">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback>
                <UserIcon className="w-4 h-4"/>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 py-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer text-sm py-2">
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                        <DropdownMenuRadioItem value="theme-default">Default</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="theme-sunset">Sunset</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="theme-ocean">Ocean</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="theme-forest">Forest</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-sm py-2">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

function AppLayoutContent({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { showConfetti, setShowConfetti, completionMessage, setCompletionMessage } = useAppStore();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setCompletionMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, setShowConfetti, setCompletionMessage]);

  if (!user) return null;
    
  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      {completionMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-5xl font-bold text-primary animate-in fade-in-0 zoom-in-75 slide-in-from-bottom-10 duration-500">
            {completionMessage}
          </div>
        </div>
      )}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                <Activity className="h-6 w-6" />
                <span className="text-xl font-headline font-bold">doNote</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start p-4 text-sm font-medium">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-secondary/50">
          <header className="flex h-16 items-center gap-4 border-b bg-card px-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden h-8 w-8"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Select a page to navigate to.
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-2 text-primary"
                  >
                    <Activity className="h-6 w-6" />
                    <span className="text-xl font-headline font-bold">doNote</span>
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
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AppProvider>
  )
}
