const API_URL = "http://localhost:5003/api/chat";
const MAX_TOKENS = 1000;
const DEBOUNCE_DELAY = 300;

let isProcessing = false;
const responseCache = new Map();
let speechSynthesisUtterance;
let isSpeaking = false;
// Initialize isPaused to true as default state
let isPaused = true;

export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function optimizeInput(text) {
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "[URL]");
  text = text.replace(/([!?,.]){2,}/g, "$1");
  const optimizations = {
    "please explain": "explain",
    "can you tell me": "explain",
    "i would like to know": "explain",
    "what is the meaning of": "define",
    "how do i": "help:",
    "what is": "define:",
    "tell me about": "explain",
    "give me information on": "info:",
    "could you explain": "explain",
    "how can i": "help:",
    "describe": "explain",
    "elaborate on": "explain",
    "i am looking for": "find",
    "where can i find": "find:",
    "can you provide": "give",
    "do you know about": "explain",
    "could you possibly": "can",
    "is there a way to": "can i",
    "what are the steps to": "steps:",
    "steps to": "steps:",
    "how does": "explain",
    "show me how to": "guide:",
    "how to": "guide:",
    "list the": "show",
    "could you list": "show",
    "i need details on": "details:",
    "what does it mean": "define",
    "could you define": "define",
    "i have a question about": "question:",
    "i was wondering": "explain",
    "do you happen to know": "explain",
    "i wish to learn": "learn",
    "i need help with": "help:",
    "help me understand": "explain",
    "explain to me": "explain",
    "please help": "help:",
    "assist me with": "help:",
    "give me an example of": "example:",
    "show me examples of": "examples:",
    "do you have any examples of": "examples:",
    "i am confused about": "clarify:",
    "please clarify": "clarify:",
    "is it possible to": "can i",
    "how can i do": "help:",
    "what's the best way to": "best:",
    "what's a good method for": "best:",
    "suggestions for": "suggest:",
    "give me some tips for": "tips:",
    "any advice on": "advice:",
    "could you recommend": "suggest:",
    "what are some strategies for": "strategies:",
    "strategies for": "strategies:",
    "recommend a way to": "suggest:",
    "could you summarize": "summary:",
    "summarize": "summary:",
    "what are the key points of": "summary:",
    "quick explanation of": "summary:",
    "briefly explain": "summary:",
    "give me a quick rundown of": "summary:",
    "overview of": "summary:",
    "in short": "summary:",
  };

  Object.entries(optimizations).forEach(([phrase, replacement]) => {
    if (text.toLowerCase().startsWith(phrase)) {
      text = replacement + text.slice(phrase.length);
    }
  });

  return text;
}

export const updateCounters = debounce(() => {
  const textArea = document.getElementById("prompt");
  if (!textArea) return;

  const length = textArea.value.length;
  document.getElementById("char-count").textContent = length;
  document.getElementById("token-count").textContent = Math.ceil(length / 4);

  const submitBtn = document.getElementById("submit-btn");
  const optimizeBtn = document.getElementById("optimize-btn");

  submitBtn.disabled = length === 0 || length > MAX_TOKENS;
  optimizeBtn.disabled = length === 0;
}, DEBOUNCE_DELAY);

export async function submitPrompt() {
  if (isProcessing) return;

  const textArea = document.getElementById("prompt");
  const responseContainer = document.getElementById("response");
  if (!textArea || !responseContainer) return;

  const prompt = optimizeInput(textArea.value.trim());
  if (!prompt) return;

  responseContainer.textContent = ""; // Clear previous response

  try {
    isProcessing = true;
    document.getElementById("submit-btn").disabled = true;
    responseContainer.innerHTML = "<div class='loading'>Processing...</div>";

    if (responseCache.has(prompt.toLowerCase())) {
      const cachedResponse = responseCache.get(prompt.toLowerCase());
      responseContainer.textContent = cachedResponse;
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }); // sent data to baackend url 5003/api/chat

    const data = await response.json();
    if (response.ok) {
      responseContainer.textContent = data.response;
      responseCache.set(prompt.toLowerCase(), data.response);
      // Ensure speech is in paused state after getting a new response
      isSpeaking = false;
      isPaused = true;
    } else {
      responseContainer.innerHTML = `<div class='error'>Error: ${data.error}</div>`;
    }
  } catch (error) {
    console.error("Error:", error);
    responseContainer.innerHTML = "<div class='error'>Error fetching response</div>";
  } finally {
    isProcessing = false;
    document.getElementById("submit-btn").disabled = false;
  }
}

export function playSpeech() {
  const responseContainer = document.getElementById("response");
  if (!responseContainer) return;

  const text = responseContainer.textContent.trim();
  if (!text) return;

  // Resume if paused
  if (isPaused && speechSynthesisUtterance) {
    window.speechSynthesis.resume();
    isSpeaking = true;
    isPaused = false;
    return;
  }

  // If already speaking, do nothing
  if (isSpeaking) return;

  // Start new speech
  speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.onend = () => {
    isSpeaking = false;
    isPaused = true; // Reset to default paused state when finished
  };

  window.speechSynthesis.speak(speechSynthesisUtterance);
  isSpeaking = true;
  isPaused = false;
}

export function pauseSpeech() {
  if (isSpeaking) {
    window.speechSynthesis.pause();
    isSpeaking = false;
    isPaused = true;
  }
}

export function stopSpeech() {
  window.speechSynthesis.cancel();
  isSpeaking = false;
  isPaused = true; // Keep the default paused state
}

export function resetAll() {
  // Cancel any ongoing speech
  stopSpeech();
  
  // Clear the speech utterance object
  speechSynthesisUtterance = null;
  
  // Reset state variables
  isSpeaking = false;
  isPaused = true; // Reset to default paused state
  
  const prompt = document.getElementById("prompt");
  const response = document.getElementById("response");
  const charCount = document.getElementById("char-count");
  const tokenCount = document.getElementById("token-count");

  if (prompt) prompt.value = "";
  if (response) response.textContent = "";
  if (charCount) charCount.textContent = "0";
  if (tokenCount) tokenCount.textContent = "0";
}