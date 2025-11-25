import connectDB from '@/lib/db';
import User from '@/models/User';
import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import NewAssignmentForm from './NewAssignmentForm';

export default async function NewAssignmentPage() {
  await connectDB();

  // Get user info
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userDoc = await User.findById(decoded.id).select('-passwordHash').lean();
      if (userDoc) {
        user = {
          id: userDoc._id.toString(),
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
        };
      }
    } catch (error) {
      console.error('Token error:', error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Assignment</h1>
          <LogoutButton />
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <NewAssignmentForm />
          </div>
        </div>
      </div>
    </div>
  );
}
