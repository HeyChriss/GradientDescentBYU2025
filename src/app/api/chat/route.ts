// // app/api/chat/route.ts
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// export async function POST(req: Request) {
//   try {
//     const { message, userName, conversationHistory } = await req.json();

//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4-turbo-preview",
//       messages: [
//         { 
//           role: "system", 
//           content: `You are Nora, a friendly and helpful AI study companion for ${userName}. Help them learn effectively, create study materials, and provide educational support.`
//         },
//         ...conversationHistory,
//         { role: "user", content: message }
//       ],
//       temperature: 0.7,
//     });

//     return NextResponse.json({
//       message: completion.choices[0].message.content,
//     });

//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process request' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, userName } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with OpenAI or Claude
    // import OpenAI from 'openai';
    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });
    // const completion = await openai.chat.completions.create({...});

    const response = {
      message: `Great ${userName}! I've prepared study materials for "${message}". Check out the flashcards and study guide below!`,
      flashcards: [
        {
          question: 'What is the main concept?',
          answer: 'The primary idea from your content.'
        },
        {
          question: 'How does this relate?',
          answer: 'It connects to other key concepts.'
        },
        {
          question: 'What are the applications?',
          answer: 'Real-world uses and examples.'
        }
      ],
      studyGuide: `Study Guide for Your Topic

1. Main Concepts
   - Key point 1: Important information
   - Key point 2: Crucial details
   - Key point 3: Supporting information

2. Key Terms
   - Term 1: Definition and context
   - Term 2: Definition and context

3. Important Takeaways
   - Focus on the core concepts
   - Practice with flashcards regularly
   - Review before assessments`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}