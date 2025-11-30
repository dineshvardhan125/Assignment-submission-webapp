import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  submissionType: {
    type: String,
    enum: ['link', 'file'],
    default: 'link',
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted',
  },
  marks: {
    type: Number,
  },
  feedback: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
