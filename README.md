# RAG Summer Project 2026

## Week 1 — First Working API Call

**Goal:** Smallest possible version of "use Claude to do something useful with real text."

### What the script does

1. Authenticate with `ANTHROPIC_API_KEY` from `.env`
2. Send a real abstract (thesis abstract) as the user message, with a `system` prompt instructing Claude to summarize in plain English
3. Print the response text

```javascript
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const abstract = `PASTE ABSTRACT HERE`;

const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 300,
  system: "You summarize academic abstracts in 2-3 plain-English sentences, no jargon.",
  messages: [{ role: "user", content: abstract }],
});

console.log(response.content[0].text);
```

### What it returned

```json
{
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 335,
    "output_tokens": 98,
    "service_tier": "standard"
  }
}
```

- `end_turn` → finished naturally, no truncation
- 335 input tokens = abstract + system prompt
- 98 output tokens = the summary
- Result: summary read well, captured the abstract accurately

### Key fields worth knowing

- `content` is an array (can hold multiple blocks: text, tool calls, etc.) — `.content[0].text` grabs the text
- `stop_reason`: `"end_turn"` = finished naturally, `"max_tokens"` = got cut off
- `usage`: token counts, useful later for cost/context tracking

### Setup notes / gotchas hit

- Use `.mjs` extension (or `"type": "module"` in `package.json`) for `import` syntax to work
- `.env` variable name must exactly match what the code reads (`ANTHROPIC_API_KEY`)
- No spaces around `=` in `.env`, no quotes needed
- Copy API keys using the console's copy button — manual selection can truncate them

### Status

✅ Pipe confirmed working end-to-end: key → request → response
✅ First real script: abstract in → summary out

---

## Week 1 — Multi-Turn Conversation (test2.js)

**Goal:** Turn the one-shot script into a real conversation — hold a `messages` array across turns, append replies, resend the whole history.

### What the script does

1. Send turn 1 (`"Say hello in 5 words."`)
2. Push the assistant's real reply into the `messages` array
3. Push a new user turn (`"Now say it in French."`)
4. Send the **whole array** again for turn 2 — this is what makes it "remember" turn 1

```javascript
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function getText(response) {
  return response.content.find(block => block.type === "text").text;
}

let messages = [
  { role: "user", content: "Say hello in 5 words." }
];

// TURN 1
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 200,
  messages: messages,
});

console.log("Turn 1:", getText(response));

messages.push({ role: "assistant", content: getText(response) });
messages.push({ role: "user", content: "Now say it in French." });

// TURN 2 — sends the whole array, now 3 messages long
const response2 = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 200,
  messages: messages,
});

console.log("Turn 2:", getText(response2));
```

### Gotcha: `content[0]` isn't always the text block

`claude-sonnet-5` has extended thinking on by default, so `response.content` can come back as **two blocks**, not one:

```json
"content": [
  { "type": "thinking", "thinking": "...", "signature": "..." },
  { "type": "text", "text": "Bonjour ! ..." }
]
```

`content[0].text` grabs the thinking block (no `.text` field → `undefined`). Pushing that `undefined` into `messages` as the assistant's content then throws a `400: messages.1.content: Field required` on the next call — the API rejects a message with missing content.

**Fix:** don't rely on index position — find the block by type:

```javascript
function getText(response) {
  return response.content.find(block => block.type === "text").text;
}
```

Use `getText(response)` everywhere instead of `response.content[0].text`.

### Order matters

The push into `messages` has to happen **after** the response comes back, not before — `messages.push({ role: "assistant", content: getText(response) })` needs `response` to already exist. Sending two `client.messages.create()` calls back-to-back before pushing the first reply defeats the point of multi-turn (turn 2 wouldn't include turn 1's real answer).

### What this demonstrates

- There's no server-side memory — the `messages` array **is** the memory. Every turn resends the full history.
- Token cost compounds: each turn's `input_tokens` includes everything from every prior turn, so conversations get more expensive per-turn as they grow, even if each new message is short.
- Debugging shortcut: `console.log(JSON.stringify(response, null, 2))` is the fastest way to see the real shape of a response instead of guessing why `.text` is `undefined`.

### Status

✅ Multi-turn conversation working — turn 2 correctly references turn 1's context
✅ Confirmed the `thinking` block gotcha and fixed with a type-safe `getText()` helper

---

## Next up

- Log and compare `input_tokens` across turns to see the resend cost directly
- Try a few-shot example, observe how output changes
- Start Week 1 "tiny script" proper: summarize/classify with system prompt + few-shot, felt through own code
