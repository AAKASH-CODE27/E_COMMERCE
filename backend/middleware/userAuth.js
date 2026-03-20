import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";

// 4.55.00
export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  //console.log(token);

  if (!token) {
    return next(new HandleError("Authentication is missing !", 401));
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //console.log(decodeData);

  req.user = await User.findById(decodeData.id);
  next();
});

//5.18.00

export const roleBasedAccess = (...roles) =>{
  return(req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new HandleError(`Role - ${req.user.role} is not allowed to access the resource`,403))
    }

    next();
  }
}
