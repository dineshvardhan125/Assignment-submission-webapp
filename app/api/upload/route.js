import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    await connectDB();
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');
    
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
    });

    const uploadPromise = new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    uploadStream.end(buffer);
    await uploadPromise;

    const fileUrl = `/api/files/${uploadStream.id}`;

    return NextResponse.json({ fileUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
