RAG SUMMER PROJECT 2026

Smallest possible version of "use Claude to do something useful with real text"

What it returns:
"stop_reason": "end_turn",
  "stop_sequence": null,
  "stop_details": null,
  "usage": {
    "input_tokens": 335,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "cache_creation": {
      "ephemeral_5m_input_tokens": 0,
      "ephemeral_1h_input_tokens": 0
    },
    "output_tokens": 98,
    "service_tier": "standard",
    "inference_geo": "global"
  }
}
=> a full clean response — end_turn means it finished naturally, no truncation. 335 input tokens (your abstract + system prompt), 98 output tokens (the summary).
