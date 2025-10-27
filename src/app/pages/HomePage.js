"use client";

import Link from "next/link";
import MagicBackground from "@/components/effects/magic-background";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap,
  FilePlus2,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative z-10">
      <MagicBackground />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Track your documents with
                <span className="ml-2 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
                  DocMan
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                DocMan helps individuals keep track of their files.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2"
                  >
                    Get started free <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#features">See features</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Privacy-first
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl border bg-card/80 backdrop-blur p-6 shadow-lg">
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
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  ))}
                </div>
                {/* <Separator className="my-6" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Everything you need to ship docs
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Powerful building blocks that scale with your team.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {new Array(6).fill(0).map((_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border bg-card/70 p-5 backdrop-blur transition-all hover:shadow-lg"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-2xl" />
                <h3 className="font-medium">Feature {i + 1}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur at sapien sed.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
