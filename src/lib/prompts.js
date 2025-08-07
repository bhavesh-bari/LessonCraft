// src/lib/prompts.js

export const summarizerPrompt = (topic, subject) => `
  You are an expert teacher creating educational content.
  Generate a clear and concise summary on the topic "${topic}" for the subject "${subject}".
  
  **IMPORTANT**: Format your entire response using Markdown. 
  Use headings, subheadings, bold text, and bullet points to structure the information logically and make it easy to read.
`;
export const classActivityPrompt = (topic, subject, activityType) => `
  You are a creative and experienced educator designing classroom activities.
  Generate 3 distinct and engaging classroom activity ideas for the subject "${subject}" on the topic "${topic}".
  
  If the user specified an activity type, focus on that: "${activityType}". Otherwise, provide a variety.

  **IMPORTANT**: Your response MUST be a valid JSON array of objects. Do not include any text or formatting outside of the JSON array.
  Each object in the array must have the following structure:
  {
    "title": "Creative name for the activity",
    "icon": "A relevant icon name from this list: 'FlaskConical', 'Drama', 'UsersRound', 'MessageCircle'",
    "description": "A short, clear paragraph explaining the activity.",
    "duration": "Estimated time, e.g., '15 mins'",
    "groupSize": "e.g., 'Pairs', 'Small Groups', 'Individual'",
    "color": "A relevant color name from this list: 'blue', 'purple', 'orange', 'green'"
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
    `  - Question ${index + 1}: ${q.text || 'Generate a suitable question.'} (Marks: ${q.marks || 'auto'})`
  ).join('\n');

  return `
    You are an expert academic responsible for creating a formal examination paper.
    Your task is to generate a complete exam paper based on the following specifications.

    **Specifications:**
    - **Subject:** ${subject}
    - **Syllabus/Topics to Cover:** ${syllabus}
    - **Total Marks:** ${totalMarks}
    - **Duration:** ${duration}

    **Paper Structure to Follow:**
    You must adhere to this structure exactly:
${questionStructure}

    **Instructions:**
    1.  Generate relevant and high-quality questions for each point in the structure based on the provided syllabus.
    2.  If a question's text is provided, use it. If it's empty, create an appropriate question.
    3.  Ensure the marks for each question are reasonable and the total adds up to ${totalMarks}.
    4.  The final output MUST be a valid JSON object. Do not include any text or formatting outside of the JSON object.

    **Required JSON Output Structure:**
    {
      "header": {
        "university": "TechGenAI University",
        "subject": "${subject}",
        "marks": "${totalMarks}",
        "duration": "${duration}"
      },
      "questions": [
        {
          "q_num": 1,
          "text": "Generated question text here...",
          "marks": 7
        },
        {
          "q_num": 2,
          "text": "Generated question text here...",
          "marks": 7
        }
      ]
    }
  `;
};
