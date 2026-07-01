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

### Next up

- Try a few-shot example, observe how output changes
- Start Week 1 "tiny script" proper: summarize/classify with system prompt + few-shot, felt through own code
