import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken'
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401)); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); 
    req.user = await User.findById(decoded.id);             

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    next(); 
  } catch (err) {
    return next(new ErrorHandler("Invalid token", 401)); 
  }
});
export const checkProfileCompletion = (req, res, next) => {

  if (
    req.user.role === "Job Seeker" &&
    !req.user.profileCompleted
  ) {
    return next(
      new ErrorHandler(
        "Please complete your profile before applying.",
        400
      )
    );
  }

  next();
};


export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) { 
      return next(
        new ErrorHandler(`${req.user?.role || "User"} not allowed to access this resource.`, 403)
      );
    }
    
    next();
  };
};
