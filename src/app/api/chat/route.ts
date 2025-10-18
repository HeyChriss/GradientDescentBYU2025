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