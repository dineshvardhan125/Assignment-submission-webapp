import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default async function AdminAssignmentsPage() {
    await connectDB();
    const assignments = await Assignment.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground">
                        Manage and track all student assignments.
                    </p>
                </div>
                <Link href="/admin/assignments/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Assignment
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Assignments</CardTitle>
                    <CardDescription>
                        A list of all assignments created in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No assignments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assignments.map((assignment) => (
                                    <TableRow key={assignment._id.toString()}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{assignment.title}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {assignment.description}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                {assignment.subject || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{assignment.year || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {assignment.dueDate ? format(new Date(assignment.dueDate), "PPP") : '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/assignments/${assignment._id}/submissions`}>
                                                <Button variant="ghost" size="sm" className="gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    View Submissions
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
