import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  feedbackType: { 
    type: String, 
    enum: ['suggestion', 'complaint', 'question', 'praise'], 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);