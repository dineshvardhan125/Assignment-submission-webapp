import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
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

    if (decoded.role !== 'student') {
      return NextResponse.json(
        { message: 'Forbidden: Student access required' },
        { status: 403 }
      );
    }

    const { assignmentId, fileUrl, submissionType } = await req.json();

    if (!assignmentId || !fileUrl) {
      return NextResponse.json(
        { message: 'Assignment ID and File URL are required' },
        { status: 400 }
      );
    }

    // Check if submission already exists
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: decoded.id,
    });

    if (submission) {
      // Update existing submission
      submission.fileUrl = fileUrl;
      submission.submissionType = submissionType || 'link';
      submission.status = 'submitted';
      await submission.save();
    } else {
      // Create new submission
      submission = new Submission({
        assignment: assignmentId,
        student: decoded.id,
        fileUrl,
        submissionType: submissionType || 'link',
        status: 'submitted',
      });
      await submission.save();
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
