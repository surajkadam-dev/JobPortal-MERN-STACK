import express from 'express'
import os from "os"
import { config } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connection } from './database/connection.js';
import { errorMiddleWare } from './middleware/error.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import validationRoutes from './routes/validation.js';

import adminRoutes from "./routes/adminRutes.js"
import applicationRouter from './routes/applicationRouter.js'
import interviewRouter from './routes/interviewRouter.js'
import reportRoute from "./routes/reportRoutes.js"
import aiRoutes from "./routes/aiRoutes.js";

import { newsLetterCron } from './automation/newsLetterCron.js';
import { scheduleJobDeletion } from './automation/cronJobs.js';

 const app=express()
 config({
  path:'./config/config.env'
 })


 app.use(cors(
  {
origin:[process.env.FRONTEND_URL],
methods:["GET","POST","PUT","DELETE"],
credentials:true
  }
 ));
 app.options('*', cors());


 app.use(cookieParser());
 app.use(express.json());
 app.use(express.urlencoded({extended:true}))
 app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: "/temp/"
 }))

 app.use("/api/v1/user",userRouter)
 app.use("/api/v1/job",jobRouter)
 app.use("/api/v1/application",applicationRouter)
 app.use("/api/v1/interview",interviewRouter)
 app.use("/api/v1/admin",adminRoutes)
 app.use("/api/v1",reportRoute)
 app.use('/api/v1', validationRoutes);
 app.use('/api/v1/ai',aiRoutes);
 newsLetterCron();
 scheduleJobDeletion();
 connection();

 app.use(errorMiddleWare)

 export default app;