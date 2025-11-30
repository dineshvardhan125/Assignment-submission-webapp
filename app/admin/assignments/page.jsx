import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import Sidebar from '@/components/Sidebar';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminAssignmentsPage() {
  await connectDB();

  // Get user info
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userDoc = await User.findById(decoded.id).select('-passwordHash').lean();
      user = {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
      };
    } catch (error) {
      console.error('Token error:', error);
    }
  }

  const assignments = await Assignment.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Assignments</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/assignments/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Create Assignment
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">All Assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No assignments found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    assignments.map((assignment) => (
                      <tr key={assignment._id.toString()} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.subject || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.year || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/assignments/${assignment._id}/submissions`} className="text-indigo-600 hover:text-indigo-900">
                            View Submissions
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
