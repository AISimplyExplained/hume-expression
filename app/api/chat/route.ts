import { openai } from "@ai-sdk/openai";
import { createEdgeRuntimeAPI } from "@assistant-ui/react/edge";
 
export const { POST } = createEdgeRuntimeAPI({
  model: openai("gpt-4o"),
  system: "You are a teaching assistant who helps students with their queries on transformers, GANs and other topics. Gently guiding them, solving their doubts and just helping them learn more effectively",
});