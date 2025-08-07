# LessonCraft AI ✨

**An intelligent, AI-powered platform designed to empower educators by automating the creation of high-quality teaching materials.**

---

## 🚀 Project Overview

**LessonCraft AI** is a full-stack web application built to solve one of the biggest challenges teachers face: the enormous amount of time spent on administrative and preparatory tasks. By leveraging the power of Google's Gemini API, this platform automates the creation of notes, quizzes, lesson plans, and more, allowing educators to focus on what they do best: teaching.

This project is designed to be a one-stop solution for teachers across all grade levels, from primary school to university, providing them with the tools they need to create engaging and effective learning content in seconds.

---

## 🔑 Key Features

Our suite of AI-powered tools is designed to cover every aspect of a teacher's preparation workflow:

* **📝 Notes Generator:** Instantly create comprehensive, well-structured notes on any topic, formatted in Markdown and ready for distribution.
* **🧠 Topic Summarizer:** Condense long articles or complex topics into clear, concise summaries suitable for any grade level.
* **🗓️ Lesson Plan Generator:** Automatically design detailed lesson plans, complete with objectives, materials, activities, and assessment strategies.
* **🤸 Class Activity Generator:** Brainstorm fun and engaging classroom activities to boost student participation and understanding.
* **🤔 Quiz Maker:** Craft custom quizzes with various question types (MCQ, T/F, etc.) and export them as PDFs.
* **✍️ Exam Paper Generator:** Build complete, formatted exam papers based on your syllabus, marks, and question structure.
* **📜 Work History:** A dedicated section to view, manage, and re-download all previously generated content.

---

## 💻 Tech Stack

This project is built with a modern, efficient, and scalable tech stack.

| Category             | Technology                                       |
| -------------------- | ------------------------------------------------ |
| **Full-Stack Framework** | [Next.js](https://nextjs.org/) (App Router)      |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/)           |
| **AI Engine** | [Google Gemini API](https://ai.google.dev/)      |
| **UI Components** | [Lucide React](https://lucide.dev/) (for icons)  |
| **Markdown Rendering** | `react-markdown`                                 |
| **Deployment** | [Vercel](https://vercel.com/)                      |

---

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/lessoncraft-ai.git](https://github.com/your-username/lessoncraft-ai.git)
    cd lessoncraft-ai
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a file named `.env.local` in the root of your project.
    * Add your Gemini API key to this file:
        ```plaintext
        GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

The project uses the Next.js App Router for a clean and intuitive file structure.

* `src/app/`: Contains all the pages and routes.
    * `api/`: All backend API routes for interacting with the Gemini API.
    * `tools/`: Individual pages for each generator tool.
    * `layout.js`: The main root layout with SEO metadata.
    * `page.js`: The homepage/dashboard.
* `src/components/`: Shared, reusable React components (e.g., Navbar, Sidebar).
* `src/lib/`: Centralized modules for services and utilities.
    * `gemini.js`: The core Gemini API service.
    * `prompts.js`: All prompt templates for the AI.
* `public/`: Static assets like images and logos.

---


## 👤 Author

**Bhavesh**

* GitHub: [bhavesh-bari](https://github.com/bhavesh-bari)
* LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/bhavesh-bari/)
