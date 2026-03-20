import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name"],
      maxLength: [25, "Invalid name. Name should not exceed 25 character"],
      minLength: [3, "Invalid name. Name should be minimum 3 Character"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email"],
      unique: true,
      validate: [validator.isEmail, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter your name"],
      minLength: [3, "Invalid password. Name should be minimum 6 Character"],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    //     createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   } fine
  },
  { timestamps: true },
);

// Password hashing
userSchema.pre("save", async function () {
  // Skip hashing if password hasn't changed
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.verifyPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(
    String(userEnteredPassword),
    String(this.password),
  );
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // console.log(resetPasswordToken);

  console.log("Raw reset token:", resetToken);
console.log("Hashed token stored:", this.resetPasswordToken);
  this.resetPasswordExpire = Date.now() + 120 * 60 * 1000; // 30 min * sec*ms
  return resetToken;
};
export default mongoose.model("User", userSchema);
