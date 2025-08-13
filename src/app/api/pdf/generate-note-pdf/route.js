// src/app/api/notes-generator-pdf/route.js

import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { notes, topic, subject } = await req.json();
    const imagePath = path.join(process.cwd(), 'public', 'LessonCraftLogo.png');
    const imageBuffer = await fs.readFile(imagePath);
    const logoBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    
    const bodyHtml = marked.parse(notes);
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${topic} Notes</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #334155; /* Gray-700 */
              line-height: 1.6;
            }
            header {
              border-bottom: 2px solid #e2e8f0; /* Gray-200 */
              padding-bottom: 5px;
              margin-bottom: 5px;
              display: flex;
            flex-direction:row;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #1e293b; /* Gray-800 */
              font-weight: 700;
              line-height: 1.2;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            h1 { font-size: 2.5rem; }
            h2 { font-size: 2rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.3em; }
            h3 { font-size: 1.5rem; }
            p { margin-bottom: 1em; }
            ul, ol { padding-left: 1.5em; margin-bottom: 1em; }
            li { margin-bottom: 0.5em; }
            strong { color: #0f172a; } /* Gray-900 */
            blockquote {
              border-left: 4px solid #94a3b8; /* Gray-400 */
              padding-left: 1em;
              font-style: italic;
              color: #475569; /* Gray-600 */
              margin-left: 0;
            }
            code {
              background-color: #f1f5f9; /* Gray-100 */
              color: #db2777; /* Pink-600 */
              padding: 0.2em 0.4em;
              border-radius: 6px;
              font-family: 'Courier New', Courier, monospace;
            }
            pre {
              background-color: #f1f5f9; /* Gray-100 */
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <header >
            <img src="${logoBase64}" alt="Logo" style="width: 60px; height: 60px;" />
            <div style="display: flex; flex-direction: column; margin-left: 10px;">
            <p style="font-size: 1.2rem; color: #64748b;">Subject: ${subject}</p>
            <p style="font-size:1.8rem; color: #000000; text-align: center;"> Topic: ${topic}</p>
            </div>
          </header>
          <main>
            ${bodyHtml}
          </main>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    const footerTemplate = `
      <div style="width: 100%; font-size: 10px; padding: 0 40px;
                  display: flex; justify-content: space-between; align-items: center;
                  height: 20px; border-top: 1px solid #e5e7eb;">
        <a href="https://lesson-craft-teach.vercel.app" target="_blank" rel="noopener noreferrer" style="color: #4f46e5; text-decoration: none;">
            lessoncraft.com
        </a>
        <div>Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
      </div>
    `;

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>', 
      footerTemplate: footerTemplate,
      margin: { top: '20mm', bottom: '30mm', right: '20mm', left: '20mm' },
    });

    await browser.close();

    const filename = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`;
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('PDF generation for notes failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF for notes.', details: error.message },
      { status: 500 }
    );
  }
}