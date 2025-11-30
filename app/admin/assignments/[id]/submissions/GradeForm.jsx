'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GradeForm({ submission }) {
  const [marks, setMarks] = useState(submission.marks || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGrade = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/submissions/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: submission._id,
          marks: Number(marks),
          feedback,
        }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to grade submission');
      }
    } catch (error) {
      console.error('Error grading:', error);
      alert('Error grading submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGrade} className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
      <h4 className="font-semibold mb-2 text-sm text-gray-700">Grade Submission</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-600">Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1 text-gray-600">Feedback</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded"
      >
        {loading ? 'Saving...' : 'Save Grade'}
      </button>
    </form>
  );
}
