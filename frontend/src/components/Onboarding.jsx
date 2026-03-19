import { useState, useEffect } from 'react';
import './Onboarding.css';

const ONBOARDING_KEY = 'music_sagar_onboarding_completed';

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if onboarding was already completed
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: '🎵 Welcome to Music Sagar!',
      description: 'Your personal music streaming platform powered by YouTube',
      icon: '🎉',
      features: [
        'Stream unlimited music',
        'Create custom playlists',
        'Discover new songs',
        'Track your listening history'
      ]
    },
    {
      title: '🔍 Search & Discover',
      description: 'Find any song you want with our powerful search',
      icon: '🔎',
      features: [
        'Search by song name, artist, or lyrics',
        'Filter by language (Hindi, English, Punjabi, etc.)',
        'Get instant results from YouTube',
        'Save your favorite searches'
      ]
    },
    {
      title: '🎭 Mood-Based Discovery',
      description: 'Let your mood guide your music',
      icon: '😊',
      features: [
        'Use the mood slider (Sad → Energetic)',
        'Get personalized recommendations',
        'Discover songs matching your vibe',
        'Switch languages anytime'
      ]
    },
    {
      title: '📚 Playlists & History',
      description: 'Organize and track your music',
      icon: '📝',
      features: [
        'Create unlimited playlists',
        'Add songs with one click',
        'View your listening history',
        'Like your favorite songs'
      ]
    },
    {
      title: '⌨️ Keyboard Shortcuts',
      description: 'Control playback like a pro',
      icon: '⚡',
      features: [
        'Space - Play/Pause',
        'K - Karaoke Mode',
        '← → - Seek backward/forward',
        'Ctrl+Q - Add to queue'
      ]
    },
    {
      title: '🚀 You\'re All Set!',
      description: 'Start exploring and enjoy your music',
      icon: '✨',
      features: [
        'Browse recommendations on home page',
        'Search for your favorite songs',
        'Create your first playlist',
        'Discover trending music'
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShow(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!show) return null;

  const step = steps[currentStep];

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container">
        {/* Progress Bar */}
        <div className="onboarding-progress">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="onboarding-content">
          <div className="onboarding-icon">{step.icon}</div>
          <h2 className="onboarding-title">{step.title}</h2>
          <p className="onboarding-description">{step.description}</p>

          <div className="onboarding-features">
            {step.features.map((feature, index) => (
              <div key={index} className="onboarding-feature">
                <span className="feature-check">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="onboarding-navigation">
          <button
            className="onboarding-btn onboarding-btn-skip"
            onClick={handleSkip}
          >
            Skip
          </button>

          <div className="onboarding-nav-buttons">
            {currentStep > 0 && (
              <button
                className="onboarding-btn onboarding-btn-secondary"
                onClick={handlePrevious}
              >
                ← Previous
              </button>
            )}
            <button
              className="onboarding-btn onboarding-btn-primary"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started 🚀' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Step Counter */}
        <div className="onboarding-counter">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
