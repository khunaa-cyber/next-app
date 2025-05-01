import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  price: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  benefits: [
    {
      type: String,
    },
  ],
  recommendedFrequency: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema)
