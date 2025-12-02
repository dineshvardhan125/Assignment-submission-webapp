import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const _id = new mongoose.Types.ObjectId(id);

    const files = await bucket.find({ _id }).toArray();
    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    const file = files[0];
    const stream = bucket.openDownloadStream(_id);

    // Create a ReadableStream from the GridFS stream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
