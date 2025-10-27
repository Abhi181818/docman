"use client";

import Link from "next/link";
import MagicBackground from "@/components/effects/magic-background";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap,
  FilePlus2,
  Lock,
  LayoutDashboard,
  Upload,
  History,
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      setUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      // noop
    }
  }, []);

  return (
    <div className="relative z-10">
      <MagicBackground />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {user ? (
                  <span className="inline-flex items-center gap-3">
                    <span className="relative inline-flex items-center">
                      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 opacity-30 blur-md animate-pulse" />
                      <span className="relative">Welcome back</span>
                    </span>
                    <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
                      to DocMan
                    </span>
                  </span>
                ) : (
                  <>
                    Track your documents with
                    <span className="ml-2 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
                      DocMan
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                {user
                  ? "Jump right back in with quick actions and pick up where you left off."
                  : "DocMan helps individuals keep track of their files."}
              </p>

              {!user ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2"
                    >
                      Get started free <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link href="#features">See features</Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="group relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 group-hover:translate-x-0 transition-transform duration-500" />
                      <LayoutDashboard className="h-5 w-5" /> Go to Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="group relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/10 to-fuchsia-500/0 group-hover:translate-x-0 transition-transform duration-500" />
                      <Upload className="h-5 w-5" /> Upload a document
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="group relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 group-hover:translate-x-0 transition-transform duration-500" />
                      <History className="h-5 w-5" /> Recent activity
                    </Link>
                  </Button>
                </div>
              )}

              <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Privacy-first
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl border bg-card/80 backdrop-blur p-6 shadow-lg">
                {user ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        icon: FilePlus2,
                        title: "New upload",
                        desc: "Securely add a new file.",
                      },
                      {
                        icon: Zap,
                        title: "Quick search",
                        desc: "Find a doc instantly.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Track shares",
                        desc: "Monitor who accessed.",
                      },
                      {
                        icon: Sparkles,
                        title: "Tips & tricks",
                        desc: "Power-user shortcuts.",
                      },
                    ].map((f) => (
                      <Link
                        key={f.title}
                        href="/dashboard"
                        className="group rounded-xl border p-4 hover:shadow-md transition-all bg-background/60 relative overflow-hidden"
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0" />
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 inline-flex items-center justify-center">
                          <f.icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="mt-3 font-medium">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {f.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        icon: FilePlus2,
                        title: "Smart capture",
                        desc: "Drag, drop and auto-tag any file.",
                      },
                      {
                        icon: Zap,
                        title: "Blazing search",
                        desc: "Instant results as you type.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Keep Track",
                        desc: "Keep track of your data.",
                      },
                    ].map((f) => (
                      <div
                        key={f.title}
                        className="group rounded-xl border p-4 hover:shadow-md transition-all bg-background/60"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 inline-flex items-center justify-center">
                          <f.icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="mt-3 font-medium">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {/* <Separator className="my-6" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
