// src/app/api/generate-activity-pdf/route.js

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import redisClient from '@/lib/redis';
async function generatePdf(activity, logoBase64) {
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

  const formatToList = (text, listType = 'ul') => {
    if (!text) return '';
    const items = text
      .split('\n')
      .map(item => `<li>${item.replace(/^\d+\.\s*/, '').replace(/^- /, '')}</li>`)
      .join('');
    return `<${listType} class="list-inside ${listType === 'ol' ? 'list-decimal' : 'list-disc'}">${items}</${listType}>`;
  };

  const fullHtml = `
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body { 
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      -webkit-print-color-adjust: exact;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.05;
      font-size: 6rem;
      font-weight: bold;
      color: #4f46e5;
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
    .section {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }
    .alt {
      background-color: #f9fafb;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #4f46e5;
      margin-bottom: 0.5rem;
      border-bottom: 2px solid #e0e7ff;
      padding-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
</head>
<body class="p-8 relative">
  <div class="watermark">${activity.title}</div>
  <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-200 relative z-10">
    <header class="flex items-center mb-6 border-b pb-4 bg-indigo-50 rounded-lg p-4">
      <img src="${logoBase64}" alt="Logo" style="width: 50px; height: 50px; margin-right: 16px;" />
      <div>
        <h1 class="text-3xl font-bold text-gray-800">${activity.title}</h1>
        <p class="text-gray-500">${activity.description}</p>
      </div>
    </header>
    
    <div class="grid grid-cols-3 gap-4 text-center mb-6">
      <div class="bg-purple-100 text-purple-800 p-3 rounded-lg"><strong>Duration:</strong> ${activity.duration}</div>
      <div class="bg-blue-100 text-blue-800 p-3 rounded-lg"><strong>Group Size:</strong> ${activity.groupSize}</div>
      <div class="bg-green-100 text-green-800 p-3 rounded-lg"><strong>Type:</strong> ${activity.icon}</div>
    </div>

    <div class="space-y-6 text-gray-700">
      <div class="section alt"><h2 class="section-title">📝 Steps</h2>${formatToList(activity.details.steps, 'ol')}</div>
      <div class="section"><h2 class="section-title">🎯 Learning Objectives</h2>${formatToList(activity.details.learningObjectives)}</div>
      <div class="section alt"><h2 class="section-title">📦 Materials Needed</h2>${formatToList(activity.details.materialsNeeded)}</div>
      <div class="section"><h2 class="section-title">📊 Assessment</h2><p>${activity.details.assessment}</p></div>
      <div class="section alt"><h2 class="section-title">🧾 Notes for the Teacher</h2><p>${activity.details.notes}</p></div>
      <div class="section"><h2 class="section-title">💡 Example</h2><p class="italic">${activity.details.example}</p></div>
      <div class="section alt"><h2 class="section-title">🔗 Related Resources</h2>
        <a href="${activity.details.relatedResources}" class="text-blue-600 underline">${activity.details.relatedResources}</a>
      </div>
    </div>
  </div>
</body>
</html>
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

  await page.setContent(fullHtml, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate,
    margin: { top: '25mm', bottom: '70px', right: '25mm', left: '25mm' },
  });

  await browser.close();
  return pdfBuffer;
}

export async function POST(req) {
  try {
    const { activity } = await req.json();

    const cacheKey = `pdf:${activity.title.replace(/\s+/g, '_')}`;

    const cachedPdf = await redisClient.get(cacheKey);
    if (cachedPdf) {
      console.log("Serving from cache:", cacheKey);
      return new NextResponse(Buffer.from(cachedPdf, 'base64'), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${cacheKey}.pdf"`,
        },
      });
    }

    const imagePath = path.join(process.cwd(), 'public', 'LessonCraftLogo.png');
    const imageBuffer = await fs.readFile(imagePath);
    const logoBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const pdfBuffer = await generatePdf(activity, logoBase64);
    await redisClient.set(cacheKey, pdfBuffer.toString('base64'), {
      EX: 60 * 60 * 24,
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cacheKey}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Activity PDF Generation Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500,
    });
  }
}
