import { useState, useEffect, useRef } from 'react';
import './VoiceSearch.css';

function VoiceSearch({ onSearch, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      setError('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      console.log('🎤 Voice recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(final);
        console.log('🎤 Final transcript:', final);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('Microphone not found. Please check your device.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('🎤 Voice recognition ended');
      
      // If we have a transcript, search for it
      if (transcript) {
        handleSearch(transcript);
      }
    };

    recognitionRef.current = recognition;

    // Start listening automatically
    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      // Process voice commands
      const processedQuery = processVoiceCommand(query);
      
      if (window.showToast) {
        window.showToast(`🎤 Searching for: "${processedQuery}"`, 'info');
      }
      
      onSearch(processedQuery);
      onClose();
    }
  };

  const processVoiceCommand = (command) => {
    // Remove common voice command prefixes
    const prefixes = [
      'hey play',
      'play',
      'search for',
      'find',
      'show me',
      'i want to listen to',
      'i want to hear',
      'play me',
      'can you play',
      'please play'
    ];

    let processed = command.toLowerCase().trim();
    
    for (const prefix of prefixes) {
      if (processed.startsWith(prefix)) {
        processed = processed.substring(prefix.length).trim();
        break;
      }
    }

    return processed;
  };

  const handleManualSearch = () => {
    if (transcript.trim()) {
      handleSearch(transcript);
    }
  };

  const handleRetry = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    startListening();
  };

  if (!supported) {
    return (
      <div className="voice-search-overlay" onClick={onClose}>
        <div className="voice-search-modal" onClick={(e) => e.stopPropagation()}>
          <button className="voice-search-close" onClick={onClose}>✕</button>
          <div className="voice-search-error">
            <div className="error-icon">⚠️</div>
            <h3>Voice Search Not Supported</h3>
            <p>{error}</p>
            <p className="error-hint">
              Voice search works best on Chrome, Edge, or Safari browsers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-search-overlay" onClick={onClose}>
      <div className="voice-search-modal" onClick={(e) => e.stopPropagation()}>
        <button className="voice-search-close" onClick={onClose}>✕</button>

        {/* Microphone Animation */}
        <div className={`voice-search-mic ${isListening ? 'listening' : ''}`}>
          <div className="mic-icon">🎤</div>
          {isListening && (
            <div className="sound-waves">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="voice-search-status">
          {isListening ? (
            <>
              <h3>Listening...</h3>
              <p>Speak now to search for music</p>
            </>
          ) : transcript ? (
            <>
              <h3>Got it!</h3>
              <p>Ready to search</p>
            </>
          ) : (
            <>
              <h3>Voice Search</h3>
              <p>Click the microphone to start</p>
            </>
          )}
        </div>

        {/* Transcript Display */}
        {(transcript || interimTranscript) && (
          <div className="voice-search-transcript">
            <div className="transcript-label">You said:</div>
            <div className="transcript-text">
              {transcript || interimTranscript}
              {interimTranscript && <span className="interim">...</span>}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="voice-search-error-message">
            <span className="error-icon-small">⚠️</span>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="voice-search-actions">
          {isListening ? (
            <button className="voice-btn voice-btn-stop" onClick={stopListening}>
              ⏹️ Stop
            </button>
          ) : transcript ? (
            <>
              <button className="voice-btn voice-btn-retry" onClick={handleRetry}>
                🔄 Try Again
              </button>
              <button className="voice-btn voice-btn-search" onClick={handleManualSearch}>
                🔍 Search
              </button>
            </>
          ) : (
            <button className="voice-btn voice-btn-start" onClick={startListening}>
              🎤 Start Listening
            </button>
          )}
        </div>

        {/* Examples */}
        <div className="voice-search-examples">
          <div className="examples-label">Try saying:</div>
          <div className="examples-list">
            <div className="example-item">"Play Arijit Singh"</div>
            <div className="example-item">"Search for Hindi songs"</div>
            <div className="example-item">"Find romantic music"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceSearch;
