
import { useEffect, useRef } from 'react';

export const useLightSounds = (isOn: boolean) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const humNode = useRef<OscillatorNode | null>(null);
  const humGain = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  const playClick = (isTurningOn: boolean) => {
    initAudio();
    const ctx = audioCtx.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(isTurningOn ? 150 : 120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);

    // Add a tiny bit of metallic ring for "on"
    if (isTurningOn) {
      const ring = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ring.type = 'sine';
      ring.frequency.setValueAtTime(800, ctx.currentTime);
      ringGain.gain.setValueAtTime(0.02, ctx.currentTime);
      ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      ring.connect(ringGain);
      ringGain.connect(ctx.destination);
      ring.start();
      ring.stop(ctx.currentTime + 0.5);
    }
  };

  const playPull = () => {
    initAudio();
    const ctx = audioCtx.current!;
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  };

  // Manage Ambient Hum
  useEffect(() => {
    if (isOn) {
      initAudio();
      const ctx = audioCtx.current!;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime); // 60Hz hum
      
      const harmonic = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(120, ctx.currentTime);
      harmonicGain.gain.setValueAtTime(0.002, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2); // Slow fade in

      osc.connect(gain);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      harmonic.start();
      
      humNode.current = osc;
      humGain.current = gain;

      return () => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc.stop();
          harmonic.stop();
        }, 500);
      };
    }
  }, [isOn]);

  return { playPull, playClick };
};
