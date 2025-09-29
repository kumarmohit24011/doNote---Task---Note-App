
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                router.replace('/login');
            }
        }
    }, [user, loading, router]);

    return null;
}
