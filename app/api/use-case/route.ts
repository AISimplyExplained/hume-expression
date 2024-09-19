import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 200; 

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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Using provided topic please generate use cases of this topic 4 points",
        },
        {
          role: "assistant",
          content: topic,
        },
        {
          role: "user",
          content: `Generate the result in this formate.
"{\"topic\": \"topic\",\n              \"points\": [\"first point\", \"second point\"]}"
          `,
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

    const res = JSON.parse(content);

    return NextResponse.json({
      message: "Success",
      res,
    });
  } catch (error) {
    console.log("error, ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 }
    );
  }
}
