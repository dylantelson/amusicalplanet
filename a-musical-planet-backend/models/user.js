import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  displayName: {
    type: String,
    default: "User",
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  maxScores: {
    type: mongoose.SchemaTypes.Mixed,
  },
});

export default mongoose.model("User", userSchema);
