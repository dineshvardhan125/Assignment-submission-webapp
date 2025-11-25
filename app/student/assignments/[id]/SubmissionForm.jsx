'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmissionForm({ assignmentId, existingSubmission }) {
  const [submissionType, setSubmissionType] = useState(existingSubmission?.submissionType || 'link');
  const [fileUrl, setFileUrl] = useState(existingSubmission?.fileUrl || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('File upload failed');
      }

      const data = await res.json();
      setFileUrl(data.fileUrl);
      setMessage('File uploaded successfully. Click Submit to finish.');
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentId, fileUrl, submissionType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit assignment');
      }

      setMessage('Assignment submitted successfully!');
      router.refresh();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {existingSubmission ? 'Update Submission' : 'Submit Assignment'}
      </h2>
      
      {message && (
        <div className={`px-4 py-3 rounded mb-4 ${
          message.includes('success') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSubmissionType('link')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            submissionType === 'link'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Submit Link
        </button>
        <button
          onClick={() => setSubmissionType('file')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            submissionType === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upload File
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submissionType === 'link' ? (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUrl">
              File URL (Google Drive, GitHub, etc.)
            </label>
            <input
              type="url"
              id="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required={submissionType === 'link'}
              disabled={existingSubmission?.status === 'graded'}
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileUpload">
              Upload PDF or Image
            </label>
            <input
              type="file"
              id="fileUpload"
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={existingSubmission?.status === 'graded'}
            />
            {fileUrl && submissionType === 'file' && (
              <p className="text-sm text-green-600 mt-2">File ready to submit: {fileUrl.split('/').pop()}</p>
            )}
          </div>
        )}

        {existingSubmission?.status === 'graded' ? (
          <p className="text-gray-500 italic">This assignment has been graded and cannot be resubmitted.</p>
        ) : (
          <button
            type="submit"
            disabled={loading || (submissionType === 'file' && !fileUrl)}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading || (submissionType === 'file' && !fileUrl) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : (existingSubmission ? 'Update Submission' : 'Submit')}
          </button>
        )}
      </form>
    </div>
  );
}
