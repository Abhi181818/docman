"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthCard({ mode = "login", onSubmit }) {
    const isLogin = mode === "login";
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        const data = Object.fromEntries(new FormData(e.currentTarget));
        try {
            await onSubmit?.(data, { setError, setSuccess });
        } catch (err) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {isLogin ? "Enter your credentials to continue" : "Start your 14-day free trial"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
                {!isLogin && (
                    <div className="grid gap-2">
                        <label className="text-sm" htmlFor="name">Full name</label>
                        <Input id="name" name="name" placeholder="Jane Doe" required />
                    </div>
                )}
                <div className="grid gap-2">
                    <label className="text-sm" htmlFor="email">Email</label>
                    <Input id="email" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm" htmlFor="password">Password</label>
                        {isLogin && (
                            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</Link>
                        )}
                    </div>
                    <div className="relative">
                        <Input id="password" name="password" type={show ? "text" : "password"} placeholder="••••••••" required minLength={6} />
                        <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-2 text-muted-foreground hover:text-foreground"
                            aria-label={show ? "Hide password" : "Show password"}
                        >
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {!isLogin && (
                    <div className="grid gap-2">
                        <label className="text-sm" htmlFor="confirm">Confirm password</label>
                        <Input id="confirm" name="confirm" type={show ? "text" : "password"} placeholder="••••••••" required minLength={6} />
                    </div>
                )}

                {isLogin && (
                    <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" name="remember" className="h-4 w-4 rounded border" /> Remember me
                    </label>
                )}

                {error ? (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>
                ) : null}
                {success ? (
                    <div className="rounded-md border border-green-500/40 bg-green-500/5 px-3 py-2 text-sm text-green-600">{success}</div>
                ) : null}

                <Button disabled={loading} type="submit" className="w-full">
                    {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
                </Button>
            </form>

            <div className="my-4 text-center text-xs text-muted-foreground">or</div>

            <div className="grid gap-2">
                <Button variant="secondary" className="w-full" type="button">
                    <Mail className="mr-2 h-4 w-4" /> Continue with Email Link
                </Button>
                <Button variant="ghost" className="w-full" type="button">
                    <Github className="mr-2 h-4 w-4" /> Continue with GitHub
                </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                {isLogin ? (
                    <>Don't have an account? <Link href="/signup" className="text-foreground">Sign up</Link></>
                ) : (
                    <>Already have an account? <Link href="/login" className="text-foreground">Sign in</Link></>
                )}
            </p>
        </div>
    );
}
