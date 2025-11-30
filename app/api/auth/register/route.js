import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log('Registration Request Body:', body);
<<<<<<< HEAD
    const { name, email, password, role, adminSecret, rollNumber, branch, section, year } = body;
=======
    const { name, email, password, role, adminSecret, rollNumber, branch, section, year, avatar } = body;
>>>>>>> friend/main

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate admin secret if user is trying to register as admin
    if (role === 'admin') {
      if (!adminSecret) {
        return NextResponse.json(
          { message: 'Admin secret is required to register as admin' },
          { status: 400 }
        );
      }

      if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { message: 'Invalid admin secret' },
          { status: 403 }
        );
      }
    } else {
      // Validate student details
      if (!rollNumber || !branch || !section || !year) {
        return NextResponse.json(
          { message: 'Roll number, branch, section, and year are required for students' },
          { status: 400 }
        );
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'student',
      rollNumber: role !== 'admin' ? rollNumber : undefined,
      branch: role !== 'admin' ? branch : undefined,
      section: role !== 'admin' ? section : undefined,
      year: role !== 'admin' ? year : undefined,
<<<<<<< HEAD
=======
      avatar: avatar || 'adventurer-neutral',
>>>>>>> friend/main
    });

    console.log('Creating User:', newUser);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          rollNumber: newUser.rollNumber,
          branch: newUser.branch,
          section: newUser.section,
          year: newUser.year,
<<<<<<< HEAD
=======
          avatar: newUser.avatar,
>>>>>>> friend/main
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
