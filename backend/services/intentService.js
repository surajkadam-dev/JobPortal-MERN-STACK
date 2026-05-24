/* ===============================
   🔹 STATUS LIST (From Application Schema)
=============================== */
const statusList = ["pending", "accepted", "rejected", "shortlisted"];

/* ===============================
   🔹 Extract Status
=============================== */
const extractStatus = (message) => {
  const lower = message.toLowerCase();
  return statusList.find(status => lower.includes(status)) || null;
};

/* ===============================
   🔹 Extract City (Dynamic)
=============================== */
const extractCity = (message, availableCities = []) => {
  const lower = message.toLowerCase();
  return availableCities.find(city =>
    lower.includes(city.toLowerCase())
  ) || null;
};

/* ===============================
   🔹 Extract Skill (Dynamic)
=============================== */
const extractSkill = (message, availableSkills = []) => {
  const lower = message.toLowerCase();
  return availableSkills.find(skill =>
    lower.includes(skill.toLowerCase())
  ) || null;
};

/* ===============================
   🔹 ROLE-BASED INTENT CONFIG
=============================== */
const ROLE_INTENT_CONFIG = {

  "Job Seeker": [
    { intent: "applications", patterns: ["application", "status", "progress"] },
    { intent: "interviews", patterns: ["interview", "schedule", "meeting"] },
    { intent: "job_search", patterns: ["job", "opening", "vacancy", "better", "match", "suggest"] }
  ],

  "Employer": [
    { intent: "applications", patterns: ["application", "candidate", "applicants"] },
    { intent: "interviews", patterns: ["interview", "schedule", "meeting"] },
    { intent: "job_management", patterns: ["job", "posted", "my jobs"] }
  ],

  "Admin": [
    { intent: "reports", patterns: ["report", "complaint"] },
    { intent: "analytics", patterns: ["stats", "analytics", "overview", "total"] }
  ]
};

/* ===============================
   🔹 Intent Matching Engine
=============================== */
const matchIntent = (message, role) => {

  const lower = message.toLowerCase();
  const roleRules = ROLE_INTENT_CONFIG[role] || [];

  for (const rule of roleRules) {
    for (const pattern of rule.patterns) {
      if (lower.includes(pattern)) {
        return rule.intent;
      }
    }
  }

  return "general";
};

/* ===============================
   🔹 MAIN DETECT INTENT SERVICE
=============================== */
export const detectIntentService = (
  message,
  role,
  { availableCities = [], availableSkills = [] } = {}
) => {

  const intent = matchIntent(message, role);

  const status = extractStatus(message);
  const city = extractCity(message, availableCities);
  const skill = extractSkill(message, availableSkills);

  let category = null;

  if (intent === "general") {
    if (role === "Job Seeker") category = "career_advice";
    if (role === "Employer") category = "hiring_advice";
    if (role === "Admin") category = "admin_advice";
  }

  return {
    intent,
    subIntent: status,
    category,
    city,
    skill,
    status
  };
};