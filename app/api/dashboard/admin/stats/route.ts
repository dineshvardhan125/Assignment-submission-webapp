import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
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
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // @ts-ignore
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const totalUsers = await User.countDocuments({ role: 'student' });
        const activeAssignments = await Assignment.countDocuments({});
        const totalSubmissions = await Submission.countDocuments({});
        const pendingReview = await Submission.countDocuments({ status: 'submitted' });

        // Overview Data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const overviewData = await Submission.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing days with 0
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];
            const found = overviewData.find(item => item._id === dateString);
            chartData.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                total: found ? found.count : 0
            });
        }

        // Recent Activity (Last 5 submissions)
        const recentActivity = await Submission.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('student', 'name')
            .populate('assignment', 'title')
            .lean();

        const formattedActivity = recentActivity.map(sub => ({
            _id: sub._id,
            // @ts-ignore
            user: sub.student?.name || 'Unknown User',
            // @ts-ignore
            action: `submitted "${sub.assignment?.title || 'Unknown Assignment'}"`,
            time: sub.createdAt
        }));

        return NextResponse.json({
            totalUsers,
            activeAssignments,
            totalSubmissions,
            pendingReview,
            overview: chartData,
            recentActivity: formattedActivity
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
