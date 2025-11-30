"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

export default function SubmissionsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [subject, setSubject] = useState(searchParams.get("subject") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (subject) params.set("subject", subject);

        router.push(`/admin/submissions?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                    type="text"
                    placeholder="Search name, roll no, year..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64"
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                    type="text"
                    placeholder="Filter by Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-48"
                />
            </div>
            <Button type="submit" variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Search
            </Button>
            {(search || subject) && (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        setSearch("");
                        setSubject("");
                        router.push("/admin/submissions");
                    }}
                >
                    Clear
                </Button>
            )}
        </form>
    );
}
