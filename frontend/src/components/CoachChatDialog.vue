<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent 
        class="dialog-content chat-dialog" 
        role="dialog" 
        :aria-labelledby="`chat-${persona?.id}`"
      >
        <div class="chat-header">
          <DialogTitle class="chat-title" :id="`chat-${persona?.id}`">
            {{ persona?.icon }} {{ persona?.name }}
          </DialogTitle>
          <p v-if="promptTitle" class="chat-subtitle">{{ promptTitle }}</p>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="chat-empty">
            <p>👋 Start a conversation with {{ persona?.name }}</p>
            <p class="chat-empty-hint">Share your thoughts, and receive coaching guidance.</p>
          </div>

          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['chat-message', `chat-message--${message.role}`]"
          >
            <div v-if="message.role === 'assistant'" class="chat-message-avatar">
              {{ persona?.icon }}
            </div>
            <div class="chat-message-content">
              <div class="chat-message-text">{{ message.content }}</div>
              <div class="chat-message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <div v-if="isSending" class="chat-message chat-message--assistant">
            <div class="chat-message-avatar">
              {{ persona?.icon }}
            </div>
            <div class="chat-message-content">
              <div class="chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="chat-error" role="alert">
          <p>{{ error }}</p>
          <button @click="error = null" class="button-text">Dismiss</button>
        </div>

        <form @submit.prevent="handleSend" class="chat-input-form">
          <textarea
            v-model="currentMessage"
            placeholder="Type your message..."
            class="chat-input"
            rows="3"
            :disabled="isSending"
            @keydown.enter.exact.prevent="handleSend"
            ref="messageInput"
          ></textarea>
          <div class="chat-input-actions">
            <button
              type="submit"
              class="button button-primary"
              :disabled="!currentMessage.trim() || isSending"
            >
              {{ isSending ? 'Sending...' : 'Send' }}
            </button>
            <button
              type="button"
              @click="closeDialog"
              class="button button-secondary"
            >
              Close
            </button>
          </div>
        </form>

        <DialogClose class="dialog-close" aria-label="Close chat">
          ×
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue';
import api from '../services/api.js';

const props = defineProps({
  persona: {
    type: Object,
    default: null,
  },
  promptId: {
    type: String,
    default: null,
  },
  promptTitle: {
    type: String,
    default: '',
  },
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:open']);

const isOpen = ref(props.open);
const messages = ref([]);
const currentMessage = ref('');
const isSending = ref(false);
const error = ref(null);
const messagesContainer = ref(null);
const messageInput = ref(null);

// Watch for open prop changes
watch(() => props.open, (newValue) => {
  isOpen.value = newValue;
  if (newValue) {
    // Clear previous conversation when opening
    messages.value = [];
    currentMessage.value = '';
    error.value = null;
    
    // Focus input
    nextTick(() => {
      messageInput.value?.focus();
    });
  }
});

// Watch for dialog close
watch(isOpen, (newValue) => {
  emit('update:open', newValue);
});

/**
 * Handle send message
 */
async function handleSend() {
  if (!currentMessage.value.trim() || isSending.value) return;
  if (!props.persona || !props.promptId) {
    error.value = 'Unable to send message. Missing persona or prompt information.';
    return;
  }

  const userMessage = currentMessage.value.trim();
  
  // Add user message to chat
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  });

  currentMessage.value = '';
  isSending.value = true;
  error.value = null;

  // Scroll to bottom
  await scrollToBottom();

  try {
    const response = await api.post('/ai/chat', {
      personaId: props.persona.id,
      promptId: props.promptId,
      message: userMessage,
    });

    if (response.data.success) {
      // Add AI response to chat
      messages.value.push({
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(response.data.data.timestamp),
      });

      await scrollToBottom();
    } else {
      error.value = response.data.error || 'Failed to get response from AI';
    }
  } catch (err) {
    console.error('Error sending message:', err);
    
    if (err.response?.status === 503) {
      error.value = 'AI service is not available. Please make sure Ollama is running.';
    } else if (err.response?.status === 504) {
      error.value = 'AI is taking too long to respond. Please try again.';
    } else {
      error.value = err.response?.data?.error || 'Unable to send message. Please try again.';
    }
  } finally {
    isSending.value = false;
  }
}

/**
 * Scroll chat to bottom
 */
async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

/**
 * Format timestamp
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Less than a minute
  if (diff < 60000) {
    return 'just now';
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Different day
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Close dialog
 */
function closeDialog() {
  isOpen.value = false;
}
</script>

<style scoped>
.chat-dialog {
  max-width: 700px;
  width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-light, #e0e0e0);
  background-color: white;
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
}

.chat-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #666666);
  margin: 0.25rem 0 0 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: var(--color-bg-subtle, #fafafa);
  min-height: 300px;
  max-height: 500px;
}

.chat-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary, #666666);
}

.chat-empty p:first-child {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.chat-empty-hint {
  font-size: 0.9375rem;
  opacity: 0.8;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--color-primary-light, #E3F2FD);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.chat-message-content {
  flex: 1;
  min-width: 0;
}

.chat-message-text {
  padding: 0.875rem 1.125rem;
  border-radius: 12px;
  line-height: 1.6;
  font-size: 0.9375rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-message--user .chat-message-text {
  background-color: var(--color-primary, #4A90E2);
  color: white;
  margin-left: auto;
  max-width: 80%;
}

.chat-message--assistant .chat-message-text {
  background-color: white;
  color: var(--color-text-primary, #1a1a1a);
  border: 1px solid var(--color-border-light, #e0e0e0);
  max-width: 90%;
}

.chat-message-time {
  font-size: 0.75rem;
  color: var(--color-text-tertiary, #888888);
  margin-top: 0.375rem;
  padding: 0 0.375rem;
}

.chat-message--user .chat-message-time {
  text-align: right;
}

.chat-typing {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 1rem 1.125rem;
  background-color: white;
  border: 1px solid var(--color-border-light, #e0e0e0);
  border-radius: 12px;
  max-width: 90%;
}

.chat-typing span {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-text-tertiary, #888888);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.chat-typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.chat-error {
  padding: 1rem 1.5rem;
  background-color: #ffebee;
  border-top: 1px solid #ef5350;
  color: #c62828;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-error p {
  margin: 0;
  font-size: 0.875rem;
}

.chat-input-form {
  padding: 1.5rem;
  background-color: white;
  border-top: 1px solid var(--color-border-light, #e0e0e0);
}

.chat-input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--color-border-light, #e0e0e0);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  max-height: 200px;
  margin-bottom: 0.75rem;
}

.chat-input:focus {
  outline: 2px solid var(--color-focus, #4A90E2);
  outline-offset: 0;
  border-color: var(--color-primary, #4A90E2);
}

.chat-input:disabled {
  background-color: var(--color-bg-surface, #f9f9f9);
  cursor: not-allowed;
}

.chat-input-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-primary {
  background-color: var(--color-primary, #4A90E2);
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover, #357ABD);
}

.button-secondary {
  background-color: var(--color-bg-surface, #f0f0f0);
  color: var(--color-text-primary, #1a1a1a);
}

.button-secondary:hover {
  background-color: var(--color-bg-hover, #e0e0e0);
}

.button-text {
  background: none;
  border: none;
  color: var(--color-primary, #4A90E2);
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  padding: 0.25rem 0.5rem;
}

.button-text:hover {
  opacity: 0.8;
}

.button:focus-visible {
  outline: 3px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

/* Dialog base styles */
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 51;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.dialog-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary, #666666);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.dialog-close:hover {
  background-color: var(--color-bg-hover, #f0f0f0);
}

.dialog-close:focus-visible {
  outline: 2px solid var(--color-focus, #4A90E2);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .chat-dialog {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }

  .chat-message--user .chat-message-text,
  .chat-message--assistant .chat-message-text {
    max-width: 85%;
  }
}
</style>
