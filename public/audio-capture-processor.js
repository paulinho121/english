/**
 * Audio Capture Processor
 * Handles downsampling and basic VAD in a background thread.
 */
class AudioCaptureProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Int16Array(2048);
        this.bufferIndex = 0;
        this.targetSampleRate = 16000;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input && input.length > 0) {
            const inputChannel0 = input[0];

            // Advanced VAD Logic
            let sum = 0;
            for (let i = 0; i < inputChannel0.length; i++) {
                sum += inputChannel0[i] * inputChannel0[i];
            }
            const rms = Math.sqrt(sum / inputChannel0.length);

            // Send RMS for UI visualization
            this.port.postMessage({ type: 'rms', value: rms });

            // Dynamic Noise Floor adaptation
            // Slowly decrease the threshold if we detect consistent silence
            // Quickly increase it if we detect speech-like energy
            if (!this.noiseFloor) this.noiseFloor = 0.005;

            // Adapt noise floor based on environment (very slow moving average for noise)
            if (rms < this.noiseFloor) {
                this.noiseFloor = this.noiseFloor * 0.999 + rms * 0.001;
            } else if (rms < this.noiseFloor * 2) {
                // Potential background noise, drift up slightly
                this.noiseFloor = this.noiseFloor * 0.99 + rms * 0.01;
            }

            // Voice Activity Detection with Hold Time and Debouncing
            const threshold = Math.max(0.012, this.noiseFloor * 1.8); // Slightly more aggressive
            const isSpeechCandidate = rms > threshold;

            if (isSpeechCandidate) {
                // Debouncing: Must see consistent energy for a few blocks before starting
                this.speechCounter = (this.speechCounter || 0) + 1;
                if (this.speechCounter > 3) { // ~40ms of consistent energy
                    this.holdTime = 40; // ~600ms hold time
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

            // Only process if capturing
            if (this.isCapturing) {
                const ratio = sampleRate / this.targetSampleRate;

                for (let i = 0; i < inputChannel0.length; i += ratio) {
                    const sample = inputChannel0[Math.floor(i)];

                    // Basic High-Pass Filter (removes DC offset and low rumble)
                    // y[i] = α * (y[i-1] + x[i] - x[i-1])
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

                        this.buffer = new Int16Array(2048);
                        this.bufferIndex = 0;
                    }
                }
            }
        }
        return true;
    }
}

registerProcessor('capture-processor', AudioCaptureProcessor);
