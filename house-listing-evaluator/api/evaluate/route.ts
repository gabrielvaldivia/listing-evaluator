import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    max_tokens: 200,
  });

  const evaluation = completion.data.choices[0].text?.trim() || '';
  const score = parseInt(evaluation.match(/\d+/)?.[0] || '0');

  return NextResponse.json({ score, evaluation });
}
