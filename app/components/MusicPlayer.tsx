'use client';

import { useState, useRef, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioSrc, setAudioSrc] = useState<string>('');

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const result = await getUrl({
          path: 'media/audio/all-of-me-hook.mp3',
        });
        setAudioSrc(result.url.toString());
      } catch (error) {
        console.error('Error loading music from storage:', error);
      }
    };
    fetchAudio();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-50">
      <button 
        onClick={toggleMusic}
        className={`glass-card w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl border-2 ${
          isPlaying 
            ? 'bg-gradient-to-br from-pink-500 to-pink-600 border-white/30 shadow-pink-500/50' 
            : 'bg-white/10 border-white/20 shadow-black/20'
        } ${isPlaying ? 'playing' : ''}`}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        <i className={`fas fa-music text-xl md:text-2xl music-disc ${isPlaying ? 'text-white' : 'text-gray-400'}`}></i>
      </button>
      {audioSrc && (
        <audio ref={audioRef} id="bgMusic" loop>
          <source src={audioSrc} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
