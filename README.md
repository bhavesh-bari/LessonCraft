# 📚 LessonCraft – AI-Powered Teaching Assistant  

LessonCraft is a Next.js-based web application that empowers educators by automating the creation of high-quality teaching materials. This platform streamlines lesson preparation, content generation, assessment creation, and student engagement tools – all in one place.  

---

## 📌 Overview  

LessonCraft helps teachers reduce time spent on administrative and preparatory tasks. By leveraging **Google Gemini AI**, it generates lesson plans, notes, quizzes, activities, and even exam papers in seconds.  

The app supports all grade levels, from **primary school to university**, ensuring tailored, engaging, and effective content delivery.  

---

## 🚀 Features  

### 🔹 Teaching Tools  
- 📝 Generate structured **notes** in Markdown  
- 🧠 Summarize **topics & articles** for any grade level  
- 🗓️ Auto-create **lesson plans** with objectives & activities  
- 🤸 Suggest **classroom activities** to boost engagement  
- 🤔 Build **custom quizzes** (MCQ, T/F, etc.)  
- ✍️ Generate **exam papers** with marks & syllabus integration  
- 📜 Access **work history** and re-download past content  

### 🔹 Core Platform Features  
- 🔒 **Authentication** with **NextAuth (Credentials)**  
- ⚡ **Redis caching** for faster retrieval of generated content  
- 📄 **PDF export** using Puppeteer + Chromium (serverless ready)  
- 🎨 Clean UI with Tailwind + Lucide icons  
- 📂 Markdown rendering for shareable notes  

---

## 📲 System Workflow  

1. **Teacher selects a tool** (e.g., Notes Generator).  
2. LessonCraft **sends input** to Gemini AI with pre-optimized prompts.  
3. AI **generates structured content** (notes, plans, quizzes, etc.).  
4. Teacher can **download/export as PDF** or save to history.  
5. Cached results ensure **faster re-use** of previously generated content.  

---

## 🧠 Problem Statement  

Teachers spend **hours** preparing content, quizzes, and exams, leaving less time for actual teaching.  
LessonCraft solves this by:  
- Automating repetitive tasks  
- Providing **AI-curated structured outputs**  
- Saving & caching generated content for re-use  
- Offering **instant PDF exports** for classroom-ready material  

---

## ⚙️ Tech Stack  

| Layer              | Technology |
|--------------------|------------|
| Frontend           | Next.js (App Router), Tailwind CSS |
| Authentication     | NextAuth (Credentials Provider) |
| AI Engine          | Google Gemini API |
| Database & Caching | Redis |
| PDF Generation     | Puppeteer + @sparticuz/chromium |
| UI Components      | Lucide React |
| Markdown Rendering | React-Markdown |
| Deployment         | Vercel |

---

## 📈 Future Enhancements  

- 🔮 AI-powered **syllabus-based content mapping**  
- 📊 Analytics dashboard for **student progress tracking**  
- 🤖 AI chatbot for **student Q&A support**  
- 🌍 Multi-language content generation  
- 🔐 Role-based access for schools & institutions  

---

## 💼 Target Users  

- **Teachers & Professors** – To save time in lesson planning & assessment creation  
- **Schools & Institutions** – For standardized teaching materials  
- **Tutors & Trainers** – To deliver engaging content quickly  

---

## 📊 Competitive Edge  

Compared to generic AI tools:  
- ✅ **Education-focused prompts** fine-tuned for teachers  
- ✅ **Integrated PDF export** with classroom-ready formatting  
- ✅ **Caching system** (Redis) to re-use content instantly  
- ✅ **Work history** to manage past teaching materials  

---

## 🌐 Live Demo  

👉 [LessonCraft – Try it Now](https://lesson-craft-teach.vercel.app/)  

---

## 📩 Contact  

For any queries or feedback, feel free to contact:  
**bhaveshbari0402@gmail.com**  

---

⭐ Thank you for checking out **LessonCraft**!  
