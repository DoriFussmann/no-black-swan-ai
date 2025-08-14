import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, createSystemMessage, createUserMessage } from '@/src/config/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, type } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create messages array
    const messages = [
      createSystemMessage(
        type || 'AI Assistant',
        context || 'You are a helpful AI assistant that provides professional and accurate responses.'
      ),
      createUserMessage(prompt)
    ];

    // Generate AI response
    const result = await generateAIResponse(messages);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      usage: result.usage,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: 'AI API is running',
    model: 'gpt-3.5-turbo',
    status: 'active'
  });
}
