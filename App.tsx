
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LightBulb } from './components/LightBulb';
import { InteractionOverlay } from './components/InteractionOverlay';
import { LightState, User } from './types';
import { useLightSounds } from './hooks/useLightSounds';

const STORAGE_KEY_LIGHT = 'light_it_up_state';
const STORAGE_KEY_USER = 'light_it_up_user';

export default function App() {
  const [lightState, setLightState] = useState<LightState>('off');
  const [user, setUser] = useState<User | null>(null);
  const [isRopePulling, setIsRopePulling] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isOn = lightState === 'on' || lightState === 'deciding' || lightState === 'signing-in';
  const { playPull, playClick } = useLightSounds(lightState === 'on');

  // Initialize from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      const savedLight = localStorage.getItem(STORAGE_KEY_LIGHT);
      if (savedLight === 'on') {
        setLightState('on');
        setHasInteracted(true);
      }
    }

    // Show hint after 3 seconds of idleness
    const timer = setTimeout(() => {
      if (!hasInteracted) setShowHint(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handlePullRope = useCallback(() => {
    setHasInteracted(true);
    setShowHint(false);
    setIsRopePulling(true);
    playPull();
    
    setTimeout(() => {
      setIsRopePulling(false);
      
      if (lightState === 'off') {
        playClick(true);
        if (user?.isLoggedIn) {
          setLightState('on');
          localStorage.setItem(STORAGE_KEY_LIGHT, 'on');
        } else {
          setLightState('deciding');
        }
      } else {
        playClick(false);
        setLightState('off');
        if (user?.isLoggedIn) {
          localStorage.setItem(STORAGE_KEY_LIGHT, 'off');
        }
      }
    }, 150);
  }, [lightState, user, playPull, playClick]);

  const handleDecision = (keepGlowing: boolean) => {
    if (keepGlowing) {
      setLightState('signing-in');
    } else {
      playClick(false);
      setLightState('off');
    }
  };

  const handleSignIn = (username: string) => {
    const newUser = { username, isLoggedIn: true };
    setUser(newUser);
    setLightState('on');
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_LIGHT, 'on');
  };

  const handleLogout = () => {
    setUser(null);
    setLightState('off');
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_LIGHT);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-[2000ms] ease-in-out"
         style={{ backgroundColor: isOn ? '#121214' : '#050505' }}>
      
      {/* Background Ambience */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out pointer-events-none ${isOn ? 'opacity-50' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.18) 0%, transparent 75%)'
        }}
      />

      {/* Main Experience */}
      <div className="relative z-10 flex flex-col items-center">
        <LightBulb 
          isOn={isOn} 
          isPulling={isRopePulling} 
          onPull={handlePullRope}
        />

        {/* Interaction Hint */}
        {showHint && !isOn && !isRopePulling && (
          <div className="absolute top-[400px] left-[calc(50%+80px)] -translate-x-1/2 pointer-events-none animate-hint">
             <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] whitespace-nowrap font-medium">
               Pull the cord to begin
             </p>
          </div>
        )}
      </div>

      {/* Overlays */}
      <InteractionOverlay 
        state={lightState} 
        onDecision={handleDecision} 
        onSignIn={handleSignIn}
      />

      {/* Profile/Identity Status */}
      {user?.isLoggedIn && (
        <div className="absolute top-8 right-10 flex items-center gap-6 animate-fade-in group">
          <div className="flex flex-col items-end">
            <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-1">Illuminated by</span>
            <span className="text-white/80 text-sm font-serif italic tracking-wide">{user.username}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 border border-white/5 rounded-full flex items-center justify-center hover:bg-white/5 hover:border-white/10 transition-all text-zinc-500 hover:text-zinc-300"
            title="Return to anonymity"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {/* Immersive Footer */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 select-none opacity-40 hover:opacity-100 transition-opacity duration-1000">
        <div className="h-[1px] w-8 bg-zinc-800 mb-2"></div>
        <div className="text-zinc-500 text-[10px] tracking-[0.5em] uppercase font-light">
          Light It Up
        </div>
        <div className="text-zinc-700 text-[8px] tracking-[0.2em] uppercase">
          An Interactive Digital Installation &copy; 2024
        </div>
      </div>
    </div>
  );
}
