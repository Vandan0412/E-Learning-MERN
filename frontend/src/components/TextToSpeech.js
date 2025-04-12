import React, { useState, useEffect } from "react";
import "./TTS.css";
import { submitPrompt, optimizeInput, updateCounters, playSpeech, pauseSpeech ,resetAll} from "./TTS_script";

const TextToSpeech = () => {
  const [prompt, setPrompt] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    updateCounters();
  }, [prompt]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSpeech();
      setIsPlaying(false);
    } else {
      playSpeech();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setIsPlaying(false);
    resetAll();
  };
  

  useEffect(() => {
    window.speechSynthesis.onend = () => {
      setIsPlaying(false);
    };
  }, []);

  
  return (
    <section className="main-body">
      
      <div className="main-container">
      <h1> Academic Voice Assistant</h1>  

        <div className="input-container">
          <div className="counters">
            <div className="token-counter">
              Characters: <span id="char-count">0</span> <br></br>
              Estimated Tokens: <span id="token-count">0</span>
            </div>
          </div>

          <textarea
            id="prompt"
            placeholder="Enter your question..."
            maxLength="4096"  
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>

          <div className="button-container">
            <button id="optimize-btn" onClick={() => setPrompt(optimizeInput(prompt))}>
              Optimize Input
            </button>
            <button id="submit-btn" onClick={submitPrompt}>
              Submit Prompt
            </button>
            <button id="play-pause-btn" onClick={handlePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button id="reset-btn" onClick={handleReset}>
              Reset
            </button>

          </div>
        </div>

        <h2 className="Response">Response:</h2>
        <div className="response-container" id="response"></div>

        <div id="audio-container" className="audio-container"></div>
      </div>
    </section>
  );
};

export default TextToSpeech;
