import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const submissions = await Submission.find({ student: user.id })
            .populate('assignment', 'title subject totalMarks')
            .sort({ createdAt: -1 });

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error('Error fetching student submissions:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
