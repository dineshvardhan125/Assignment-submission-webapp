import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { submissionId, marks, feedback } = await req.json();

    if (!submissionId || marks === undefined) {
      return NextResponse.json(
        { message: 'Submission ID and Marks are required' },
        { status: 400 }
      );
    }

    const submission = await Submission.findById(submissionId).populate('assignment');

    if (!submission) {
      return NextResponse.json(
        { message: 'Submission not found' },
        { status: 404 }
      );
    }

    const totalMarks = submission.assignment.totalMarks || 100;
    if (marks > totalMarks) {
      return NextResponse.json(
        { message: `Marks cannot exceed total marks (${totalMarks})` },
        { status: 400 }
      );
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'graded';

    await submission.save();

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    console.error('Error grading submission:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
