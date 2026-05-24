import Groq from "groq-sdk";
import { detectIntentService } from "../services/intentService.js";
import { jobSeekerHandler } from "../handlers/jobSeekerHandler.js";
import { employerHandler } from "../handlers/employerHandler.js";
import { adminHandler } from "../handlers/adminHandler.js";
import { Job } from "../models/jobSchema.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    /* ==============================
       🔹 Dynamic Data For Intent Detection
    ============================== */

    const availableCities = await Job.distinct("location");
    const availableSkills = await Job.distinct("requiredSkills");

    const intentData = detectIntentService(
      message,
      user.role,
      { availableCities, availableSkills }
    );

    /* ==============================
       🔹 Role-Based Handler Routing
    ============================== */

    let contextData = "";

    if (user.role === "Job Seeker") {
      contextData = await jobSeekerHandler({ intentData, user });
    }
    else if (user.role === "Employer") {
      contextData = await employerHandler({ intentData, user });
    }
    else if (user.role === "Admin") {
      contextData = await adminHandler({ intentData, user });
    }

    /* ==============================
       🔹 Create Groq Instance (Safe)
    ============================== */

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    /* ==============================
       🔹 AI Request
    ============================== */

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
  content: `
You are a friendly and professional AI assistant for a Job Portal system.

User Role: ${user.role}

Guidelines:
- Use ONLY the provided context.
- Do NOT invent information.
- Speak naturally like a helpful career assistant.
- Avoid bullet points unless necessary.
- Convert structured data into smooth conversational sentences.
- Add mild encouragement and supportive tone when appropriate.
- Keep response under 150 words.

Context:
${contextData}
`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    return res.status(200).json({
      success: true,
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI service unavailable"
    });
  }
};