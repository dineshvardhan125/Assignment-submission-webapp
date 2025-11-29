import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
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

        const totalAssignments = await Assignment.countDocuments({});
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

        return NextResponse.json({
            totalAssignments,
            pendingAssignments: Math.max(0, pendingAssignments),
            submittedAssignments: mySubmissions,
            averageGrade: averageGrade > 0 ? `${averageGrade}%` : 'N/A'
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
