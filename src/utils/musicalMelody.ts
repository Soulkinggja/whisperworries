// C Major Pentatonic Scale Musical Melody System
// Notes: C, D, E, G, A

interface Note {
  frequency: number;
  duration: number;
}

// C Major Pentatonic frequencies (middle octave)
const pentatonicScale = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.00,
  A4: 440.00,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
};

// Pleasant melody patterns
const melodyPatterns = [
  // Ascending pattern
  [
    { frequency: pentatonicScale.C4, duration: 0.3 },
    { frequency: pentatonicScale.D4, duration: 0.3 },
    { frequency: pentatonicScale.E4, duration: 0.3 },
    { frequency: pentatonicScale.G4, duration: 0.4 },
    { frequency: pentatonicScale.A4, duration: 0.5 },
  ],
  // Uplifting pattern
  [
    { frequency: pentatonicScale.C4, duration: 0.2 },
    { frequency: pentatonicScale.E4, duration: 0.3 },
    { frequency: pentatonicScale.G4, duration: 0.3 },
    { frequency: pentatonicScale.C5, duration: 0.5 },
    { frequency: pentatonicScale.E5, duration: 0.4 },
  ],
  // Soothing pattern
  [
    { frequency: pentatonicScale.A4, duration: 0.4 },
    { frequency: pentatonicScale.G4, duration: 0.4 },
    { frequency: pentatonicScale.E4, duration: 0.4 },
    { frequency: pentatonicScale.D4, duration: 0.4 },
    { frequency: pentatonicScale.C4, duration: 0.6 },
  ],
  // Hopeful pattern
  [
    { frequency: pentatonicScale.C4, duration: 0.3 },
    { frequency: pentatonicScale.G4, duration: 0.3 },
    { frequency: pentatonicScale.A4, duration: 0.3 },
    { frequency: pentatonicScale.E4, duration: 0.3 },
    { frequency: pentatonicScale.C5, duration: 0.5 },
  ],
];

export const playMelody = (patternIndex?: number): Promise<void> => {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.15; // Gentle volume

    // Select pattern (random if not specified)
    const pattern = melodyPatterns[patternIndex ?? Math.floor(Math.random() * melodyPatterns.length)];
    
    let currentTime = audioContext.currentTime;

    pattern.forEach((note: Note) => {
      // Create oscillator for main note
      const oscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();
      
      oscillator.connect(noteGain);
      noteGain.connect(masterGain);
      
      // Use sine wave for smooth, pleasant tone
      oscillator.type = 'sine';
      oscillator.frequency.value = note.frequency;
      
      // Envelope for natural sound
      noteGain.gain.setValueAtTime(0, currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, currentTime + 0.05); // Attack
      noteGain.gain.exponentialRampToValueAtTime(0.1, currentTime + note.duration * 0.7); // Sustain
      noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration); // Release
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      // Add subtle harmony (perfect fifth)
      const harmonyOscillator = audioContext.createOscillator();
      const harmonyGain = audioContext.createGain();
      
      harmonyOscillator.connect(harmonyGain);
      harmonyGain.connect(masterGain);
      
      harmonyOscillator.type = 'sine';
      harmonyOscillator.frequency.value = note.frequency * 1.5; // Perfect fifth
      
      harmonyGain.gain.setValueAtTime(0, currentTime);
      harmonyGain.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
      harmonyGain.gain.exponentialRampToValueAtTime(0.05, currentTime + note.duration * 0.7);
      harmonyGain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
      
      harmonyOscillator.start(currentTime);
      harmonyOscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
    });

    // Resolve when melody completes
    setTimeout(() => {
      audioContext.close();
      resolve();
    }, currentTime * 1000);
  });
};
