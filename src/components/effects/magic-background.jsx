"use client";

import { useEffect, useMemo } from "react";
import { useMouse } from "@/hooks/use-mouse";
import { cn } from "@/lib/utils";

export default function MagicBackground({ className }) {
    const { x, y } = useMouse();

    const style = useMemo(() => ({
        "--mx": `${x}px`,
        "--my": `${y}px`,
    }), [x, y]);

    useEffect(() => {
    }, []);

    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none fixed inset-0 z-0 overflow-hidden",
                className
            )}
            style={style}
        >
            <div
                className="absolute -inset-40 opacity-80 mix-blend-screen [background:radial-gradient(900px_900px_at_var(--mx)_var(--my),oklch(0.9_0.15_260_/0.7),transparent_70%)] dark:opacity-90"
            />
            <div
                className="absolute -inset-40 opacity-50 mix-blend-overlay [background:radial-gradient(220px_220px_at_var(--mx)_var(--my),oklch(0.98_0.06_260_/0.85),transparent_70%)]"
            />
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-400/20 blur-3xl" />
        </div>
    );
}
