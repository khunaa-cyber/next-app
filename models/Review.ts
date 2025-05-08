import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);