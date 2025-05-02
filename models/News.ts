import mongoose from "mongoose"

const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String,
})

export default mongoose.models.News || mongoose.model("News", NewsSchema)
