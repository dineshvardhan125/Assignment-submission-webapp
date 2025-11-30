"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
<<<<<<< HEAD
=======
import { ThemeProvider } from "next-themes";
>>>>>>> friend/main
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
            <TooltipProvider>
                {children}
                <Sonner />
            </TooltipProvider>
=======
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>
                    {children}
                    <Sonner />
                </TooltipProvider>
            </ThemeProvider>
>>>>>>> friend/main
        </QueryClientProvider>
    );
}
