import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import User from '@/models/User';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function StudentDashboard() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <div>Please log in to view this page.</div>;
  }

  let userId;
  let user = null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
    const userDoc = await User.findById(decoded.id).select('-passwordHash').lean();
    user = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      rollNumber: userDoc.rollNumber,
      branch: userDoc.branch,
      section: userDoc.section,
      year: userDoc.year,
    };
  } catch (error) {
    return <div>Invalid token. Please log in again.</div>;
  }

  const assignments = await Assignment.find({}).sort({ dueDate: 1 }).lean();
  const submissions = await Submission.find({ student: userId }).lean();
  const submittedAssignmentIds = new Set(submissions.map((s) => s.assignment.toString()));
  const pendingAssignments = assignments.filter(
    (a) => !submittedAssignmentIds.has(a._id.toString())
  );

  const submittedAssignments = submissions.map((submission) => {
    const assignment = assignments.find(
      (a) => a._id.toString() === submission.assignment.toString()
    );
    return { ...submission, assignment };
  });

  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const avgMarks = gradedCount > 0 
    ? (submissions.filter(s => s.marks !== undefined).reduce((sum, s) => sum + s.marks, 0) / gradedCount).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assignment Submission Portal</h1>
          <LogoutButton />
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Student Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Roll Number</p>
                <p className="font-semibold text-gray-800">{user.rollNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-semibold text-gray-800">{user.branch || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-semibold text-gray-800">{user.year ? `${user.year} Year` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="font-semibold text-gray-800">{user.section || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Pending Assignments */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{pendingAssignments.length}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submitted */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Submitted</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{submissions.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Graded */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Graded</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{gradedCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Marks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg. Marks</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{avgMarks}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Assignments Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Assignments</h2>
            {pendingAssignments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No pending assignments. Great job!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 text-gray-800">{assignment.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Pending</span>
                      </div>
                      <Link
                        href={`/student/assignments/${assignment._id}`}
                        className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
                      >
                        Submit Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submitted Assignments Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Submitted Assignments</h2>
            </div>
            {submittedAssignments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No submitted assignments yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submittedAssignments.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{sub.assignment?.title || 'Unknown Assignment'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sub.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.marks !== undefined ? <span className="font-semibold text-gray-800">{sub.marks}</span> : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {sub.feedback || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
