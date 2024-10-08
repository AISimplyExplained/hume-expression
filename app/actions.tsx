"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { generateText } from "ai";

const stateStore = {
  energy: 0,
  streak: 0,
  level: 0,
};

interface Question {
  question: string;
  correctAnswer: number;
  options: string[];
}

let currentQuestion = {}

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export async function updateStateOnServer(
  energy: number,
  streak: number,
  level: number,
) {
  stateStore.energy = energy;
  stateStore.streak = streak;
  stateStore.level = level;

  console.log("Updated State:", stateStore);
  return { success: true, updatedState: stateStore };
}

export async function updateCurrentQuestionOnServer(question: Question) {
  console.log("Updated State:", question);
  currentQuestion = question;
  return { success: true, updatedState: stateStore };
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}
 
export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";
 
  const history = getMutableAIState();
 
  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    system: `You are a teaching assistant who helps students with their queries on transformers, GANs and other topics. Gently guiding them, solving their doubts and just helping them learn more effectively`,
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }
 
      return <div>{content}</div>;
    },
    tools: {
      getStats: {
        description: "Get current energy or points, level, streak",
        parameters: z.object({
          title: z
            .string()
            .describe("A relevant heading for stats"),
        }),
        generate: async function* () {
          yield <div className="animate-pulse">Loading...</div>;
          try {
            const { text, finishReason, usage } = await generateText({
              system: 'You are a Chatbot assistant of a interactive learning game who helps students with their queries on transformers, GANs and other topics. Gently guiding them, solving their doubts. Students solves quiz, and there are many more stats such as energy (points) , level , streak etc, You respond to user query utilizing the tool response, you do not have to worry about tool values just simple create a response',
              model: openai('gpt-4o'),
              prompt: `User query: ${input} Tool Response: ${stateStore.energy}`
            });
            return <div>{text}</div>
          } catch (error) {
            console.error("An error occurred:", error);
            return <p>Sorry, an error occurred while generating the response.</p>;
          }
        },
      }, 
      currentQuestion: {
        description: "Perform actions related to the current quiz question",
        parameters: z.object({
          title: z
            .string()
            .describe("A relevant heading related to the current quiz question"),
        }),
        generate: async function* () {
          yield <div className="animate-pulse">Analyzing...</div>;
          try {
            const { text, finishReason, usage } = await generateText({
              system: 'You are a Chatbot assistant of a interactive learning game who helps students with their queries on transformers, GANs and other topics. Gently guiding them, solving their doubts. User will reach out to you asking for help on some questions',
              model: openai('gpt-4o'),
              prompt: `User query: ${input} This is the question: ${JSON.stringify(currentQuestion)}`
            });
            return <div>{text}</div>
          } catch (error) {
            console.error("An error occurred:", error);
            return <p>Sorry, an error occurred while generating the response.</p>;
          }
        },
      }, 
    }    
  });
 
  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}
 
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});