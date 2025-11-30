"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import HighlightText from "@/components/HighlightText";

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    rollNumber?: string;
    branch?: string;
    year?: string;
    section?: string;
    avatar?: string;
    createdAt: string;
}

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            return res.json();
        },
    });

    const users: User[] = data?.users || [];

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.rollNumber && user.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage and view all registered users.
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8 bg-background/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground animate-float">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <TableRow
                                                key={user._id}
                                                className="animate-fade-in-up"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar || 'adventurer-neutral'}/svg?seed=${user.name}`} />
                                                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">
                                                                <HighlightText text={user.name} highlight={searchTerm} />
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                <HighlightText text={user.email} highlight={searchTerm} />
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.role === 'student' ? (
                                                        <div className="text-sm">
                                                            <p>
                                                                <span className="text-muted-foreground">Roll:</span>{" "}
                                                                <HighlightText text={user.rollNumber || '-'} highlight={searchTerm} />
                                                            </p>
                                                            <p>
                                                                <span className="text-muted-foreground">Class:</span> {user.year || '-'} - {user.branch || '-'} ({user.section || '-'})
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
