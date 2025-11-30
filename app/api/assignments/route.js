import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
<<<<<<< HEAD
=======
import Notification from '@/models/Notification';
import User from '@/models/User';
>>>>>>> friend/main
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await connectDB();
<<<<<<< HEAD
    const assignments = await Assignment.find({}).sort({ createdAt: -1 });
=======

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

    let query = {};
    if (decoded.role === 'student') {
      const user = await User.findById(decoded.id);
      if (user && user.year) {
        query.year = user.year;
      }
    }

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
>>>>>>> friend/main
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

<<<<<<< HEAD
    const { title, description, dueDate, subject, year } = await req.json();
=======
    const { title, description, dueDate, subject, year, totalMarks } = await req.json();
>>>>>>> friend/main

    if (!title || !dueDate) {
      return NextResponse.json(
        { message: 'Title and Due Date are required' },
        { status: 400 }
      );
    }

    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      subject,
      year,
<<<<<<< HEAD
=======
      totalMarks: parseInt(totalMarks) || 100,
>>>>>>> friend/main
      createdBy: decoded.id,
    });

    await newAssignment.save();

<<<<<<< HEAD
=======
    // Create notifications for students
    const query = { role: 'student' };
    if (year) {
      query.year = year;
    }

    const students = await User.find(query);

    const notifications = students.map(student => ({
      recipient: student._id,
      message: `New assignment: ${title}`,
      type: 'assignment',
      relatedId: newAssignment._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

>>>>>>> friend/main
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
