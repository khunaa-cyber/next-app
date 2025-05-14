import mongoose from "mongoose";

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
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "doctor", "admin"],
    default: "client",
  },

  address: {
    type: String,
  },
  birthdate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Эрэгтэй", "Эмэгтэй", "Бусад"],
  },
  allergies: {
    type: String,
  },
  bloodType: {
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
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
