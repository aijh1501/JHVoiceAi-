import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { MicOff } from 'lucide-react';

interface CharacterBubbleProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error' | 'standby';
  isSpeaking: boolean;
  onToggle: () => void;
  characterId: string;
}

const RealCharacter = ({ isSpeaking, type }: { isSpeaking: boolean, type: string }) => {
  // Android App Ready: 
  // When you build the APK, you can replace these URLs with your local assets 
  // like "assets/idle_character.png" and "assets/talking_character.gif"
  const avatars = {
    anime_girl: {
      idle: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=100&w=800&auto=format&fit=crop",
      talking: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=100&w=800&auto=format&fit=crop" // Replace with your talking_character.gif
    },
    robot: {
      idle: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=100&w=800&auto=format&fit=crop",
      talking: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=100&w=800&auto=format&fit=crop" // Replace with your talking_character.gif
    },
    ghost: {
      idle: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=100&w=800&auto=format&fit=crop",
      talking: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=100&w=800&auto=format&fit=crop" // Replace with your talking_character.gif
    }
  };
  
  const currentAvatar = avatars[type as keyof typeof avatars] || avatars.anime_girl;

  return (
    <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none flex flex-col items-center justify-end z-20">
      {/* 4K Head/Avatar with Fluid Squash & Stretch Breathing/Talking */}
      <motion.div 
        animate={
          isSpeaking 
            ? { y: [0, -4, 0, -2, 0], scaleY: [1, 1.04, 1, 1.02, 1], scaleX: [1, 0.97, 1, 0.98, 1] } 
            : { y: [0, -3, 0], scaleY: [1, 1.02, 1], scaleX: [1, 0.99, 1] }
        }
        transition={
          isSpeaking 
            ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" } 
            : { repeat: Infinity, duration: 3.5, ease: "easeInOut" } // Slow breathing when idle
        }
        className="w-16 h-16 rounded-full relative z-10 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border-2 border-cyan-400 bg-black"
      >
        {/* Smooth Crossfade between Idle and Talking images */}
        <motion.img 
          src={currentAvatar.idle} 
          alt="Idle" 
          initial={false}
          animate={{ opacity: isSpeaking ? 0 : 1, scale: isSpeaking ? 1.05 : 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ filter: 'contrast(1.1) saturate(1.2)' }} 
        />
        <motion.img 
          src={currentAvatar.talking} 
          alt="Talking" 
          initial={false}
          animate={{ opacity: isSpeaking ? 1 : 0, scale: isSpeaking ? 1 : 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ filter: 'contrast(1.1) saturate(1.2)' }} 
        />
      </motion.div>
      
      {/* Legs hanging down - Fluid swinging */}
      <div className="absolute top-[60px] left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <motion.div 
          animate={
            isSpeaking 
              ? { rotate: [0, 30, 0, -20, 0], y: [0, -2, 0, -1, 0] }
              : { rotate: [0, 15, 0, -10, 0], y: [0, 0, 0] }
          }
          transition={
            isSpeaking
              ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
          }
          className="w-2.5 h-8 rounded-full origin-top shadow-md"
          style={{ backgroundColor: '#ff6699' }}
        />
        <motion.div 
          animate={
            isSpeaking 
              ? { rotate: [0, -20, 0, 30, 0], y: [0, -1, 0, -2, 0] }
              : { rotate: [0, -10, 0, 15, 0], y: [0, 0, 0] }
          }
          transition={
            isSpeaking
              ? { repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }
              : { repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }
          }
          className="w-2.5 h-8 rounded-full origin-top shadow-md"
          style={{ backgroundColor: '#ff6699' }}
        />
      </div>
    </div>
  );
};

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({ status, isSpeaking, onToggle, characterId }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      style={{ right: 20, bottom: 20 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      <div 
        className="relative group w-[70px] h-[70px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Bubble Room */}
        <motion.div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center overflow-visible transition-all duration-300 relative",
            status === 'connected' ? "border-2 border-cyan-400 bg-cyan-900/40 shadow-[0_0_15px_rgba(34,211,238,0.6)] backdrop-blur-md" : 
            status === 'standby' ? "border-2 border-blue-400 bg-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.6)] backdrop-blur-md" :
            "border-2 border-gray-600 bg-gray-800",
            status === 'connecting' && "animate-pulse border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]",
            status === 'error' && "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
          )}
          animate={isSpeaking ? {
            boxShadow: [
              "0 0 10px rgba(34, 211, 238, 0.5)",
              "0 0 25px rgba(34, 211, 238, 0.9)",
              "0 0 10px rgba(34, 211, 238, 0.5)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          {/* Inner Room Details */}
          <div className="absolute inset-2 rounded-full border border-white/10 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
          
          {/* Character Sitting on the edge */}
          {(status === 'connected' || status === 'connecting' || status === 'standby') && (
            <RealCharacter isSpeaking={isSpeaking} type={characterId} />
          )}

          {status === 'disconnected' && (
            <MicOff className="text-gray-400 w-6 h-6" />
          )}
          
          {/* Invisible button to capture clicks without interfering with drag */}
          <div 
            className="absolute inset-0 rounded-full cursor-pointer"
            onClick={onToggle}
          />
        </motion.div>

        {/* Status Indicator */}
        <div className={cn(
          "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0502] z-30",
          status === 'connected' ? "bg-cyan-400 shadow-[0_0_8px_cyan]" : 
          status === 'standby' ? "bg-blue-400 shadow-[0_0_8px_blue]" : "bg-gray-500",
          status === 'connecting' && "bg-yellow-400",
          status === 'error' && "bg-red-500"
        )} />

        {/* Hover Label */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-black/90 border border-cyan-500/30 text-cyan-50 text-[10px] py-1 px-2 rounded-md whitespace-nowrap pointer-events-none shadow-lg backdrop-blur-sm z-40"
            >
              {status === 'connected' ? "AI Active" : 
               status === 'standby' ? "Listening for wake word..." : "Tap to activate AI"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
