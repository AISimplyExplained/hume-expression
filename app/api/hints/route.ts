import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface RequestBody {
  query: string;
}

export const maxDuration = 50; 

export async function POST(request: Request) {
  try {
    const { query } = (await request.json()) as RequestBody;

    console.log(query)
    if (!query) {
      return NextResponse.json(
        { error: "Please provide a valid topic" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Fixed typo from "gpt-4o"
      messages: [
        {
          role: "system",
          content:
            "Provide some hint to the question in single line, be concise",
        },
        {
          role: "user",
          content: query, // Use the topic provided in the request body
        },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Success",
      res: content,
    });

  } catch (error) {
    console.error("Error fetching completion: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
