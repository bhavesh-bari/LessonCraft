"use client";
import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (!email || !password || (!isLoginView && !username)) {
            toast.error("Please fill in all fields");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        if (isLoginView) {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Login successful!");
                router.push("/");
            }
        } else {

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: username, email, password })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Account created successfully!");
                setIsLoginView(true);
            } else {
                toast.error(data.message || "Signup failed");
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-200 p-4 text-black">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        {isLoginView ? "Welcome Back!" : "Create Account"}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLoginView && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg"
                    >
                        {isLoading
                            ? "Processing..."
                            : isLoginView
                                ? "Log In"
                                : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-center">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="ml-1 text-blue-600"
                    >
                        {isLoginView ? "Sign Up" : "Log In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
