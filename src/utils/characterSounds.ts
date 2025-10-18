// Utility for generating character speaking sounds using Web Audio API
// Creates speech-like sounds with natural pitch variation and rhythm

export const playCharacterSound = (text: string, duration: number = 2000) => {
  const audioContext = new AudioContext();
  const startTime = audioContext.currentTime;
  
  // Calculate syllables for more natural speech rhythm
  const words = text.split(' ');
  const syllableCount = words.reduce((count, word) => {
    const vowels = word.match(/[aeiou]+/gi);
    return count + (vowels ? vowels.length : 1);
  }, 0);
  
  const timePerSyllable = (duration / 1000) / syllableCount; // Convert to seconds
  
  for (let i = 0; i < syllableCount; i++) {
    // Create multiple oscillators for richer, more speech-like sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Mix two oscillators for more complex, voice-like timbre
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Natural speech pitch variation (around 200-400Hz range)
    const basePitch = 250;
    // Add sentence intonation (rising and falling)
    const sentenceProgress = i / syllableCount;
    const intonation = Math.sin(sentenceProgress * Math.PI) * 50; // Rise and fall
    // Add random variation for naturalness
    const randomVariation = (Math.random() - 0.5) * 30;
    
    const frequency = basePitch + intonation + randomVariation;
    
    oscillator1.frequency.value = frequency;
    oscillator2.frequency.value = frequency * 1.5; // Harmonic for richer sound
    
    // Use triangle wave for smoother sound with some harmonics
    oscillator1.type = 'triangle';
    oscillator2.type = 'triangle';
    
    // Speech-like envelope with quick attack and decay
    const syllableStart = startTime + (i * timePerSyllable);
    const syllableDuration = timePerSyllable * 0.98; // Almost no gap for very fast speech
    const syllableEnd = syllableStart + syllableDuration;
    
    // Volume envelope mimicking speech
    const peakVolume = 0.35; // Much louder volume
    gainNode.gain.setValueAtTime(0, syllableStart);
    gainNode.gain.linearRampToValueAtTime(peakVolume, syllableStart + 0.003); // Very fast attack
    gainNode.gain.linearRampToValueAtTime(peakVolume * 0.8, syllableStart + syllableDuration * 0.2); // Shorter hold
    gainNode.gain.linearRampToValueAtTime(0, syllableEnd); // Quick release
    
    oscillator1.start(syllableStart);
    oscillator1.stop(syllableEnd);
    oscillator2.start(syllableStart);
    oscillator2.stop(syllableEnd);
  }
  
  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, duration + 500);
};
