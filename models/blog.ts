import mongoose, { Schema } from 'mongoose'

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
)

export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)


