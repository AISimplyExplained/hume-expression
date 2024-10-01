
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 50; 

interface RequestBody {
  topic: string;
}

export async function POST(request: Request) {
  const {topic} = (await request.json()) as RequestBody;

  if (!topic) {
    return NextResponse.json(
      { error: "Please provide topic" },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Using provided topic and question, please answer that. use markdown whenever it is nessacasry. This should contain 50-60 words.",
        },
        {
          role: "assistant",
          content: topic,
        },
      ],
      seed: 1200,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 400 }
      );
    }


    return NextResponse.json({
      message: "Success",
      res:content,
    });
  } catch (error) {
    console.log("error, ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 }
    );
  }
}
