import mongoose from "mongoose"

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Хүлээгдэж буй", "Баталгаажсан", "Дууссан", "Цуцалсан"],
    default: "Хүлээгдэж буй",
  },
  cost: {
    type: String,
  },
  notes: {
    type: String,
  },
  diagnosis: {
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

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema)