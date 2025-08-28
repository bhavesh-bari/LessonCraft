# 📚 LessonCraft ✨

**An intelligent, AI-powered platform designed to empower educators by automating the creation of high-quality teaching materials.**

🔗 **Live Demo:** [LessonCraft](https://lesson-craft-teach.vercel.app/)

---

## 🚀 Project Overview

**LessonCraft** is a full-stack web application built to solve one of the biggest challenges teachers face:  
the enormous amount of time spent on administrative and preparatory tasks.  

By leveraging the power of the **Google Gemini API**, this platform automates the creation of **notes, quizzes, lesson plans, and exam papers**, allowing educators to focus on what they do best: **teaching**.

This project is designed to be a one-stop solution for teachers across all grade levels, from **primary school to university**, providing them with the tools they need to create engaging and effective learning content in seconds.

---

## 🔑 Key Features

Our suite of AI-powered tools is designed to cover every aspect of a teacher's workflow:

- **📝 Notes Generator** – Instantly create structured, Markdown-formatted notes on any topic.  
- **🧠 Topic Summarizer** – Condense long articles or complex topics into concise summaries.  
- **🗓️ Lesson Plan Generator** – Automatically design lesson plans with objectives, activities, and assessments.  
- **🤸 Class Activity Generator** – Brainstorm fun and engaging classroom activities.  
- **🤔 Quiz Maker** – Generate custom quizzes (MCQs, T/F, short answers) and export as PDFs.  
- **✍️ Exam Paper Generator** – Build complete, formatted exam papers based on syllabus and marks.  
- **📜 Work History** – Save, manage, and re-download all generated materials.  
- **🔒 Authentication** – Secure login/signup with **NextAuth (Credentials Provider)**.  
- **⚡ Caching** – Uses **Redis** to cache generated content for faster retrieval.  
- **📄 PDF Export** – Generate downloadable PDFs with **Puppeteer + Chromium** (serverless ready).  

---

## 💻 Tech Stack

| Category             | Technology |
| -------------------- | ---------- |
| **Framework**        | [Next.js](https://nextjs.org/) (App Router) |
| **Styling**          | [Tailwind CSS](https://tailwindcss.com/) |
| **Authentication**   | [NextAuth.js](https://next-auth.js.org/) (Credentials Provider) |
| **AI Engine**        | [Google Gemini API](https://ai.google.dev/) |
| **Database & Cache** | [Redis](https://redis.io/) |
| **PDF Generation**   | Puppeteer + [@sparticuz/chromium](https://github.com/Sparticuz/chromium) |
| **UI Components**    | [Lucide React](https://lucide.dev/) |
| **Markdown Rendering** | `react-markdown` |
| **Deployment**       | [Vercel](https://vercel.com/) |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)  
- npm or yarn  
- Google Gemini API Key  
- Redis instance (local or cloud e.g., Redis Cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhavesh-bari/LessonCraft.git
   cd lessoncraft

2.Install dependencies:
  npm install


3.Set up your environment variables:
Create a .env.local file in the root of your project and add:

GEMINI_API_KEY="YOUR_API_KEY"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="YOUR_REDIS_URL"

4.Run the development server:
npm run dev

Open http://localhost:3000
 with your browser.

📁 Project Structure

lessoncraft/
│── src/
│   ├── app/                # App Router pages & APIs
│   │   ├── api/            # Backend API routes (Gemini, PDF, etc.)
│   │   ├── tools/          # Individual tool pages (Notes, Quiz, etc.)
│   │   ├── layout.js       # Root layout with SEO
│   │   └── page.js         # Homepage/dashboard
│   ├── components/         # Shared components (Navbar, Sidebar, etc.)
│   └── lib/                # Core services & utilities
│       ├── gemini.js       # Gemini API wrapper
│       ├── prompts.js      # AI prompt templates
│       ├── redis.js        # Redis connection
│       └── auth.js         # NextAuth configuration
│
│── public/                 # Static assets
│── .env.local              # Environment variables


👤 Author

Bhavesh Bari
Mail: bhaveshbari0402@gmail.com
LinkedIn: [Bhavesh Bari](https://www.linkedin.com/in/bhavesh-bari/)
