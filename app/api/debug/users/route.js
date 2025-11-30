import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}, 'name email role year');
        return NextResponse.json({ count: users.length, users });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
