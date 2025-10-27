"use client";

import { useState } from "react";
import MagicBackground from "@/components/effects/magic-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");
        setLoading(true);
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) setError(json?.message || "Failed to send reset link");
        else setStatus("Check your inbox for a reset link (mock)");
        setLoading(false);
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)]">
            <MagicBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mx-auto w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-lg backdrop-blur">
                    <h1 className="text-2xl font-semibold">Reset your password</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Enter your account email and we'll send you a reset link.</p>
                    <form onSubmit={submit} className="mt-6 grid gap-3">
                        <label className="text-sm" htmlFor="email">Email</label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                        {error && <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>}
                        {status && <div className="rounded-md border border-green-500/40 bg-green-500/5 px-3 py-2 text-sm text-green-600">{status}</div>}
                        <Button disabled={loading} type="submit">{loading ? "Sending…" : "Send reset link"}</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
