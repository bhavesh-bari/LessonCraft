// src/app/api/generate-exam-pdf/route.js

import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { paperData } = await req.json();

    // Read the logo file and convert it to a Base64 data URI
    const imagePath = path.join(process.cwd(), 'public', 'LessonCraftLogo.png');
    const imageBuffer = await fs.readFile(imagePath);
    const logoBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // --- Dynamically generate the HTML for the questions based on the new structure ---
    const questionsHtml = paperData.questions.map(q => `
      <div class="flex justify-between items-start mt-6">
        <p class="pr-4"><strong>Q${q.q_num}.</strong> ${q.main_question || q.text}</p>
        <span class="font-bold whitespace-nowrap">[${q.marks} Marks]</span>
      </div>
      ${q.sub_questions && Array.isArray(q.sub_questions) ? `
        <div class="pl-8 mt-2 space-y-2">
          ${q.sub_questions.map(sub => `
            <div class="flex justify-between items-start">
              <p class="pr-4"><strong>(${sub.label})</strong> ${sub.text}</p>
              <span class="font-bold whitespace-nowrap">[${sub.marks} Marks]</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `).join('');

    // --- Full HTML Template for the PDF Body ---
    const fullHtml = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=serif:wght@400;700&display=swap');
            body { font-family: 'serif', serif; -webkit-print-color-adjust: exact; }
          </style>
        </head>
        <body class="p-8">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold">${paperData.header.university}</h3>
            <p class="text-lg">Final Examination</p>
          </div>
          <div class="flex justify-between text-lg mb-6 border-y py-2">
            <span><strong>Subject:</strong> ${paperData.header.subject}</span>
            <span><strong>Total Marks:</strong> ${paperData.header.marks}</span>
            <span><strong>Duration:</strong> ${paperData.header.duration}</span>
          </div>
          <div class="space-y-6">
            ${questionsHtml}
          </div>
        </body>
      </html>
    `;

    // --- Header and Footer Templates ---
    const headerTemplate = `<div style="width: 100%; height: 50px;"></div>`; // Empty header as content is in the body
    const footerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center; height: 50px; border-top: 1px solid #e5e7eb;">
        <a href="https://lessoncraft-ai.com" style="color: #4f46e5; text-decoration: none;">lessoncraft-ai.com</a>
        <div>
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      </div>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      margin: { top: '25mm', bottom: '70px', right: '25mm', left: '25mm' },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${paperData.header.subject.replace(/\s+/g, '_')}_exam.pdf"`,
      },
    });

  } catch (error) {
    console.error("Exam PDF Generation Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500,
    });
  }
}
