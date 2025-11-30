import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import User from '@/models/User';
import Assignment from '@/models/Assignment';

export async function GET() {
    try {
        await connectDB();

        // Find a student
        const student = await User.findOne({ role: 'student' });
        if (!student) {
            return NextResponse.json({ error: 'No student found' });
        }

        // Find an assignment (or create a dummy ID)
        const assignment = await Assignment.findOne({});
        const assignmentId = assignment ? assignment._id : student._id; // Fallback

        const notification = new Notification({
            recipient: student._id,
            message: 'Test notification',
            type: 'assignment',
            relatedId: assignmentId,
        });

        await notification.save();

        return NextResponse.json({ success: true, notification });
    } catch (error) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
