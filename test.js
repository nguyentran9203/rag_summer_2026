import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API});

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 200,
  messages: [{ role: "user", content: "Say hello in 5 words." }]
});

console.log(response.content[0].text);