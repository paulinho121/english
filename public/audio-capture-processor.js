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

            // Basic VAD factor
            let sum = 0;
            for (let i = 0; i < inputChannel0.length; i++) {
                sum += inputChannel0[i] * inputChannel0[i];
            }
            const rms = Math.sqrt(sum / inputChannel0.length);

            // Send RMS for UI visualization
            this.port.postMessage({ type: 'rms', value: rms });

            // Only process if there's enough volume (simple VAD)
            // threshold can be adjusted, 0.005 is a safe starting point
            if (rms > 0.005) {
                // Simple downsampling (naive pick every Nth sample for 48kHz -> 16kHz)
                // More robust downsampling could be done here if needed
                const ratio = sampleRate / this.targetSampleRate;

                for (let i = 0; i < inputChannel0.length; i += ratio) {
                    const sample = inputChannel0[Math.floor(i)];
                    const int16Sample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;

                    this.buffer[this.bufferIndex++] = int16Sample;

                    if (this.bufferIndex >= this.buffer.length) {
                        // Buffer full, send to main thread
                        this.port.postMessage({
                            type: 'audio',
                            data: this.buffer.buffer
                        }, [this.buffer.buffer]);

                        // Re-allocate buffer since we transferred the previous one
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
