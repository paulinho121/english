/**
 * Audio Capture Processor
 * Handles downsampling and basic VAD in a background thread.
 */
class AudioCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Int16Array(1024); // Smaller buffer for lower latency (approx 64ms)
        this.bufferIndex = 0;
        this.targetSampleRate = 16000;
        this.holdTime = 0;
        this.isCapturing = false;
        this.speechCounter = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const inputChannel0 = input[0];

            // 1. RMS Calculation for UI
            let sum = 0;
            for (let i = 0; i < inputChannel0.length; i++) {
                sum += inputChannel0[i] * inputChannel0[i];
            }
            const rms = Math.sqrt(sum / inputChannel0.length);
            this.port.postMessage({ type: 'rms', value: rms });

            // 2. Continuous VAD Logic (for UI indicators)
            if (!this.noiseFloor) this.noiseFloor = 0.005;
            if (rms < this.noiseFloor) {
                this.noiseFloor = this.noiseFloor * 0.999 + rms * 0.001;
            } else if (rms < this.noiseFloor * 2) {
                this.noiseFloor = this.noiseFloor * 0.99 + rms * 0.01;
            }

            const threshold = Math.max(0.010, this.noiseFloor * 1.5);
            const isSpeechCandidate = rms > threshold;

            if (isSpeechCandidate) {
                this.speechCounter++;
                if (this.speechCounter > 2) { // Low debounce for responsiveness
                    this.holdTime = 50; // Keep 'speaking' status for approx 150ms of silence
                    if (!this.isCapturing) {
                        this.isCapturing = true;
                        this.port.postMessage({ type: 'vad', value: true });
                    }
                }
            } else {
                this.speechCounter = 0;
                if (this.holdTime > 0) {
                    this.holdTime--;
                } else if (this.isCapturing) {
                    this.isCapturing = false;
                    this.port.postMessage({ type: 'vad', value: false });
                }
            }

            // 3. Audio Processing (Continuous Stream)
            // Even when not 'capturing' (silence), we send audio to Gemini 
            // so its server-side VAD can work more accurately and respond faster.
            const ratio = sampleRate / this.targetSampleRate;

            for (let i = 0; i < inputChannel0.length; i += ratio) {
                const sample = inputChannel0[Math.floor(i)];

                // Simple High-Pass Filter
                this.lastIn = this.lastIn || 0;
                this.lastOut = this.lastOut || 0;
                const alpha = 0.95;
                const filtered = alpha * (this.lastOut + sample - this.lastIn);
                this.lastIn = sample;
                this.lastOut = filtered;

                const int16Sample = Math.max(-1, Math.min(1, filtered)) * 0x7FFF;
                this.buffer[this.bufferIndex++] = int16Sample;

                if (this.bufferIndex >= this.buffer.length) {
                    this.port.postMessage({
                        type: 'audio',
                        data: this.buffer.buffer
                    }, [this.buffer.buffer]);

                    this.buffer = new Int16Array(1024);
                    this.bufferIndex = 0;
                }
            }
        }
        return true;
    }
}

registerProcessor('capture-processor', AudioCaptureProcessor);
