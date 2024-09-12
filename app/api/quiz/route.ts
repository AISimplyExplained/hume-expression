
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
            "Using provided topic please generate quiz based on the topic provided. Generate 3 question",
        },
        {
          role: "assistant",
          content: topic,
        },
        {
          role: "user",
          content: `Generate the result in this formate.
  "{\"topic\": \"topic\",\n  \"quiz\": [ {\"question\": \"here is the question.\", \"options\": [\"...\", \"...\" ], \"correctAnswer\" : \"answer\"'}, ]}"
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
