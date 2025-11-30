import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  rollNumber: {
    type: String,
  },
  branch: {
    type: String,
  },
  section: {
    type: String,
  },
  year: {
    type: String,
  },
  avatar: {
    type: String,
    default: 'adventurer-neutral', // Default avatar style
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
