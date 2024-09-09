import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    // Ensure API Key is set
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'API Key is missing' },
        { status: 500 }
      );
    }

    const body = await req.json();
    
    // Validate prompt input
    const prompt = typeof body.prompt === 'string' && body.prompt.trim()
      ? body.prompt
      : 'Write a story about a magic backpack.';

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content
    const result = await model.generateContent(prompt);

    // Return the generated text in the response
    return NextResponse.json({ response: result.response.text() });
  } catch (error: any) {
    console.error('Error generating content:', error.message || error);

    const statusCode = error.response?.status || 500;
    return NextResponse.json(
      { message: 'Error generating content' },
      { status: statusCode }
    );
  }
}
 