// src/app/api/generate-pdf/route.js

import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { htmlContent, topic } = await req.json();
    const imagePath = path.join(process.cwd(), 'public', 'LessonCraftLogo.png');
    const imageBuffer = await fs.readFile(imagePath);
    const logoBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const fullHtml = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              -webkit-print-color-adjust: exact;
            }
            .prose h2 {
              font-size: 1.5em; color: #334155; border-bottom: 1px solid #e2e8f0;
              padding-bottom: 0.25em; margin-bottom: 0.75em;
            }
            .prose strong { color: #4f46e5; }
          </style>
        </head>
        <body>
          <!-- Watermark -->
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); opacity: 0.05; z-index: -1;">
            <img src="${logoBase64}" alt="Watermark" style="width: 400px;" />
          </div>
          <!-- Main Content -->
          <div class="p-4">
            <article class="prose max-w-none">
              ${htmlContent}
            </article>
          </div>
        </body>
      </html>
    `;
    const headerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 20mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; height: 50px; background: linear-gradient(to right, #4f46e5, #06b6d4);">
        <div style="display: flex; align-items: center;">
          <img src="${logoBase64}" style="width: 30px; height: 30px; margin-right: 8px;" />
          <span style="color: white; font-weight: bold;">LessonCraft AI</span>
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
  margin: {
    top: '70px',
    bottom: '70px',
    right: '25mm',
    left: '25mm',
  },
});

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${topic.replace(/\s+/g, '_')}_summary.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500,
    });
  }
}
