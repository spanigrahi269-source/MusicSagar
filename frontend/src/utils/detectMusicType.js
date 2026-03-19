/**
 * Detect music type from song title and metadata
 * Returns theme name for dynamic UI
 */

const musicTypeKeywords = {
  devotional: [
    'bhajan', 'aarti', 'mantra', 'devotional', 'prayer', 'spiritual',
    'temple', 'god', 'goddess', 'shiva', 'krishna', 'ram', 'hanuman',
    'ganesh', 'durga', 'lakshmi', 'saraswati', 'om', 'chant', 'vedic',
    'bhakti', 'kirtan', 'satsang', 'divine', 'sacred'
  ],
  
  romantic: [
    'love', 'romantic', 'romance', 'pyar', 'ishq', 'mohabbat', 'dil',
    'heart', 'valentine', 'couple', 'wedding', 'shaadi', 'dulhan',
    'beloved', 'darling', 'sweetheart', 'crush', 'date', 'kiss',
    'hug', 'forever', 'together', 'soulmate', 'passionate'
  ],
  
  party: [
    'party', 'dance', 'club', 'dj', 'remix', 'mashup', 'celebration',
    'birthday', 'wedding dance', 'sangeet', 'disco', 'night', 'beat',
    'groove', 'bounce', 'turn up', 'lit', 'fire', 'banger', 'hype',
    'festival', 'rave', 'bass', 'drop', 'bhangra'
  ],
  
  edm: [
    'edm', 'electronic', 'dubstep', 'techno', 'house', 'trance',
    'electro', 'synth', 'bass drop', 'progressive', 'future bass',
    'trap', 'hardstyle', 'drum and bass', 'dnb', 'big room',
    'festival anthem', 'rave', 'neon', 'cyber', 'digital'
  ],
  
  chill: [
    'chill', 'lofi', 'lo-fi', 'relaxing', 'calm', 'peaceful', 'ambient',
    'acoustic', 'soft', 'mellow', 'soothing', 'meditation', 'sleep',
    'study', 'focus', 'zen', 'tranquil', 'serene', 'gentle',
    'instrumental', 'piano', 'guitar', 'unplugged', 'coffee'
  ],
  
  sad: [
    'sad', 'emotional', 'heartbreak', 'breakup', 'cry', 'tears',
    'lonely', 'alone', 'pain', 'hurt', 'miss', 'missing', 'lost',
    'goodbye', 'farewell', 'melancholy', 'depression', 'sorrow',
    'grief', 'regret', 'memories', 'nostalgia', 'broken', 'dark'
  ]
};

/**
 * Detect music type from song title
 * @param {string} title - Song title
 * @param {string} description - Song description (optional)
 * @returns {string} - Theme name (devotional, romantic, party, edm, chill, sad, default)
 */
export function detectMusicType(title, description = '') {
  if (!title) return 'default';
  
  // Combine title and description for better detection
  const text = `${title} ${description}`.toLowerCase();
  
  // Count keyword matches for each type
  const scores = {};
  
  for (const [type, keywords] of Object.entries(musicTypeKeywords)) {
    scores[type] = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        scores[type]++;
      }
    }
  }
  
  // Find type with highest score
  let maxScore = 0;
  let detectedType = 'default';
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
    }
  }
  
  // Return detected type only if we have at least 1 match
  return maxScore > 0 ? detectedType : 'default';
}

/**
 * Get theme info for display
 */
export function getThemeInfo(themeName) {
  const themeLabels = {
    devotional: { emoji: '🙏', label: 'Devotional Vibes' },
    romantic: { emoji: '💕', label: 'Romantic Mood' },
    party: { emoji: '🎉', label: 'Party Mode' },
    edm: { emoji: '⚡', label: 'EDM Energy' },
    chill: { emoji: '😌', label: 'Chill Vibes' },
    sad: { emoji: '😢', label: 'Emotional' },
    default: { emoji: '🎵', label: 'Music' }
  };
  
  return themeLabels[themeName] || themeLabels.default;
}
