"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NavLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
    activeClassName?: string;
}

export function NavLink({ to, children, className, activeClassName }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === to || pathname?.startsWith(`${to}/`);

    return (
        <Link
            href={to}
            className={cn(className, isActive && activeClassName)}
        >
            {children}
        </Link>
    );
}
