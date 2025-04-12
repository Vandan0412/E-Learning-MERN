from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import re
from functools import lru_cache
import tiktoken  # OpenAI's token counter
import os
from dotenv import load_dotenv
import pyttsx3
import threading
from pymongo import MongoClient
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
MAX_TOKENS = 1000
RESPONSE_TOKEN_LIMIT = 1000

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017/"
try:
    client = MongoClient(MONGO_URI)
    db = client["E-Learning"]  # Your database
    user_queries_collection = db["UserQueries"]  # Collection for storing user questions
    api_logs_collection = db["APIUsage"]  # Collection for API logs

    print(" MongoDB Connected Successfully!")

except pymongo.errors.ConnectionError as e:
    print(f" MongoDB Connection Failed: {e}")
    
# Initialize tokenizer
tokenizer = tiktoken.get_encoding("cl100k_base")

# Initialize text-to-speech engine
tts_engine = pyttsx3.init()
tts_lock = threading.Lock()


def count_tokens(text):
    """Accurately count tokens using OpenAI's tokenizer"""
    return len(tokenizer.encode(text))

@lru_cache(maxsize=1000)
def get_cached_response(prompt_hash):
    """Cache responses using prompt hash"""
    return prompt_hash

def clean_and_optimize_text(text):
    """Clean and optimize input text"""
    text = ' '.join(text.split())
    text = re.sub(r'http\S+|www.\S+', '[URL]', text)
    text = re.sub(r'[''""]', '"', text)
    text = re.sub(r'([!?,.]){2,}', r'\1', text)
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()

def optimize_prompt(prompt):
    """Optimize prompt for token efficiency"""
    optimizations = {
        "please explain": "explain",
        "can you tell me": "explain",
        "i would like to know": "explain",
        "what is the meaning of": "define",
        "how do i": "help:",
        "what is": "define:",
    }

    prompt_lower = prompt.lower()
    for phrase, replacement in optimizations.items():
        if prompt_lower.startswith(phrase):
            prompt = replacement + prompt[len(phrase):]
            break

    return prompt

def speak_text(text):
    """Convert text to speech"""
    def run_tts():
        with tts_lock:
            tts_engine.say(text)
            tts_engine.runAndWait()
    tts_thread = threading.Thread(target=run_tts)
    tts_thread.start()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'prompt' not in data:
            return jsonify({"error": "No prompt provided"}), 400

        # Clean and optimize input
        prompt = data['prompt']
        prompt = clean_and_optimize_text(prompt)
        prompt = optimize_prompt(prompt)

        # Count tokens
        token_count = count_tokens(prompt)
        if token_count > MAX_TOKENS:
            return jsonify({
                "error": "Input too long",
                "token_count": token_count,
                "max_tokens": MAX_TOKENS
            }), 400

        # 🔹 Store user question in MongoDB
        user_queries_collection.insert_one({
            "question": prompt,
            "timestamp": datetime.utcnow()
        })

        # 🔹 Log API Usage in MongoDB
        api_logs_collection.insert_one({
            "prompt": prompt,
            "token_count": token_count,
            "timestamp": datetime.utcnow()
        })

        # Get AI response
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a concise tutor. Be brief but thorough."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=RESPONSE_TOKEN_LIMIT,
            temperature=0.7
        )

        response_text = response.choices[0].message.content

        # Convert response to speech
        speak_text(response_text)

        return jsonify({
            "response": response_text,
            "token_count": token_count,
            "logged": True  # Confirmation that log was stored
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)
