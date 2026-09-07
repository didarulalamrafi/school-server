const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    class: { type: String, default: "" },
    roll: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
