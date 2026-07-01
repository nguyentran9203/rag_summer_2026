import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getText(response) {
  return response.content.find(block => block.type === "text").text;
}
let messages = [
  { role: "user", content: "Say hello in 5 words." }
];

// TURN 1 — send first message
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 200,
  messages: messages,
});

console.log("Turn 1:", getText(response));

// now that we HAVE response, push it into history
messages.push({ role: "assistant", content: getText(response)});

// add a new user turn
messages.push({ role: "user", content: "Now say it in French." });

// TURN 2 — send the whole array, now 3 messages long
const response2 = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 200,
  messages: messages,
});

console.log("Turn 2:", getText(response2));


