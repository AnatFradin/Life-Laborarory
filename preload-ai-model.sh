#!/bin/bash

# Preload AI model into Ollama memory for faster responses
# Run this before using the rephrasing feature

MODEL="qwen3:8b"

echo "🤖 Preloading model: $MODEL"
echo "📝 Sending warmup request..."

curl -s -X POST http://localhost:11434/api/generate \
  -d "{
    \"model\": \"$MODEL\",
    \"prompt\": \"Hello\",
    \"stream\": false
  }" > /dev/null

echo "✅ Model loaded and ready!"
echo "🚀 You can now use the Rephrase feature with faster responses"
