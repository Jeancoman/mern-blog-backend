import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../types";

const UserSchema = new mongoose.Schema<User>({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    default: "Anonymous User",
  },
  profileImageUrl: String,
  password: String,
  userType: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    }

    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
