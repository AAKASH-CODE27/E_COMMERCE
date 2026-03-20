import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

export const registerUser = handleAsyncError(async (req, res, next) => {
  //  export const registerUser = async (req, res) => {

  console.log(req.body);
  console.log(req.files);
  const { name, email, password } = req.body;
  if (!req.files || !req.files.avatar) {
    return next(new HandleError("Avatar is required", 400));
  }

  const avatar = req.files.avatar;
  console.log("Temp path:", avatar.tempFilePath);

  const filePath = path.resolve(avatar.tempFilePath);

  const myCloud = await cloudinary.uploader.upload(filePath, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   user,
  //   token
  // });

  sendToken(user, 201, res); // 4.50
});

// Login

export const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return next(new HandleError("Email cannot be empty", 400));
  }

  if (!password) {
    return next(new HandleError("Password cannot be empty", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid Email or password", 401));
  }
  const isPasswordValid = await user.verifyPassword(password);
  // const isPasswordValid = await userSchema.verifyPassword(password);

  if (!isPasswordValid) {
    return next(new HandleError("Invalid Email or Password", 401));
  }

  const token = user.getJWTToken();

  // res.status(200).json({
  //   success : true,
  //   user,
  //   token
  // })
  sendToken(user, 200, res);
});

// LOG OUT 5.09.00

export const logout = handleAsyncError(async (req, res, next) => {
  (res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  }),
    res.status(200).json({
      success: true,
      message: "Successfully Logged Out",
    }));
});

// Reset Password
// 5.50
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesn't exist", 400));
  }
  let resetToken;

  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // console.log(resetToken);
  } catch (error) {
    console.log(error);
    return next(new HandleError("Couldn't save info, Please try later", 500));
  }

  const resetPasswordURL = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
  // const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
  // console.log(resetPasswordURL)
  // look into this

  const message = `Click below link for resetting your password ${resetPasswordURL}. \n\nThis Link will expire in 30 minutes. Please ignore the message if you didn't request a reset password.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email is sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Failed to send reset email, Please try later", 500),
    );
  }
});

// RESET PASSWORD
export const resetPassword = handleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandleError(
        "Reset Password Token is invalid or has been expired",
        400,
      ),
    );
  }

  // guard against missing body (e.g. client didn't send JSON or form data)
  const { password, confirmPassword } = req.body || {};
  if (!password || !confirmPassword) {
    return next(
      new HandleError("Please provide both password and confirmPassword", 400),
    );
  }

  if (password !== confirmPassword) {
    return next(
      new HandleError("Password does not match Confirm Password", 400),
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// GET USER DETAILS 6.39.00

export const getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//UPDATE PASSWORD 6.46

export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  const checkPasswordMatch = await user.verifyPassword(oldPassword);

  if (!checkPasswordMatch) {
    return next(new HandleError("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//Updating user profile 6.50
export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const updateUserDetails = {
    name,
    email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});

// ADMIN GETTING USER INFORMATION  7.14
export const getUsersList = handleAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//ADMIN GETTING SINGLE USER 7.17
export const getSingleUser = handleAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new HandleError(`User ${id} does not exist`, 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//ADMIN ONLY CHANGE USER ROLE 7.24
export const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const newRole = { role };

  const user = await User.findByIdAndUpdate(req.user.id, newRole, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new HandleError(`User does not Exist`, 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//ADMIN DELETE USER
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new HandleError(`User does not Exist`, 400));
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User Deleted succesfully",
  });
});
