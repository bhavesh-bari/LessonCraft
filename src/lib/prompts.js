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
  You are an expert educator and instructional designer.
  Create a **detailed, structured lesson plan** for teaching the topic "${topic}" in the subject "${subject}".
  
  **Student Level**: ${level} (Beginner / Intermediate / Advanced)

  **Additional Requirement**:
  - Estimate the **total time required** to teach this topic in hours.
  - Suggest the **number of lectures/sessions** needed (assume each lecture is around 1 hour unless specified otherwise).

  **Lesson Plan Requirements**:
  1. **Title & Basic Info**
     - Lesson Title
     - Subject
     - Topic
     - Estimated Total Hours Required
     - Estimated Number of Lectures
     - Target Student Level
  2. **Learning Objectives**
     - 3–6 clear, measurable learning outcomes.
  3. **Prerequisites**
     - List prior knowledge or skills students should have.
  4. **Materials Needed**
     - Bullet list of resources, tools, or equipment needed.
  5. **Lesson Outline**
     - Break down the session into time-bound sections (Introduction, Explanation, Practice, Recap).
     - For each section, include: purpose, teacher actions, and student actions.
  6. **Teaching Strategies**
     - Describe teaching methods (lecture, demonstration, discussion, group work, hands-on practice).
  7. **Step-by-Step Teaching Plan**
     - Detailed sequence of teaching steps with timings.
     - Include examples, analogies, or diagrams where applicable.
  8. **Activities / Practice**
     - 1–3 interactive exercises or activities.
  9. **Assessment**
     - How understanding will be checked during and after class.
  10. **Homework / Follow-Up**
      - At least one task to reinforce learning.
  11. **Real-World Applications**
      - Explain how the concept is used in real-world scenarios.
  12. **Recap & Reflection**
      - Summary of key points and possible student questions.

  **Formatting Rules**:
  - Use Markdown headings (#, ##, ###) for structure.
  - Use bullet points (-) and numbered lists for clarity.
  - Use bold for important terms.
  - Keep the tone engaging, clear, and ready to use in class.

  **Goal**:
  The output should be ready for a teacher to use directly, with a clear plan and realistic time estimate.
`;


