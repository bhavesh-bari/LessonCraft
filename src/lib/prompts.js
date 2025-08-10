// src/lib/prompts.js

export const summarizerPrompt = (topic, subject) => `
  You are an expert teacher creating educational content.
  Generate a clear and concise summary on the topic "${topic}" for the subject "${subject}".

  **Formatting Rules**:
  - Use Markdown syntax for headings (#, ##, ###).
  - After every heading or subheading, leave one blank line before continuing the content.
  - Use user-centric, visually appealing bullet points where suitable:
    - Standard bullets: "-" 
    - Numbered lists for sequences.
    - Checkboxes for tasks: "- [ ]" or "- [x]" (GFM supported).
    - Emojis for emphasis: 📌, 💡, ✅, 🔹 (use sparingly for clarity).
  - Ensure lists are neatly indented and readable.

  **Goal**:
  Create content that is engaging, easy to scan, and visually pleasant when rendered in a UI using ReactMarkdown + remarkGfm.
`;
export const classActivityPrompt = (topic, subject, activityType) => `
  You are a creative and experienced educator designing classroom activities.
  Generate 3 distinct and engaging classroom activity ideas for the subject "${subject}" on the topic "${topic}".

  If the user specified an activity type, focus on that: "${activityType}". Otherwise, provide a variety.

  **IMPORTANT**: 
  - Your response MUST be a valid JSON array of exactly 3 objects.
  - Do NOT include any text, explanations, or formatting outside of the JSON array.
  - Each object must follow this structure exactly:
    {
      "title": "Creative name for the activity",
      "icon": "One of: FlaskConical, Drama, UsersRound, MessageCircle",
      "description": "A short, clear paragraph explaining the activity.",
      "duration": "Estimated time, e.g., '15 mins'",
      "groupSize": "e.g., 'Pairs', 'Groups', 'Individual'",
      "color": "One of: red, purple, yellow, green",
      "details": {
        "steps": "Numbered list in plain text, e.g., '1. First step\\n2. Second step'",
        "learningObjectives": "Bullet points in plain text, e.g., '- Objective 1\\n- Objective 2'",
        "materialsNeeded": "Bullet points in plain text, e.g., '- Item 1\\n- Item 2'",
        "assessment": "Bullet points in plain text, e.g., '- Method 1\\n- Method 2'",
        "notes": "Any additional notes or tips for the teacher.",
        "example": "An example of how the activity might look in practice.",
        "relatedResources": "Links to any related resources or materials like youtube video link or any content on google that's link or any lecture link of that topic."
      }
    }
`;
export const quizMakerPrompt = (subject, topic, numQuestions, questionType, difficulty) => {
  const difficultyMap = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };

  return `
    You are an expert educator and quiz creator.
    Generate a quiz with exactly ${numQuestions} questions for the subject "${subject}" on the topic "${topic}".
    The question type should be "${questionType}".
    The difficulty level should be "${difficultyMap[difficulty]}".

    **IMPORTANT**: Your response MUST be a valid JSON array of objects. Do not include any text or formatting outside of the JSON array.
    Each object in the array must have the following structure:
    {
      "question": "The question text.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text."
    }
  `;
};
export const notesGeneratorPrompt = (subject, topic) => `
  You are an expert educator and content creator tasked with generating comprehensive teaching notes.
  Your goal is to create a detailed, well-structured document (at least 10 pages long if printed) on the topic "${topic}" for the subject "${subject}".

  **IMPORTANT**: Your entire response must be formatted in Markdown.
  
  Please structure the notes with the following sections:
  - A main title (H1).
  - An introduction to the topic.
  - Multiple sections with clear subheadings (H2).
  - Use bullet points, bold text, and numbered lists to break down complex information.
  - Include key definitions, examples, and a concluding summary.
  - Ensure the content is accurate, easy to understand, and suitable for a high school or early college level.
`;
export const examPaperPrompt = (subject, syllabus, totalMarks, duration, questions) => {
  const questionStructure = questions.map((q, index) =>
    `- Question ${index + 1}:
       main_question: ${q.text || 'Generate a suitable main question based on the syllabus.'}
       marks: ${q.marks || 'auto'}
       sub_questions: ${q.subQuestions && q.subQuestions.length > 0
         ? q.subQuestions.map((sq, sqIndex) =>
             `(${String.fromCharCode(97 + sqIndex)}) ${sq.text || 'Generate a subquestion.'} (Marks: ${sq.marks || 'auto'})`
           ).join('\n         ')
         : 'Generate 2–4 relevant subquestions with reasonable marks each.'}`
  ).join('\n');

  return `
You are an expert academic responsible for creating a formal, well-structured examination paper.

## Specifications
- Subject: ${subject}
- Syllabus / Topics to Cover: ${syllabus}
- Total Marks: ${totalMarks}
- Duration: ${duration}

## Paper Structure
You must follow exactly this structure for each question:${questionStructure}

## Rules
1. For each question, create a "main_question" and a "sub_questions" array.
2. Each subquestion must be a **separate object** with:
   - "label": "a", "b", "c"... (sequential letters)
   - "text": the subquestion text
   - "marks": numeric marks for that subquestion
3. If any text is provided in the input, use it as given; otherwise, generate it based on the syllabus.
4. The sum of all marks (main + subquestions) must equal ${totalMarks}.
5. Ensure coverage of the entire syllabus across questions.
6. Avoid merging subquestions into a single paragraph; each must be separate in the JSON.
7. The final output **MUST** be valid JSON only — no markdown, comments, or extra text.

## Required JSON Output Structure
{
  "header": {
    "university": "TechGenAI University",
    "subject": "${subject}",
    "marks": ${totalMarks},
    "duration": "${duration}"
  },
  "questions": [
    {
      "q_num": 1,
      // main question text contain some instruction solve any two subquestions to get 10 marks approprite structure give 
      "main_question": "Main question text...",
      "marks": 10,
      "sub_questions": [
      // it like any two subquestions solve to get 10 marks
        { "label": "a", "text": "First subquestion text...", "marks": 5 },
        { "label": "b", "text": "Second subquestion text...", "marks": 5 },
         {"label": "c", "text": "Third subquestion text...", "marks": 5}
      ]
    }
  ]
}
`;
};
export const lessonPlanPrompt = (topic, subject, level) => `
  You are an expert educator and instructional designer creating a detailed, structured lesson plan.

  ## Specifications
  - Subject: ${subject}
  - Topic: ${topic}
  - Student Level: ${level}

  ## Rules
  1. Generate a complete lesson plan with all the sections listed in the required JSON structure.
  2. Estimate the total hours and number of lectures needed.
  3. The content must be clear, actionable, and appropriate for the specified student level.
  4. The final output **MUST** be a valid JSON object only — no markdown, comments, or extra text outside of the JSON structure.

  ## Required JSON Output Structure
  {
    "lessonTitle": "A creative and descriptive title for the lesson",
    "subject": "${subject}",
    "topic": "${topic}",
    "estimatedTotalHours": "e.g., 2 hours",
    "estimatedNumLectures": "e.g., 2 lectures",
    "targetStudentLevel": "${level}",
    "learningObjectives": [
      "First clear, measurable learning outcome.",
      "Second clear, measurable learning outcome.",
      "Third clear, measurable learning outcome."
    ],
    "prerequisites": [
      "A list of prior knowledge or skills students should have."
    ],
    "materialsNeeded": [
      "A bulleted list of all resources, tools, or equipment needed."
    ],
    "lessonOutline": [
      {
        "section": "Introduction",
        "time": "e.g., 10 minutes",
        "purpose": "Brief purpose of this section.",
        "teacherActions": "What the teacher does during this section.",
        "studentActions": "What the students are expected to do."
      },
      {
        "section": "Core Explanation",
        "time": "e.g., 25 minutes",
        "purpose": "Brief purpose of this section.",
        "teacherActions": "What the teacher does during this section.",
        "studentActions": "What the students are expected to do."
      }
    ],
    "teachingStrategies": [
      "Primary teaching method (e.g., Interactive Lecture)",
      "Secondary method (e.g., Group Work)"
    ],
    {
  "stepByStepPlan": [
    {
  // Each lecture should have a clear structure steps means what they teach(description) in particular timing slot(first 15 minutes, next 20 minutes etc)
      "lecture": "Lecture 1",
      "description": "A brief description of the lecture content.",
      "slots": [
        {
          "slot": 1,
          "timing": "e.g., 5 minutes",
          "description": "Detailed description of the first teaching step."
        },
        {
          "slot": 2,
          "timing": "e.g., 15 minutes",
          "description": "Detailed description of the second teaching step."
        }
      ]
    },
    {
      "lecture": "Lecture 2",
      "description": "A brief description of the lecture content.",
      "slots": [
        {
          "slot": 1,
          "timing": "e.g., 5 minutes",
          "description": "Detailed description of the first teaching step."
        },
        {
          "slot": 2,
          "timing": "e.g., 15 minutes",
          "description": "Detailed description of the second teaching step."
        }
      ]
    }
  ]
}

    "activities": [
      {
        "title": "Name of the primary interactive activity",
        "description": "A short description of the activity."
      }
    ],  
    "assessmentMethods": {
      "formative":"Formative assessment techniques (e.g., quizzes, discussions)",
      "summative":"Summative assessment methods (e.g., tests, projects)"
    }
      
    ,
    "homework": [
  "First specific follow-up task to reinforce learning.",
  "Second optional reinforcement task."
  //minimum 5 tasks
],
recapAndReflection:{
              summary: "A summary of the key points covered in the lesson.",
              reflectionQuestions: [
                "First question to prompt student reflection.",
                "Second question to prompt student reflection."
                // add more as needed
              ]
}
  }
`;



