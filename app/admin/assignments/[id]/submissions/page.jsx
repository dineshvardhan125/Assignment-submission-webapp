import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import User from '@/models/User';
import GradeForm from './GradeForm';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function AdminSubmissionsPage({ params }) {
  const { id } = await params;
  await connectDB();

  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    notFound();
  }

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

  const submissions = await Submission.find({ assignment: id })
    .populate('student', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  // Serialize for client component
  const serializedSubmissions = submissions.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    assignment: sub.assignment.toString(),
    student: {
      ...sub.student,
      _id: sub.student._id.toString(),
    },
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assignment Submissions</h1>
          <LogoutButton />
        </div>

        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Submissions for: {assignment.title}</h1>
            <p className="text-gray-600 mb-8">Total Submissions: {submissions.length}</p>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serializedSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No submissions yet.
                      </td>
                    </tr>
                  ) : (
                    serializedSubmissions.map((submission) => (
                      <tr key={submission._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{submission.student?.name}</div>
                          <div className="text-sm text-gray-500">{submission.student?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={submission.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            View File
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.status}
                          </span>
                          {submission.status === 'graded' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Marks: {submission.marks}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <GradeForm submission={submission} />
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
