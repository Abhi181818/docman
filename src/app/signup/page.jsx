"use client";

import { useRouter } from "next/navigation";
import MagicBackground from "@/components/effects/magic-background";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SignupPage() {
    const router = useRouter();

    const onSubmit = async (data, { setError, setSuccess }) => {
        if (!data.email || !data.password || !data.name) {
            setError("Name, email and password are required");
            return;
        }
        if (data.password !== data.confirm) {
            setError("Passwords do not match");
            return;
        }
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            setError(json?.message || "Unable to create account");
            return;
        }
        localStorage.setItem("authUser", JSON.stringify({ email: data.email, name: data.name }));
        setSuccess("Account created! Redirecting…");
        setTimeout(() => router.push("/"), 800);
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)]">
            <MagicBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <AuthCard mode="signup" onSubmit={onSubmit} />
            </div>
        </div>
    );
}
