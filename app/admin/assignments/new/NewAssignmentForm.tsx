"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";

export default function NewAssignmentForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        year: "",
        dueDate: "",
<<<<<<< HEAD
=======
        totalMarks: "100",
>>>>>>> friend/main
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
<<<<<<< HEAD
=======

        if (!formData.year) {
            toast.error("Please select a year");
            return;
        }

>>>>>>> friend/main
        setLoading(true);

        try {
            const res = await fetch("/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to create assignment");
            }

            toast.success("Assignment created successfully");
            router.push("/admin/assignments");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>
                    Fill in the details to create a new assignment for students.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Physics Lab Report"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

<<<<<<< HEAD
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
=======
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
>>>>>>> friend/main
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                placeholder="e.g., Physics"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={formData.year}
                                onValueChange={(value) => handleSelectChange("year", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
<<<<<<< HEAD
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
=======
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                    <SelectItem value="4">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalMarks">Total Marks</Label>
                            <Input
                                id="totalMarks"
                                name="totalMarks"
                                type="number"
                                placeholder="e.g., 100"
                                value={formData.totalMarks}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
>>>>>>> friend/main
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Provide instructions for the assignment..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Assignment
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
