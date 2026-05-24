import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters."],
    maxLength: [30, "Name cannot exceed 30 characters."],
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email."],
  },
 password: { type: String, required: true,
   minLength: [8, "Password must cantain at least 8 chatacters."],},

  phone: {
    type: Number,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  skills: [String],

  education: {
    qualification: String,
    college: String,
    graduationYear: Number,
  },

  experienceLevel: {
    type: String,
    enum: ["Fresher", "Experienced"],
  },

  yearsOfExperience: {
    type: Number,
    default: 0,
  },

  bio: String,

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  resume: {
    public_id: String,
    url: String,
  },

  coverLetter: String,

  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer", "Admin"],
  },

  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  unblockTime: { type: Date, default: null },
  lastBlocked: { type: Date, default: null },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save",async function(next)
{
  if(!this.isModified("password"))
  {
   next() 
  }
  this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.getJWTToken=function()
{
  return jwt.sign({id:this._id},process.env.JWT_KEY,{
    expiresIn:process.env.JWT_EXPIRE
  })
}
userSchema.methods.checkUnblockStatus = function () {
  if (this.isBlocked && this.unblockTime && new Date() >= this.unblockTime) {
    this.isBlocked = false;
    this.unblockTime = null;
    this.lastBlocked=null;
  }
};

export const User = mongoose.model("User", userSchema);