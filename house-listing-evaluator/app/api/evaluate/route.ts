import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const { requirements, listingUrl } = await request.json();

  // Scrape the listing
  const response = await fetch(listingUrl);
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

  const evaluation = completion.data.choices[0].message.content?.trim() || '';
  const score = parseInt(evaluation.match(/\d+/)?.[0] || '0');

  return NextResponse.json({ score, evaluation });
}