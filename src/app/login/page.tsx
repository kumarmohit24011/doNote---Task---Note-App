
"use client";

import { GoogleAuthProvider, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.25,44,30.41,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

export default function LoginPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (!email) {
          throw new Error("Could not retrieve email from Google Sign-In.");
      }
      
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      // If the only sign-in method is "google.com" and there's only one,
      // it implies the user was just created.
      if (methods.length === 1 && methods[0] === "google.com") {
        // This is a new user who wasn't pre-registered.
        // We deny access by signing them out and deleting the temporary account.
        const userToDelete = result.user;
        await auth.signOut();
        await userToDelete.delete();
        
        toast({
          title: "Access Denied",
          description: "This account is not authorized. Please contact the administrator.",
          variant: "destructive",
        });
      }
      // If methods.length > 1, or the method isn't just "google.com", they existed before, so we allow them.
    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
            console.error("Error signing in with Google", error);
            toast({
                title: "Sign-in error",
                description: "An unexpected error occurred during sign-in. Please try again.",
                variant: "destructive",
            });
        }
    } finally {
        setIsSigningIn(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">FocusFlow</h1>
            </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            {user ? "You are signed in." : "Sign in to access your dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
             <div className="flex flex-col items-center gap-4">
                <p>Redirecting to your dashboard...</p>
             </div>
          ) : (
            <Button onClick={handleSignIn} className="w-full" disabled={isSigningIn}>
              {isSigningIn ? 'Signing in...' : <><GoogleIcon /> Sign in with Google</>}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
