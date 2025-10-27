"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, LogIn, UserPlus, LogOut, ChevronDown, Github, Home, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const baseRoutes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/#features", label: "Features", icon: Sparkles },
];

function Brand() {
    return (
        <Link href="/" className="group inline-flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 shadow-sm">
                <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-semibold tracking-tight">DocMan</span>
        </Link>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const read = () => {
            try {
                const saved = localStorage.getItem("authUser");
                setUser(saved ? JSON.parse(saved) : null);
            } catch { }
        };
        read();
        const onChanged = () => read();
        window.addEventListener("storage", onChanged);
        window.addEventListener("auth:changed", onChanged);
        return () => {
            window.removeEventListener("storage", onChanged);
            window.removeEventListener("auth:changed", onChanged);
        };
    }, []);

    const handleSignOut = () => {
        try {
            localStorage.removeItem("authUser");
            setUser(null);
            window.dispatchEvent(new CustomEvent("auth:changed"));
            router.push("/");
        } catch { }
    };

    const routes = user
        ? [...baseRoutes, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
        : baseRoutes;

    return (
        <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon" aria-label="Open menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <div className="p-4 border-b">
                                    <Brand />
                                </div>
                                <nav className="flex flex-col p-2">
                                    {routes.map((r) => (
                                        <Link
                                            key={r.href}
                                            href={r.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                                pathname === r.href
                                                    ? "bg-secondary/70 text-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            )}
                                        >
                                            {r.icon ? <r.icon className="h-4 w-4" /> : null}
                                            {r.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Brand />
                        <div className="hidden lg:flex items-center gap-1 ml-6">
                            {routes.map((r) => (
                                <Link
                                    key={r.href}
                                    href={r.href}
                                    className={cn(
                                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        pathname === r.href
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {r.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href="https://github.com/Abhi181818"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hidden sm:inline-flex"
                                >
                                    <Button variant="ghost" size="icon" aria-label="GitHub">
                                        <Github className="h-5 w-5" />
                                    </Button>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>Star on GitHub</TooltipContent>
                        </Tooltip>

                        {!user ? (
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost">
                                    <Link href="/login" className="inline-flex items-center gap-2">
                                        <LogIn className="h-4 w-4" /> Login
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup" className="inline-flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" /> Sign Up
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="group relative">
                                <Button variant="secondary" className="inline-flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                    <span className="max-sm:hidden">{user?.name || user?.firstName || "Account"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all absolute right-0 mt-2 w-44 rounded-lg border bg-popover p-1 shadow-lg">
                                    {user && (
                                        <Link href="/dashboard" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary/60">Dashboard</Link>
                                    )}
                                    <button onClick={handleSignOut} className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-secondary/60">
                                        <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
