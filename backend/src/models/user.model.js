import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// We can use bcrypt to hash the password here with the help of schema.pre or do it in the controller itself when the controller is invoked.

const User = mongoose.model("User", userSchema);
export default User;
