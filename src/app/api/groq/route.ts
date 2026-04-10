import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GORQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({
        message: "Content Is empty",
      });
    }

    const prompt = `Improving this following content which contain the post's decription could you expand thi into 3-4 engaging lines. Lines should be clam and beuty.
    Content : ${content}.
    Only return the 3-4 lines nothing another explantion. `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });
    const text = response.choices[0].message.content;
    return NextResponse.json({ text });
  } catch (error) {
    console.log("Failed to genrate Text!", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Error",
      },
      { status: 500 },
    );
  }
}
