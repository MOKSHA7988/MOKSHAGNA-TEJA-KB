import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
  Waves,
  CloudRain,
  Bird,
  Bell,
  Sun,
  X,
  Play,
  Pause,
} from 'lucide-react';

interface NatureAmbientControllerProps {
  isDarkMode?: boolean;
}

type SoundscapeType = 'rain' | 'waves' | 'wind' | 'birds' | 'temple';

export const NatureAmbientController: React.FC<NatureAmbientControllerProps> = ({
  isDarkMode = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('birds');
  const [volume, setVolume] = useState<number>(0.25);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState<boolean>(true);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const oscillatorRefs = useRef<any[]>([]);

  // Canvas Ref for Nature Particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle System Effect
  useEffect(() => {
    if (!showParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 35 floating particles (fireflies / glowing spores)
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      hue: Math.random() > 0.6 ? 165 : Math.random() > 0.3 ? 45 : 190, // Emerald, Amber, Cyan
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(0.1, Math.min(0.7, p.alpha));

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${currentAlpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles]);

  // Clean Audio on Unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        isPlaying ? volume : 0,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [volume, isPlaying]);

  // Start procedural nature audio synthesizer
  const startAudio = (type: SoundscapeType) => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (type === 'rain') {
        // Pink noise filter for rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(0);
        oscillatorRefs.current.push(whiteNoise);
      } else if (type === 'waves') {
        // Ocean swell waves filter
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8-second wave breath
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);

        lfo.connect(filter.frequency);
        lfo.start();

        // Noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(0);

        oscillatorRefs.current.push(whiteNoise, lfo);
      } else if (type === 'birds') {
        // Melodic forest chords and occasional chirps
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const droneGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(330, ctx.currentTime); // E4

        osc1.connect(droneGain);
        osc2.connect(droneGain);
        droneGain.connect(masterGain);
        osc1.start();
        osc2.start();

        // Periodic bird chirp trigger
        const chirpInterval = window.setInterval(() => {
          if (!audioCtxRef.current) return;
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          chirpOsc.type = 'sine';
          chirpGain.gain.setValueAtTime(0.06, ctx.currentTime);
          chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

          const startFreq = 2000 + Math.random() * 800;
          chirpOsc.frequency.setValueAtTime(startFreq, ctx.currentTime);
          chirpOsc.frequency.exponentialRampToValueAtTime(startFreq + 600, ctx.currentTime + 0.1);
          chirpOsc.frequency.exponentialRampToValueAtTime(startFreq - 300, ctx.currentTime + 0.25);

          chirpOsc.connect(chirpGain);
          chirpGain.connect(masterGain);
          chirpOsc.start();
          chirpOsc.stop(ctx.currentTime + 0.28);
        }, 3200);

        intervalRef.current = chirpInterval;
        oscillatorRefs.current.push(osc1, osc2);
      } else if (type === 'wind') {
        // Soft mountain wind
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.12;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(0);

        oscillatorRefs.current.push(whiteNoise);
      } else if (type === 'temple') {
        // Sacred singing bowl harmonic tone
        const freqs = [108, 216, 432, 864];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          g.gain.setValueAtTime(0.04 / (idx + 1), ctx.currentTime);
          osc.connect(g);
          g.connect(masterGain);
          osc.start();
          oscillatorRefs.current.push(osc);
        });
      }

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio Ambient error:', e);
    }
  };

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    oscillatorRefs.current.forEach((node) => {
      try {
        node.stop && node.stop();
        node.disconnect && node.disconnect();
      } catch (e) {}
    });
    oscillatorRefs.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(activeSoundscape);
    }
  };

  const handleSelectSoundscape = (type: SoundscapeType) => {
    setActiveSoundscape(type);
    if (isPlaying) {
      startAudio(type);
    }
  };

  const soundscapes: { id: SoundscapeType; label: string; icon: any; desc: string }[] = [
    { id: 'birds', label: 'Forest Birds', icon: Bird, desc: 'Western Ghats morning sunlight & chirps' },
    { id: 'rain', label: 'Monsoon Mist', icon: CloudRain, desc: 'Gentle raindrops on coffee plantation leaves' },
    { id: 'waves', label: 'Coastal Waves', icon: Waves, desc: 'Arabian Sea rhythmic tide breathing' },
    { id: 'wind', label: 'Himalayan Wind', icon: Wind, desc: 'Cool high-altitude mountain breeze' },
    { id: 'temple', label: 'Sacred Chimes', icon: Bell, desc: '432Hz meditative temple peace bowl' },
  ];

  return (
    <>
      {/* Background Floating Fireflies / Nature Spores Canvas */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-10 opacity-60"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating Bottom-Right Nature & Soundscape Trigger Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              className="p-4 rounded-3xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl w-72 text-white space-y-3.5 ring-1 ring-emerald-500/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Nature Atmosphere</h4>
                    <p className="text-[10px] text-emerald-400 font-medium">Binaural Travel Soundscapes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Soundscape Selector List */}
              <div className="space-y-1.5">
                {soundscapes.map((s) => {
                  const Icon = s.icon;
                  const isSelected = activeSoundscape === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSoundscape(s.id)}
                      className={`w-full p-2 rounded-xl text-left flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-sm ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-emerald-400 animate-bounce' : 'text-slate-400'
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold">{s.label}</p>
                          <p className="text-[9px] text-slate-400 line-clamp-1">{s.desc}</p>
                        </div>
                      </div>
                      {isSelected && isPlaying && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Play / Pause & Volume Control */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleTogglePlay}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isPlaying
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold hover:opacity-90 shadow-emerald-500/20'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause Ambient</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Nature Ambient</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 text-slate-400 text-xs px-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[10px] w-7 text-right text-slate-300 font-mono">
                    {Math.round(volume * 125)}%
                  </span>
                </div>

                {/* Firefly particles toggle */}
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <span>Nature Fireflies & Glow</span>
                  <button
                    onClick={() => setShowParticles(!showParticles)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[10px] transition-all ${
                      showParticles
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {showParticles ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Button */}
        <motion.button
          id="nature-ambient-toggle-btn"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-2xl shadow-xl flex items-center gap-2 border transition-all duration-300 ${
            isPlaying
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border-emerald-500/30 shadow-slate-950/60 backdrop-blur-xl'
          }`}
          title="Nature Soundscape & Atmosphere Generator"
        >
          <div className="relative">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <Wind className="w-5 h-5 text-emerald-400" />
            )}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold hidden sm:inline">
            {isPlaying ? 'Nature Sound On' : 'Atmosphere'}
          </span>
        </motion.button>
      </div>
    </>
  );
};
