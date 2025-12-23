// Audio processing utilities for voice conversation

/**
 * Calculate RMS (Root Mean Square) audio level from audio data
 * Returns a value between 0 and 1 representing the audio intensity
 */
export function calculateRMSLevel(audioData: Float32Array): number {
  if (audioData.length === 0) return 0;
  
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i];
  }
  
  return Math.sqrt(sum / audioData.length);
}

/**
 * Normalize audio level to a 0-1 range with smoothing
 */
export function normalizeAudioLevel(
  level: number,
  minLevel: number = 0.01,
  maxLevel: number = 0.5
): number {
  const clamped = Math.max(minLevel, Math.min(maxLevel, level));
  return (clamped - minLevel) / (maxLevel - minLevel);
}

/**
 * Convert PCM audio data to WAV format
 */
export function pcmToWav(
  pcmData: ArrayBuffer,
  sampleRate: number = 24000,
  numChannels: number = 1,
  bitsPerSample: number = 16
): ArrayBuffer {
  const pcmLength = pcmData.byteLength;
  const wavLength = 44 + pcmLength;
  const buffer = new ArrayBuffer(wavLength);
  const view = new DataView(buffer);
  
  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmLength, true);
  writeString(view, 8, 'WAVE');
  
  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true); // byte rate
  view.setUint16(32, numChannels * bitsPerSample / 8, true); // block align
  view.setUint16(34, bitsPerSample, true);
  
  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmLength, true);
  
  // Copy PCM data
  const pcmView = new Uint8Array(pcmData);
  const wavView = new Uint8Array(buffer, 44);
  wavView.set(pcmView);
  
  return buffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Create an audio context with proper settings for voice
 */
export function createVoiceAudioContext(): AudioContext {
  return new AudioContext({
    sampleRate: 24000,
    latencyHint: 'interactive',
  });
}

/**
 * Smooth audio level transitions using exponential moving average
 */
export class AudioLevelSmoother {
  private currentLevel: number = 0;
  private smoothingFactor: number;
  
  constructor(smoothingFactor: number = 0.3) {
    this.smoothingFactor = smoothingFactor;
  }
  
  update(newLevel: number): number {
    this.currentLevel = 
      this.smoothingFactor * newLevel + 
      (1 - this.smoothingFactor) * this.currentLevel;
    return this.currentLevel;
  }
  
  reset(): void {
    this.currentLevel = 0;
  }
  
  get level(): number {
    return this.currentLevel;
  }
}

/**
 * Audio chunk buffer for streaming playback
 */
export class StreamingAudioBuffer {
  private chunks: ArrayBuffer[] = [];
  private isPlaying: boolean = false;
  private audioContext: AudioContext | null = null;
  private onLevelChange?: (level: number) => void;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private abortController: AbortController | null = null;
  
  constructor(onLevelChange?: (level: number) => void) {
    this.onLevelChange = onLevelChange;
  }
  
  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = createVoiceAudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.audioContext.destination);
    }
  }
  
  addChunk(chunk: ArrayBuffer): void {
    this.chunks.push(chunk);
  }
  
  async play(): Promise<void> {
    if (!this.audioContext || !this.analyser) {
      await this.initialize();
    }
    
    this.isPlaying = true;
    this.abortController = new AbortController();
    this.startLevelMonitoring();
    
    while (this.chunks.length > 0 && this.isPlaying) {
      const chunk = this.chunks.shift()!;
      try {
        const audioBuffer = await this.audioContext!.decodeAudioData(chunk.slice(0));
        const source = this.audioContext!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.analyser!);
        
        await new Promise<void>((resolve, reject) => {
          source.onended = () => resolve();
          this.abortController!.signal.addEventListener('abort', () => {
            source.stop();
            reject(new Error('Playback aborted'));
          });
          source.start();
        });
      } catch (error) {
        if ((error as Error).message !== 'Playback aborted') {
          console.error('Error playing audio chunk:', error);
        }
        break;
      }
    }
    
    this.stopLevelMonitoring();
    this.isPlaying = false;
  }
  
  stop(): void {
    this.isPlaying = false;
    this.chunks = [];
    this.abortController?.abort();
    this.stopLevelMonitoring();
  }
  
  private startLevelMonitoring(): void {
    if (!this.analyser || !this.onLevelChange) return;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const monitor = () => {
      if (!this.isPlaying || !this.analyser) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const normalizedLevel = average / 255;
      
      this.onLevelChange!(normalizedLevel);
      this.animationFrameId = requestAnimationFrame(monitor);
    };
    
    monitor();
  }
  
  private stopLevelMonitoring(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.onLevelChange?.(0);
  }
  
  cleanup(): void {
    this.stop();
    this.audioContext?.close();
    this.audioContext = null;
    this.analyser = null;
  }
}
