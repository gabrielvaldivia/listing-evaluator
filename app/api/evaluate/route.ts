import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('API route hit');
  try {
    const { requirements, listingUrl } = await request.json();
    console.log('Received data:', { requirements, listingUrl });

    // Scrape the listing
    const response = await fetch(listingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const listingContent = dom.window.document.body.textContent;

    // Evaluate using OpenAI
    const prompt = `
      Requirements: ${requirements}
      
      Listing content: ${listingContent}
      
      Based on the requirements, evaluate this listing and provide a score out of 100. Also provide a brief explanation of the evaluation.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const evaluation = completion.choices[0].message.content?.trim() || '';
    const score = parseInt(evaluation.match(/\d+/)?.[0] || '0');

    return NextResponse.json({ score, evaluation });
  } catch (error) {
    console.error('Error in POST /api/evaluate:', error);
    return NextResponse.json({ error: 'An error occurred while processing the request', details: error.message }, { status: 500 });
  }
}