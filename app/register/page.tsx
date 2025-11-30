"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        branch: '',
        section: '',
        year: '',
        adminSecret: '',
<<<<<<< HEAD
=======

>>>>>>> friend/main
    });
    const [role, setRole] = useState<"student" | "admin">("student");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submissionData = {
                ...formData,
                role,
            };

            if (role === 'student') {
                delete (submissionData as any).adminSecret;
            } else {
                delete (submissionData as any).rollNumber;
                delete (submissionData as any).branch;
                delete (submissionData as any).section;
                delete (submissionData as any).year;
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Registration failed');
                return;
            }

            toast.success("Registration successful");

            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        } catch (err) {
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>

            <div className="glass-card p-8 w-full max-w-md relative z-10 my-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                        <FileText className="w-7 h-7 text-primary-foreground" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join AssignHub today</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-secondary/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-secondary/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-secondary/50"
                            required
                        />
                    </div>

<<<<<<< HEAD
=======


>>>>>>> friend/main
                    <div className="space-y-3">
                        <Label>Select Role</Label>
                        <RadioGroup value={role} onValueChange={(value) => setRole(value as "student" | "admin")}>
                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <RadioGroupItem value="student" id="student" />
                                <Label htmlFor="student" className="flex-1 cursor-pointer">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <RadioGroupItem value="admin" id="admin" />
                                <Label htmlFor="admin" className="flex-1 cursor-pointer">Admin / Teacher</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {role === 'student' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="rollNumber">Roll Number</Label>
                                <Input
                                    id="rollNumber"
                                    name="rollNumber"
                                    type="text"
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                    className="bg-secondary/50"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch</Label>
                                    <Input
                                        id="branch"
                                        name="branch"
                                        type="text"
                                        placeholder="e.g. CSE"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        className="bg-secondary/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Select onValueChange={(val) => handleSelectChange('year', val)} value={formData.year}>
                                        <SelectTrigger className="bg-secondary/50">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                            <SelectItem value="4">4th Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="section">Section</Label>
                                <Input
                                    id="section"
                                    name="section"
                                    type="text"
                                    placeholder="e.g. A"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="bg-secondary/50"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {role === 'admin' && (
                        <div className="space-y-2">
                            <Label htmlFor="adminSecret">Admin Secret Key</Label>
                            <Input
                                id="adminSecret"
                                name="adminSecret"
                                type="password"
                                placeholder="Enter admin secret key"
                                value={formData.adminSecret}
                                onChange={handleChange}
                                className="bg-secondary/50"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                You need the admin secret key to register as an admin
                            </p>
                        </div>
                    )}

                    <Button type="submit" className="w-full neon-glow" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" passHref>
                        <Button
                            variant="link"
                            className="text-primary p-0"
                        >
                            Sign in
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
