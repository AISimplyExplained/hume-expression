import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 50;

interface RequestBody {
  completedCode: string;
  userCode: string;
}

export async function POST(request: Request) {
  const { completedCode, userCode } = (await request.json()) as RequestBody;

  if (!completedCode || !userCode) {
    return NextResponse.json(
      { error: "Please provide all the nessacasry parameter." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
            You are python coding assistant. You take user code and completed code, and compare it and runs it, and produce result. 
            If the code is perfect then result should be true, if not then it should be false. result formate :-
            {
              res: true/false,
              reason: 'please explain the reason.'
            } 
              please do not add any other things to response. We need to parse this result. Otherwise It won't parse.
              Do not give unnessasry response, Just give this, do not add any other thing {"res": true/false, "reason": 'please explain the reason in 10 words'}
          `,
        },
        {
          role: "assistant",
          content: "please compare these codes. If the variable names, or the method to calculate the answer are different then It is fine. But the answer should be same like completed code.",
        },
        {
          role: "user",
          content: `
           user input code: ${userCode} \n
           completed code: ${completedCode}
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

    console.log("res",content)
    const res = JSON.parse(content);

    return NextResponse.json({
      message: "Success",
      res: res.res,
      reason: res.reason
    });
  } catch (error) {
    console.log("error, ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 }
    );
  }
}
