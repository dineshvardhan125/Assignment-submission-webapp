import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { avatar } = body;

        if (!avatar) {
            return NextResponse.json(
                { message: 'Avatar is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { avatar },
            { new: true }
        ).select('-passwordHash');

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
