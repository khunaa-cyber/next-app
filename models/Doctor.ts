import mongoose from "mongoose"

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
  education: {
    type: String,
  },
  specialization: {
    type: String,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  schedule: {
    type: String,
  },
  languages: {
    type: String,
  },
  services: [
    {
      type: String,
    },
  ],
  branch: {
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

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema)
