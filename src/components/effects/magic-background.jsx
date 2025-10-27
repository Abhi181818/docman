"use client";

import { useEffect, useMemo } from "react";
import { useMouse } from "@/hooks/use-mouse";
import { cn } from "@/lib/utils";

export default function MagicBackground({ className }) {
    const { x, y } = useMouse();

    // Compute CSS variables for radial gradient following the cursor
    const style = useMemo(() => ({
        "--mx": `${x}px`,
        "--my": `${y}px`,
    }), [x, y]);

    useEffect(() => {
        // no-op, just ensures client rendering
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
            {/* Soft spotlight following cursor */}
            <div
                className="absolute -inset-40 opacity-60 [background:radial-gradient(600px_600px_at_var(--mx)_var(--my),oklch(0.89_0.06_260_/0.5),transparent_60%)] dark:opacity-70"
            />
            {/* Decorative gradient blobs */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-400/20 blur-3xl" />
        </div>
    );
}
