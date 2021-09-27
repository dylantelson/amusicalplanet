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
  stats: {
    maxScores: {
      type: mongoose.SchemaTypes.Mixed,
    },
    averageScores: {
      type: mongoose.SchemaTypes.Mixed,
    },
    completedGames: {
      type: mongoose.SchemaTypes.Mixed,
    },
  },
  profilePicture: {
    type: String,
    default: "/defaultavatar.png",
  },
  country: {
    type: String,
    default: "US",
  },
});

export default mongoose.model("User", userSchema);
