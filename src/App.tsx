import { useState, useEffect, useCallback, useRef } from 'react';
import { CharacterBubble } from './components/CharacterBubble';
import { GeminiLiveService, AppSettings } from './services/geminiLiveService';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Volume2, Info, Settings, X, ChevronDown, Mic, ShieldCheck, Plus, Trash2, Moon, Power, Loader2, Download } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const CHARACTERS = [
  { id: 'c1', name: 'Neon Girl', url: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?q=100&w=800&auto=format&fit=crop' },
  { id: 'c2', name: 'Cyber Angel', url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=100&w=800&auto=format&fit=crop' },
  { id: 'c3', name: 'Holo Sweetie', url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=100&w=800&auto=format&fit=crop' },
  { id: 'c4', name: 'Aura', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=100&w=800&auto=format&fit=crop' },
  { id: 'c5', name: 'Nova', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=100&w=800&auto=format&fit=crop' },
  { id: 'c6', name: 'Luna', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=100&w=800&auto=format&fit=crop' },
  { id: 'c7', name: 'Stella', url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=100&w=800&auto=format&fit=crop' },
  { id: 'c8', name: 'Iris', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=100&w=800&auto=format&fit=crop' },
  { id: 'c9', name: 'Maya', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=100&w=800&auto=format&fit=crop' },
  { id: 'c10', name: 'Chloe', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=100&w=800&auto=format&fit=crop' },
  { id: 'c11', name: 'Zoe', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=100&w=800&auto=format&fit=crop' },
  { id: 'c12', name: 'Ruby', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=100&w=800&auto=format&fit=crop' },
  { id: 'c13', name: 'Jade', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=100&w=800&auto=format&fit=crop' },
  { id: 'c14', name: 'Amber', url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=100&w=800&auto=format&fit=crop' },
  { id: 'c15', name: 'Pearl', url: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?q=100&w=800&auto=format&fit=crop' },
  { id: 'c16', name: 'Opal', url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=100&w=800&auto=format&fit=crop' },
  { id: 'c17', name: 'Daisy', url: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=100&w=800&auto=format&fit=crop' },
  { id: 'c18', name: 'Lily', url: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?q=100&w=800&auto=format&fit=crop' },
  { id: 'c19', name: 'Rose', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=100&w=800&auto=format&fit=crop' },
  { id: 'c20', name: 'Pixie', url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=100&w=800&auto=format&fit=crop' },
];

const VirtualRoom = ({ isSpeaking, status, characterImage, isSleeping }: { isSpeaking: boolean, status: string, characterImage?: string, isSleeping: boolean }) => {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* 3D Room Background */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
      
      {/* 50 Size (200px) 3D Glass Bubble */}
      <motion.div 
        animate={{ 
          scale: isSleeping ? 0.9 : (isSpeaking ? 1.1 : 1),
          y: isSleeping ? 20 : (isSpeaking ? -10 : 0)
        }}
        transition={{ duration: 2, repeat: isSleeping ? Infinity : 0, repeatType: "reverse", ease: "easeInOut" }}
        className="relative w-[200px] h-[200px] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* 3D Glass Bubble Effect (The "Room" for the character) */}
        <div className="absolute inset-0 rounded-full border border-white/30 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm shadow-[inset_0_0_30px_rgba(255,255,255,0.3)] z-20 pointer-events-none" />
        
        {/* Outer Tech Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={cn(
            "absolute -inset-4 rounded-full border-2 border-dashed transition-all duration-1000 z-0",
            status === 'connected' && !isSleeping ? "border-cyan-400/50" : "border-zinc-700/50",
            isSpeaking && "border-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          )}
        />
        
        {/* Character Image inside the Bubble */}
        <div className="absolute inset-0 rounded-full overflow-hidden bg-black z-10">
          <img 
            src={characterImage || CHARACTERS[0].url} 
            alt="JH AI" 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              isSleeping ? "brightness-40 grayscale" : "brightness-110 saturate-125",
              isSpeaking && "scale-110"
            )}
          />
        </div>

        {/* Light Reflection on Glass Bubble */}
        <div className="absolute top-2 left-4 w-12 h-6 bg-white/40 rounded-full blur-[2px] rotate-[-45deg] z-30 pointer-events-none" />

        {/* Speaking Glow Aura */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cyan-500/30 blur-[40px] rounded-full z-0"
            />
          )}
        </AnimatePresence>

        {/* Sleeping Zzz Indicator */}
        <AnimatePresence>
          {isSleeping && (
            <motion.div 
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -40, x: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 right-0 text-cyan-500 font-bold text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] z-40"
            >
              Zzz...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const FloatingBubble = ({ characterImage, isSpeaking, onClick }: { characterImage: string, isSpeaking: boolean, onClick: () => void }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth - 50, top: 0, bottom: window.innerHeight - 50 }}
      className={cn(
        "fixed top-20 right-4 w-[50px] h-[50px] rounded-full overflow-hidden border-2 z-[100] cursor-grab active:cursor-grabbing shadow-lg",
        isSpeaking ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" : "border-white/20"
      )}
      onClick={onClick}
    >
      <img src={characterImage} className="w-full h-full object-cover" />
      {isSpeaking && (
        <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />
      )}
    </motion.div>
  );
};

export default function App() {
  const [appMode, setAppMode] = useState<'welcome' | 'setup' | 'active'>('welcome');
  const [status, setStatus] = useState<'standby' | 'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [isAutoReconnecting, setIsAutoReconnecting] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [devTapCount, setDevTapCount] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [isWallpaperMode, setIsWallpaperMode] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('jh_ai_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      aiName: 'Sweetie',
      userName: 'Boss',
      language: 'Bengali',
      voiceEnrolled: false,
      characterId: 'c1',
      voiceId: 'Kore',
      characterImage: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?q=100&w=800&auto=format&fit=crop',
      customApis: []
    };
  });

  useEffect(() => {
    localStorage.setItem('jh_ai_settings', JSON.stringify(settings));
  }, [settings]);

  // 24/7 Wake Word Listener (Always Active in Background)
  useEffect(() => {
    if ((status === 'connected' || status === 'connecting') && !isSleeping) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.language === 'Bengali' ? 'bn-BD' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('').toLowerCase();

      if (transcript.includes(settings.aiName.toLowerCase()) || transcript.includes('jh ai')) {
        if (isSleeping || status === 'disconnected') {
          vibrate([100, 50, 100]);
          setIsSleeping(false);
          
          // Wake word detected! Play "Uhh" sound and connect
          const utterance = new SpeechSynthesisUtterance(settings.language === 'Bengali' ? "জি বস?" : "Yes boss?");
          utterance.lang = settings.language === 'Bengali' ? 'bn-BD' : 'en-US';
          window.speechSynthesis.speak(utterance);
          
          recognition.stop();
          setAppMode('active');
          initPowerfulMic().then(() => connectToGemini());
        }
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [status, isSleeping, settings.aiName, settings.language]);

  const handleDevTap = () => {
    setDevTapCount(p => {
      const newCount = p + 1;
      if (newCount >= 7) {
        setDevMode(true);
        vibrate([50, 50, 50]);
        return 0;
      }
      return newCount;
    });
  };

  const serviceRef = useRef<GeminiLiveService | null>(null);
  const persistentMicRef = useRef<MediaStream | null>(null);
  const wakeLockRef = useRef<any>(null);

  // 100% Native App Feature: Haptic Feedback (Vibration)
  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch(e) {}
    }
  };

  // 100% Native App Feature: Keep Screen On while talking
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().then(() => { wakeLockRef.current = null; });
    }
  };

  const initPowerfulMic = async () => {
    if (!persistentMicRef.current) {
      try {
        persistentMicRef.current = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
      } catch (e) {
        console.error("Mic error", e);
      }
    }
  };
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectToGemini = async () => {
    vibrate([50, 50, 50]); // Triple vibration on connect
    requestWakeLock(); // Keep screen on
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      alert("Gemini API Key is missing. Please set it in the Secrets panel.");
      return;
    }

    if (!serviceRef.current) {
      serviceRef.current = new GeminiLiveService(apiKey);
    }

    await serviceRef.current.connect(settings, {
      onStatusChange: (newStatus) => {
        setStatus(newStatus as any);
        if (newStatus === 'disconnected' && !isAutoReconnecting) {
          // Auto-reconnect if dropped unexpectedly
          console.log("Connection dropped, attempting auto-reconnect...");
          setIsAutoReconnecting(true);
          setTimeout(() => {
            connectToGemini().then(() => setIsAutoReconnecting(false));
          }, 2000);
        }
      },
      onAudioData: () => {
        setIsSpeaking(true);
        if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 1000);
      },
      onInterrupted: () => setIsSpeaking(false),
      onError: (err) => {
        console.error("Assistant Error:", err);
        setStatus('error');
      }
    });
  };

  const handleToggle = useCallback(async () => {
    vibrate(50); // Single vibration on tap
    if (isSleeping) {
      setIsSleeping(false);
      connectToGemini();
    } else if (status === 'connected' || status === 'connecting') {
      setIsAutoReconnecting(true); // Prevent auto-reconnect on manual disconnect
      serviceRef.current?.disconnect();
      releaseWakeLock();
      setTimeout(() => setIsAutoReconnecting(false), 3000);
    } else {
      setIsAutoReconnecting(false);
      connectToGemini();
    }
  }, [status, isSleeping]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      serviceRef.current?.disconnect();
      releaseWakeLock();
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    };
  }, []);

  const handleSaveSettings = () => {
    setShowSettings(false);
    if (status === 'connected') {
      serviceRef.current?.disconnect();
      setTimeout(() => connectToGemini(), 500);
    }
  };

  const simulateVoiceEnrollment = () => {
    setSetupStep(1);
    setTimeout(() => setSetupStep(2), 3000); // Fake analyzing
    setTimeout(() => {
      setSettings({...settings, voiceEnrolled: true});
      setSetupStep(3);
    }, 5000);
  };

  const handleAddApi = () => {
    setSettings({
      ...settings,
      customApis: [...settings.customApis, { id: Date.now().toString(), platform: '', key: '' }]
    });
  };

  const handleUpdateApi = (id: string, field: 'platform' | 'key', value: string) => {
    setSettings({
      ...settings,
      customApis: settings.customApis.map(api => api.id === id ? { ...api, [field]: value } : api)
    });
  };

  const handleRemoveApi = (id: string) => {
    setSettings({
      ...settings,
      customApis: settings.customApis.filter(api => api.id !== id)
    });
  };

  if (appMode === 'welcome') {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 z-10"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">JH AI</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-md mx-auto">Your personal, emotion-aware AI companion.</p>
          
          <button 
            onClick={() => {
              vibrate(50);
              const saved = localStorage.getItem('jh_ai_settings');
              if (saved) {
                setAppMode('active');
                initPowerfulMic().then(() => connectToGemini());
              } else {
                setAppMode('setup');
              }
            }}
            className="px-12 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          >
            START
          </button>
        </motion.div>

        <footer className="absolute bottom-6 text-zinc-500 text-sm font-medium tracking-widest uppercase">
          জুয়েল হাসানের তৈরি
        </footer>
      </div>
    );
  }

  if (appMode === 'setup') {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[120px] rounded-full" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl z-10 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Setup Your AI</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">JH AI's Nickname</label>
              <input 
                type="text" 
                value={settings.aiName}
                onChange={(e) => setSettings({...settings, aiName: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Sweetie"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">What should JH AI call you?</label>
              <input 
                type="text" 
                value={settings.userName}
                onChange={(e) => setSettings({...settings, userName: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Boss"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Character</label>
              <div className="relative">
                <select 
                  value={settings.characterId}
                  onChange={(e) => setSettings({...settings, characterId: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="anime_girl">Anime Girl</option>
                  <option value="robot">Cute Robot</option>
                  <option value="ghost">Little Ghost</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Voice</label>
              <div className="relative">
                <select 
                  value={settings.voiceId}
                  onChange={(e) => setSettings({...settings, voiceId: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="Puck">Puck (Sweet/Female)</option>
                  <option value="Kore">Kore (Calm/Female)</option>
                  <option value="Charon">Charon (Deep/Male)</option>
                  <option value="Fenrir">Fenrir (Strong/Male)</option>
                  <option value="Zephyr">Zephyr (Energetic/Male)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              vibrate(50);
              setAppMode('active');
              initPowerfulMic().then(() => connectToGemini());
            }}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl mt-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            COMPLETE SETUP
          </button>
        </motion.div>

        <footer className="absolute bottom-6 text-zinc-500 text-sm font-medium tracking-widest uppercase">
          জুয়েল হাসানের তৈরি
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Virtual Room Environment */}
      <VirtualRoom isSpeaking={isSpeaking} status={status} characterImage={settings.characterImage} isSleeping={isSleeping} />
      
      {/* Top Bar */}
      <header className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px]", status === 'disconnected' ? "bg-red-500 shadow-red-500" : "bg-cyan-400 shadow-cyan-400 animate-pulse")} />
            <span className={cn("font-mono text-sm tracking-widest uppercase font-bold", status === 'disconnected' ? "text-red-500" : "text-cyan-400")}>
              {status === 'disconnected' ? 'SLEEPING (24/7)' : 'ONLINE'}
            </span>
          </div>
          
          <button 
            onClick={handleToggle}
            className={cn(
              "px-5 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-lg border backdrop-blur-md",
              status === 'disconnected' && !isSleeping
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30" 
                : "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
            )}
          >
            {status === 'disconnected' && !isSleeping ? 'Wake Up' : 'Shut Down'}
          </button>

          <button 
            onClick={() => {
              setIsWallpaperMode(true);
              try {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(e => console.log(e));
                } else {
                  document.exitFullscreen().catch(e => console.log(e));
                }
              } catch (e) {}
              alert("Web Live Wallpaper: Fullscreen mode activated!\n\nNote: Browsers don't allow setting the actual phone wallpaper directly. To set it as your real phone wallpaper, you need to install the Android APK. For now, enjoy this fullscreen web experience!");
            }}
            className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-full border border-purple-500/30 transition-colors backdrop-blur-md text-[10px] font-bold uppercase tracking-wider hidden md:block"
          >
            Wallpaper
          </button>
        </div>
        
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 bg-black/50 hover:bg-white/10 rounded-full border border-white/10 transition-colors backdrop-blur-md"
        >
          <Settings className="w-5 h-5 text-zinc-300" />
        </button>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-start pt-10 min-h-[80vh] text-center px-6 pointer-events-none">
        <AnimatePresence>
          {status === 'disconnected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-white/10 pointer-events-auto mt-10"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">JH AI</span>
              </h1>

              <p className="text-sm text-zinc-400 max-w-xl mx-auto font-medium uppercase tracking-widest">
                System Offline
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating 50px Bubble (Chat Head) */}
      {appMode === 'active' && (
        <FloatingBubble 
          characterImage={settings.characterImage || CHARACTERS[0].url} 
          isSpeaking={isSpeaking} 
          onClick={handleToggle}
        />
      )}

      {/* Floating UI */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex gap-4 items-center bg-black/40 p-3 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
          <button 
            onClick={() => {
              setIsSleeping(true);
              serviceRef.current?.disconnect();
            }}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors shadow-inner"
            title="Sleep Mode"
          >
            <Moon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleToggle}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
              isSleeping ? "bg-zinc-800 text-zinc-500" :
              status === 'connected' 
                ? "bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.6)] scale-110" 
                : status === 'connecting'
                  ? "bg-yellow-500 text-black animate-pulse"
                  : "bg-white text-black hover:scale-105"
            )}
          >
            {isSleeping ? <Moon className="w-8 h-8" /> :
             status === 'connected' ? <Mic className="w-8 h-8" /> : 
             status === 'connecting' ? <Loader2 className="w-8 h-8 animate-spin" /> : 
             <Power className="w-8 h-8" />}
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shadow-inner"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold text-white select-none cursor-pointer" onClick={handleDevTap}>System Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Voice Lock Section */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-cyan-400">Voice Lock Security</h3>
                    {settings.voiceEnrolled ? (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Enrolled</span>
                    ) : (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Not Enrolled</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">Train the AI to only recognize and respond to your voice. This enables background noise cancellation and ignores other people's voices.</p>
                  <button 
                    onClick={() => {setShowSettings(false); setShowVoiceSetup(true); setSetupStep(0);}}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    {settings.voiceEnrolled ? "Retrain Voice" : "Setup Voice Lock"}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">JH AI's Nickname</label>
                  <input 
                    type="text" 
                    value={settings.aiName}
                    onChange={(e) => setSettings({...settings, aiName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    value={settings.userName}
                    onChange={(e) => setSettings({...settings, userName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Language</label>
                  <div className="relative">
                    <select 
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="English">English</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">3D Character Wallpapers (20+ Models)</label>
                    <span className="text-[10px] text-cyan-500 font-bold animate-pulse">LIVE 3D</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2 bg-black/30 rounded-xl border border-white/5 scrollbar-hide">
                    {CHARACTERS.map((char) => (
                      <div key={char.id} className="group relative aspect-square">
                        <button
                          onClick={() => setSettings({...settings, characterId: char.id, characterImage: char.url})}
                          className={cn(
                            "w-full h-full rounded-full overflow-hidden border-2 transition-all",
                            settings.characterId === char.id ? "border-cyan-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={char.url} alt={char.name} className="w-full h-full object-cover" />
                          {settings.characterId === char.id && (
                            <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                              <ShieldCheck className="w-6 h-6 text-cyan-400" />
                            </div>
                          )}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = char.url;
                            link.download = `${char.name}_Wallpaper.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            alert(`Downloading ${char.name} wallpaper! You can set this as your phone wallpaper.`);
                          }}
                          className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-400 shadow-lg"
                          title="Download Wallpaper"
                        >
                          <Download className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 text-center italic">Tap to select AI character. Tap icon to download for phone wallpaper.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Romantic Voice Profile</label>
                  <div className="relative">
                    <select 
                      value={settings.voiceId}
                      onChange={(e) => setSettings({...settings, voiceId: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="Puck">Sweetheart (Puck)</option>
                      <option value="Kore">Romantic Soul (Kore)</option>
                      <option value="Fenrir">Passionate (Fenrir)</option>
                      <option value="Zephyr">Energetic Love (Zephyr)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {devMode && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-purple-400">Developer API Configuration</h3>
                      <button 
                        onClick={handleAddApi}
                        className="p-1.5 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {settings.customApis.map((api) => (
                        <div key={api.id} className="flex gap-2 items-start bg-black/30 p-3 rounded-lg border border-white/5">
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text" 
                              value={api.platform}
                              onChange={(e) => handleUpdateApi(api.id, 'platform', e.target.value)}
                              placeholder="Platform Name (e.g. OpenAI)"
                              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                            <input 
                              type="password" 
                              value={api.key}
                              onChange={(e) => handleUpdateApi(api.id, 'key', e.target.value)}
                              placeholder="API Key"
                              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                            />
                          </div>
                          <button 
                            onClick={() => handleRemoveApi(api.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {settings.customApis.length === 0 && (
                        <p className="text-xs text-zinc-500 text-center py-2">No custom APIs added.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5">
                <button 
                  onClick={handleSaveSettings}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition-colors"
                >
                  SAVE & START
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-lg transition-colors border border-red-500/30"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Setup Modal */}
      <AnimatePresence>
        {showVoiceSetup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="bg-[#111] border border-cyan-500/30 rounded-2xl w-full max-w-md p-8 text-center space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-cyan-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white">Voice Calibration</h2>
              
              {setupStep === 0 && (
                <div className="space-y-4">
                  <p className="text-zinc-400">Please read the following phrase aloud clearly to lock your voice profile:</p>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-lg font-medium text-cyan-300">"Hello {settings.aiName}, I am your boss."</p>
                  </div>
                  <button 
                    onClick={simulateVoiceEnrollment}
                    className="w-full py-3 bg-cyan-500 text-black font-semibold rounded-lg mt-4"
                  >
                    Start Recording
                  </button>
                </div>
              )}

              {setupStep === 1 && (
                <div className="space-y-4 py-8">
                  <div className="flex justify-center space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, 40, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-2 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-cyan-400 animate-pulse">Listening...</p>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-4 py-8">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-4 border-blue-500/30 border-b-blue-400 rounded-full animate-spin-reverse" />
                    <Mic className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest">Extracting Biometrics...</p>
                  <p className="text-zinc-500 text-xs">Generating acoustic signature</p>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-green-400 font-medium text-lg">Voice Locked Successfully!</p>
                  <p className="text-sm text-zinc-400">Sweetie will now only respond to your voice.</p>
                  <button 
                    onClick={() => {setShowVoiceSetup(false); setShowSettings(true);}}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg mt-4"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status Toast */}
      <AnimatePresence>
        {status === 'connecting' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md border bg-yellow-500/10 border-yellow-500/30 text-yellow-400">
              Connecting to AI Server...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-0 right-0 text-center text-zinc-500 text-sm font-medium tracking-widest uppercase pointer-events-none z-30">
        জুয়েল হাসানের তৈরি
      </footer>
    </div>
  );
}
