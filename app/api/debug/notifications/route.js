import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

export async function GET() {
    try {
        await connectDB();
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ count: notifications.length, notifications });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
