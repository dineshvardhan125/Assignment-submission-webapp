import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function getCurrentUser() {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const user = await User.findById(decoded.id).select('-passwordHash');

            if (!user) {
                return null;
            }

            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                avatar: user.avatar,
                year: user.year,
                branch: user.branch,
                section: user.section,
                rollNumber: user.rollNumber,
            };
        } catch (error) {
            return null;
        }
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}
