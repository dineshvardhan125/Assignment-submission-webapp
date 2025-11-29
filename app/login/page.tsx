"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Something went wrong');
                return;
            }

            toast.success("Login successful");

            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        } catch (err) {
            toast.error('Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

            <div className="glass-card p-8 w-full max-w-md relative z-10">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                        <FileText className="w-7 h-7 text-primary-foreground" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your AssignHub account</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-secondary/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-secondary/50"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full neon-glow" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-6 text-center space-y-4">
                    <Button variant="link" className="text-primary">
                        Forgot password?
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/register" passHref>
                            <Button
                                variant="link"
                                className="text-primary p-0"
                            >
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
