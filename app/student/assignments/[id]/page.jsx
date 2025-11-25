import connectDB from '@/lib/db';
import Assignment from '@/models/Assignment';
import Submission from '@/models/Submission';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import SubmissionForm from './SubmissionForm';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';
import User from '@/models/User';

export default async function AssignmentDetailsPage({ params }) {
  const { id } = await params;
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let userId;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      const userDoc = await User.findById(userId).select('-passwordHash').lean();
      if (userDoc) {
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
      }
    } catch (error) {
      // Handle invalid token if needed, or let middleware handle it
    }
  }

  const assignment = await Assignment.findById(id).lean();

  if (!assignment) {
    notFound();
  }

  // Fetch existing submission
  let submission = null;
  if (userId) {
    submission = await Submission.findOne({
      assignment: id,
      student: userId,
    }).lean();
  }

  // Serialize dates and ObjectIds to pass to client component
  const serializedSubmission = submission ? {
    ...submission,
    _id: submission._id.toString(),
    assignment: submission.assignment.toString(),
    student: submission.student.toString(),
    submissionType: submission.submissionType || 'link',
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
  } : null;

  const isPdf = submission?.fileUrl?.toLowerCase().endsWith('.pdf');
  const isImage = submission?.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assignment Details</h1>
          <LogoutButton />
        </div>

        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{assignment.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Subject: {assignment.subject || 'N/A'}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Year: {assignment.year || 'N/A'}
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
              </div>
              
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {assignment.description}
              </div>
            </div>

            {submission && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Submission Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${
                      submission.status === 'graded' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted On</p>
                    <p className="font-medium text-gray-800">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Submission</p>
                    {submission.submissionType === 'file' ? (
                      <div className="mt-2">
                        <a 
                          href={submission.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center mb-2"
                        >
                          View File <span className="ml-1">↗</span>
                        </a>
                        {isPdf && (
                          <iframe 
                            src={submission.fileUrl} 
                            className="w-full h-96 border rounded"
                            title="Submission PDF"
                          />
                        )}
                        {isImage && (
                          <img 
                            src={submission.fileUrl} 
                            alt="Submission" 
                            className="max-w-full h-auto rounded border"
                          />
                        )}
                      </div>
                    ) : (
                      <a 
                        href={submission.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {submission.fileUrl}
                      </a>
                    )}
                  </div>
                  {submission.marks !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500">Marks</p>
                      <p className="font-bold text-gray-800">{submission.marks}</p>
                    </div>
                  )}
                  {submission.feedback && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Feedback</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded mt-1">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <SubmissionForm 
              assignmentId={id} 
              existingSubmission={serializedSubmission} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
