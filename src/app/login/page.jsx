"use client";

import { useRouter } from "next/navigation";
import MagicBackground from "@/components/effects/magic-background";
import { AuthCard } from "@/components/auth/AuthCard";
import { api } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const onSubmit = async (data, { setError, setSuccess }) => {
        if (!data.email || !data.password) {
            setError("Email and password are required");
            return;
        }
        try {
            const { data: json } = await api.post("/api/auth/login", {
                email: data.email,
                password: data.password,
            });
            if (!json?.token) throw new Error("Invalid response from server");
            localStorage.setItem(
                "authUser",
                JSON.stringify({ token: json.token, email: json.email, name: json.firstName })
            );
            window.dispatchEvent(new CustomEvent("auth:changed"));
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Login failed");
            return;
        }
        setSuccess("Signed in successfully. Redirecting…");
        setTimeout(() => router.push("/"), 800);
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)]">
            <MagicBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <AuthCard mode="login" onSubmit={onSubmit} />
            </div>
        </div>
    );
}
