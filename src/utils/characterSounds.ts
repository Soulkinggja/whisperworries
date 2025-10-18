// Utility for generating character speaking sounds using Web Audio API

export const playCharacterSound = (text: string, duration: number = 2000) => {
  const audioContext = new AudioContext();
  const startTime = audioContext.currentTime;
  
  // Calculate pitch variation based on text characteristics
  const words = text.split(' ');
  const syllableCount = words.reduce((count, word) => {
    // Rough syllable estimation: vowel clusters
    const vowels = word.match(/[aeiou]+/gi);
    return count + (vowels ? vowels.length : 1);
  }, 0);
  
  // Create pitch pattern based on syllables
  const timePerSyllable = duration / syllableCount;
  
  for (let i = 0; i < syllableCount; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Vary frequency for each syllable (between 200Hz and 600Hz)
    const basePitch = 300;
    const pitchVariation = Math.sin(i * 0.5) * 150; // Sine wave for natural variation
    const frequency = basePitch + pitchVariation;
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle'; // Softer sound than square wave
    
    // Envelope for each syllable
    const syllableStart = startTime + (i * timePerSyllable);
    const syllableEnd = syllableStart + timePerSyllable * 0.7; // 70% duty cycle
    
    gainNode.gain.setValueAtTime(0, syllableStart);
    gainNode.gain.linearRampToValueAtTime(0.1, syllableStart + 0.02); // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.05, syllableEnd - 0.05); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, syllableEnd); // Release
    
    oscillator.start(syllableStart);
    oscillator.stop(syllableEnd);
  }
  
  // Clean up context after all sounds complete
  setTimeout(() => {
    audioContext.close();
  }, duration + 500);
};
