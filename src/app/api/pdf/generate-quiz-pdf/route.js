// src/app/api/generate-quiz-pdf/route.js

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAuth } from "@/lib/auth";
export async function POST(req) {
  try {
    await requireAuth();
    const { quizData, topic, subject } = await req.json();

    // Read the logo file and convert it to a Base64 data URI
    const imagePath = path.join(process.cwd(), 'public', 'LessonCraftLogo.png');
    const imageBuffer = await fs.readFile(imagePath);
    const logoBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.AWS_REGION || process.env.VERCEL
          ? await chromium.executablePath()
          : undefined,
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    // --- Dynamically generate the HTML for the questions and answer key ---
    const questionsHtml = quizData.map((q, index) => `
      <div class="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
        <p class="font-bold text-lg text-gray-800 mb-4">Question ${index + 1}: ${q.question}</p>
        <div class="space-y-3">
          ${q.options.map((opt, optIndex) => `
            <div class="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50">
              <span class="font-bold text-gray-700">${String.fromCharCode(65 + optIndex)})</span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    const answerKeyHtml = `
      <div class="mt-10 pt-6 border-t-2 border-dashed" style="page-break-before: always;">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">🔑 Answer Key</h2>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Q#</th>
              <th class="p-2 border">Answer</th>
            </tr>
          </thead>
          <tbody>
            ${quizData.map((q, index) => `
              <tr class="border-b">
                <td class="p-2 border">${index + 1}</td>
                <td class="p-2 border font-semibold text-green-700">${q.answer}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // --- Full HTML Template for the PDF ---
    const fullHtml = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; background-color: #f8fafc; }
          </style>
        </head>
        <body class="p-8">
          ${questionsHtml}
          ${answerKeyHtml}
        </body>
      </html>
    `;

    // --- Header and Footer Templates ---
    const headerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; height: 50px; background: linear-gradient(to right, #4f46e5, #06b6d4);">
        <div style="display: flex; align-items: center;">
          <img src="${logoBase64}" style="width: 30px; height: 30px; margin-right: 8px;" />
          <span style="color: white; font-weight: bold;">LessonCraft AI</span>
        </div>
        <div style="color: white; text-align: center;">
            <div style="font-weight: bold;">Quiz: ${topic}</div>
            <div>Subject: ${subject} | Questions: ${quizData.length} | Marks: ${quizData.length}</div>
        </div>
        <span style="color: white;">${new Date().toLocaleDateString()}</span>
      </div>
    `;

    const footerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center; height: 50px; border-top: 1px solid #e5e7eb;">
              <a href="https://lesson-craft-teach.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: none;">
  lessoncraft.com
</a>
        <div>
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      </div>
    `;

    await page.setContent(fullHtml, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      margin: { top: '70px', bottom: '70px', right: '25mm', left: '25mm' },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${topic.replace(/\s+/g, '_')}_quiz.pdf"`,
      },
    });

  } catch (error) {
    console.error("Quiz PDF Generation Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500,
    });
  }
}
