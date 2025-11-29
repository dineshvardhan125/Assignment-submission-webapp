"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Link as LinkIcon, Upload } from "lucide-react";

interface SubmissionFormProps {
    assignmentId: string;
    existingSubmission: any;
}

export default function SubmissionForm({
    assignmentId,
    existingSubmission,
}: SubmissionFormProps) {
    const [submissionType, setSubmissionType] = useState(
        existingSubmission?.submissionType || "link"
    );
    const [fileUrl, setFileUrl] = useState(existingSubmission?.fileUrl || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("File upload failed");
            }

            const data = await res.json();
            setFileUrl(data.fileUrl);
            toast.success("File uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Error uploading file");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ assignmentId, fileUrl, submissionType }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to submit assignment");
            }

            toast.success("Assignment submitted successfully!");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isGraded = existingSubmission?.status === "graded";

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>
                    {existingSubmission ? "Update Submission" : "Submit Assignment"}
                </CardTitle>
                <CardDescription>
                    Submit your work via a link or file upload.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue={submissionType}
                    onValueChange={setSubmissionType}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="link" disabled={isGraded}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Link
                        </TabsTrigger>
                        <TabsTrigger value="file" disabled={isGraded}>
                            <Upload className="mr-2 h-4 w-4" />
                            File Upload
                        </TabsTrigger>
                    </TabsList>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <TabsContent value="link">
                            <div className="space-y-2">
                                <Label htmlFor="fileUrl">File URL</Label>
                                <Input
                                    id="fileUrl"
                                    type="url"
                                    placeholder="https://docs.google.com/..."
                                    value={fileUrl}
                                    onChange={(e) => setFileUrl(e.target.value)}
                                    required={submissionType === "link"}
                                    disabled={isGraded}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="file">
                            <div className="space-y-2">
                                <Label htmlFor="fileUpload">Upload PDF or Image</Label>
                                <Input
                                    id="fileUpload"
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={handleFileUpload}
                                    disabled={isGraded}
                                />
                                {fileUrl && submissionType === "file" && (
                                    <p className="text-sm text-green-600">
                                        File ready: {fileUrl.split("/").pop()}
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        {isGraded ? (
                            <p className="text-sm text-muted-foreground italic">
                                This assignment has been graded and cannot be resubmitted.
                            </p>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || (submissionType === "file" && !fileUrl)}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {existingSubmission ? "Update Submission" : "Submit"}
                            </Button>
                        )}
                    </form>
                </Tabs>
            </CardContent>
        </Card>
    );
}
