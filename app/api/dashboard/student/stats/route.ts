import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.id;
        const user = await User.findById(userId);
        const userYear = user?.year;

        const assignmentQuery: any = {};
        if (userYear) {
            assignmentQuery.year = userYear;
        }

        const totalAssignments = await Assignment.countDocuments(assignmentQuery);
        const mySubmissions = await Submission.countDocuments({ student: userId });
        const pendingAssignments = totalAssignments - mySubmissions; // Simplified logic
        // For a real app, you'd check which specific assignments are submitted. 
        // But for now, this is a good approximation if 1 assignment = 1 submission.

        // Average grade calculation (if grades exist)
        const gradedSubmissions = await Submission.find({ student: userId, status: 'graded' });
        let averageGrade = 0;
        if (gradedSubmissions.length > 0) {
            const totalMarks = gradedSubmissions.reduce((acc, curr) => acc + (curr.marks || 0), 0);
            averageGrade = Number((totalMarks / gradedSubmissions.length).toFixed(1));
        }

        // Fetch upcoming deadlines
        const now = new Date();
        const upcomingAssignments = await Assignment.find({
            dueDate: { $gte: now },
            ...assignmentQuery
        })
            .sort({ dueDate: 1 })
            .limit(5)
            .lean();

        const upcomingDeadlines = await Promise.all(upcomingAssignments.map(async (assignment) => {
            const submission = await Submission.findOne({
                assignment: assignment._id,
                student: userId
            });

            let status = 'Pending';
            if (submission) {
                status = submission.status === 'graded' ? 'Graded' : 'Submitted';
            }

            return {
                id: assignment._id,
                title: assignment.title,
                dueDate: assignment.dueDate,
                status: status
            };
        }));

        return NextResponse.json({
            totalAssignments,
            pendingAssignments: Math.max(0, pendingAssignments),
            submittedAssignments: mySubmissions,
            averageGrade: averageGrade > 0 ? `${averageGrade}%` : 'N/A',
            upcomingDeadlines
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
