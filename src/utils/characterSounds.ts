// Utility for generating musical character sounds using Web Audio API
// Creates pleasant melodies that play while the character speaks

export const playCharacterSound = (text: string, duration: number = 2000) => {
  const audioContext = new AudioContext();
  const startTime = audioContext.currentTime;
  
  // Musical scale (C major pentatonic - always sounds pleasant)
  const scale = [261.63, 293.66, 329.63, 392.00, 440.00]; // C, D, E, G, A
  
  // Calculate number of notes based on text length
  const words = text.split(' ');
  const noteCount = Math.min(words.length, 20); // Cap at 20 notes
  
  const timePerNote = (duration / 1000) / noteCount;
  
  for (let i = 0; i < noteCount; i++) {
    // Create oscillators for harmony
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Pick notes from the scale in a melodic pattern
    const noteIndex = i % scale.length;
    const frequency = scale[noteIndex];
    
    // Add some variation - go up and down the scale
    const direction = Math.floor(i / scale.length) % 2 === 0 ? 1 : -1;
    const actualIndex = direction > 0 ? noteIndex : (scale.length - 1 - noteIndex);
    
    oscillator1.frequency.value = scale[actualIndex];
    oscillator2.frequency.value = scale[actualIndex] * 2; // Octave harmony
    
    // Triangle wave for pleasant musical tone
    oscillator1.type = 'triangle';
    oscillator2.type = 'triangle';
    
    // Musical envelope
    const noteStart = startTime + (i * timePerNote);
    const noteDuration = timePerNote * 0.9;
    const noteEnd = noteStart + noteDuration;
    
    // Volume envelope for musical notes
    const peakVolume = 0.3;
    gainNode.gain.setValueAtTime(0, noteStart);
    gainNode.gain.linearRampToValueAtTime(peakVolume, noteStart + 0.02); // Gentle attack
    gainNode.gain.linearRampToValueAtTime(peakVolume * 0.6, noteStart + noteDuration * 0.7); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.01, noteEnd); // Smooth release
    
    oscillator1.start(noteStart);
    oscillator1.stop(noteEnd);
    oscillator2.start(noteStart);
    oscillator2.stop(noteEnd);
  }
  
  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, duration + 500);
};
