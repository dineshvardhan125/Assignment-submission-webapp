import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

        const notifications = await Notification.find({ recipient: decoded.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
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

        const { id } = await req.json();

        if (id === 'all') {
            await Notification.updateMany(
                { recipient: decoded.id, isRead: false },
                { isRead: true }
            );
        } else {
            await Notification.findByIdAndUpdate(
                { _id: id, recipient: decoded.id },
                { isRead: true }
            );
        }

        return NextResponse.json({ message: 'Notifications updated' });
    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
