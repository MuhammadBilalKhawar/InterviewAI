const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for OAuth users
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // OAuth fields
    googleId: { type: String, sparse: true, unique: true },
    githubId: { type: String, sparse: true, unique: true },
    avatar: { type: String }, // Profile picture URL
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    // User interests for question recommendations
    interests: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only hash password if it exists and is modified (for local auth)
  if (!this.password || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
