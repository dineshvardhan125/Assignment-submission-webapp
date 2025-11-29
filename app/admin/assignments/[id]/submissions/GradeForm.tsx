"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PenSquare } from "lucide-react";

interface GradeFormProps {
    submission: any; // Using any for simplicity, ideally should be typed
}

export default function GradeForm({ submission }: GradeFormProps) {
    const [open, setOpen] = useState(false);
    const [marks, setMarks] = useState(submission.marks || "");
    const [feedback, setFeedback] = useState(submission.feedback || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/submissions/grade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    submissionId: submission._id,
                    marks: Number(marks),
                    feedback,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to grade submission");
            }

            toast.success("Submission graded successfully");
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Error grading submission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <PenSquare className="h-4 w-4" />
                    Grade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                        Enter marks and feedback for {submission.student?.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGrade}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="marks" className="text-right">
                                Marks
                            </Label>
                            <Input
                                id="marks"
                                type="number"
                                value={marks}
                                onChange={(e) => setMarks(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="feedback" className="text-right">
                                Feedback
                            </Label>
                            <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="col-span-3"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Grade
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
