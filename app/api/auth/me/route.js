import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db';
import User from '@/models/User';

<<<<<<< HEAD
=======
export const dynamic = 'force-dynamic';

>>>>>>> friend/main
export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
<<<<<<< HEAD
      
=======

>>>>>>> friend/main
      if (!user) {
        return NextResponse.json({ user: null });
      }

      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rollNumber: user.rollNumber,
          branch: user.branch,
          section: user.section,
<<<<<<< HEAD
          year: user.year,
=======
          section: user.section,
          year: user.year,
          avatar: user.avatar,
>>>>>>> friend/main
        },
      });
    } catch (error) {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
