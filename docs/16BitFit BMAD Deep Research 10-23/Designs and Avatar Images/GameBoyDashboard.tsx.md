import React, { useState } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';  
import { Dumbbell, Sword, Home, User, Settings } from 'lucide-react';  
type GameBoyDashboardProps \= Record\<string, never\>;  
const DMG\_PALETTE \= {  
  darkest: '\#0F380F',  
  dark: '\#306230',  
  light: '\#8BAC0F',  
  lightest: '\#9BBC0F'  
};  
const SHELL\_PALETTE \= {  
  body: '\#D7D5CA',  
  bezel: '\#9A9A9A',  
  dpad: '\#1C1C1C',  
  ab: '\#B64A75',  
  startSelect: '\#9E9E9E',  
  speaker: '\#6C6B6B'  
};  
const HomeAvatar \= () \=\> {  
  const \[blinkState, setBlinkState\] \= useState(false);  
  React.useEffect(() \=\> {  
    const interval \= setInterval(() \=\> {  
      setBlinkState(true);  
      setTimeout(() \=\> setBlinkState(false), 150);  
    }, 6000);  
    return () \=\> clearInterval(interval);  
  }, \[\]);  
  return \<div className="relative mx-auto" style={{  
    width: '128px',  
    height: '128px',  
    backgroundColor: DMG\_PALETTE.lightest,  
    border: \`2px solid ${DMG\_PALETTE.darkest}\`,  
    imageRendering: 'pixelated'  
  }}\>  
      \<svg width="128" height="128" viewBox="0 0 128 128" style={{  
      imageRendering: 'pixelated'  
    }}\>  
        \<rect x="48" y="32" width="32" height="40" fill={DMG\_PALETTE.dark} /\>  
        \<rect x="44" y="36" width="40" height="32" fill={DMG\_PALETTE.dark} /\>  
        \<rect x="52" y="28" width="24" height="4" fill={DMG\_PALETTE.darkest} /\>  
        \<rect x="56" y="48" width="6" height={blinkState ? '2' : '8'} fill={DMG\_PALETTE.darkest} /\>  
        \<rect x="66" y="48" width="6" height={blinkState ? '2' : '8'} fill={DMG\_PALETTE.darkest} /\>  
        \<rect x="58" y="60" width="12" height="4" fill={DMG\_PALETTE.darkest} /\>  
        \<rect x="40" y="76" width="48" height="24" fill={DMG\_PALETTE.light} /\>  
        \<rect x="36" y="80" width="56" height="16" fill={DMG\_PALETTE.light} /\>  
        \<rect x="48" y="100" width="12" height="8" fill={DMG\_PALETTE.dark} /\>  
        \<rect x="68" y="100" width="12" height="8" fill={DMG\_PALETTE.dark} /\>  
      \</svg\>  
    \</div\>;  
};  
const ProgressRing \= ({  
  label,  
  level,  
  progress,  
  icon,  
  color  
}: {  
  label: string;  
  level: number;  
  progress: number;  
  icon: 'dumbbell' | 'fist';  
  color?: string;  
}) \=\> {  
  const radius \= 28;  
  const circumference \= 2 \* Math.PI \* radius;  
  const offset \= circumference \- progress / 100 \* circumference;  
  const ringColor \= color || DMG\_PALETTE.dark;  
  return \<div className="flex flex-col items-center gap-1"\>  
      \<svg width="64" height="64" viewBox="0 0 64 64" style={{  
      imageRendering: 'pixelated'  
    }}\>  
        \<circle cx="32" cy="32" r={radius} fill="none" stroke={DMG\_PALETTE.light} strokeWidth="4" /\>  
        \<circle cx="32" cy="32" r={radius} fill="none" stroke={ringColor} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 32 32)" /\>  
        {icon \=== 'dumbbell' && \<\>  
            \<rect x="20" y="30" width="24" height="4" fill={DMG\_PALETTE.darkest} /\>  
            \<rect x="18" y="28" width="4" height="8" fill={DMG\_PALETTE.darkest} /\>  
            \<rect x="42" y="28" width="4" height="8" fill={DMG\_PALETTE.darkest} /\>  
          \</\>}  
        {icon \=== 'fist' && \<\>  
            \<rect x="24" y="24" width="16" height="12" fill={DMG\_PALETTE.darkest} /\>  
            \<rect x="28" y="20" width="8" height="4" fill={DMG\_PALETTE.darkest} /\>  
            \<rect x="24" y="36" width="4" height="8" fill={DMG\_PALETTE.darkest} /\>  
          \</\>}  
      \</svg\>  
      \<div className="text-center font-mono" style={{  
      fontSize: '8px',  
      color: DMG\_PALETTE.darkest,  
      fontFamily: '"Press Start 2P", monospace',  
      letterSpacing: '0'  
    }}\>  
        {label}  
      \</div\>  
      \<div className="font-mono" style={{  
      fontSize: '10px',  
      color: DMG\_PALETTE.darkest,  
      fontFamily: '"Press Start 2P", monospace'  
    }}\>  
        {level}  
      \</div\>  
    \</div\>;  
};  
const MomentumBar \= ({  
  filled,  
  total  
}: {  
  filled: number;  
  total: number;  
}) \=\> {  
  return \<div className="flex gap-1 items-center justify-center"\>  
      {Array.from({  
      length: total  
    }).map((\_, i) \=\> \<div key={i} style={{  
      width: '16px',  
      height: '8px',  
      backgroundColor: i \< filled ? DMG\_PALETTE.dark : DMG\_PALETTE.light,  
      border: \`1px solid ${DMG\_PALETTE.darkest}\`,  
      imageRendering: 'pixelated'  
    }} /\>)}  
    \</div\>;  
};  
const QuestCartridge \= ({  
  onClick  
}: {  
  onClick: () \=\> void;  
}) \=\> {  
  return \<motion.button whileTap={{  
    scale: 0.98,  
    y: 2  
  }} transition={{  
    duration: 0.15  
  }} onClick={onClick} className="relative mx-auto" style={{  
    width: '200px',  
    height: '80px',  
    backgroundColor: DMG\_PALETTE.darkest,  
    border: \`3px solid ${DMG\_PALETTE.dark}\`,  
    imageRendering: 'pixelated',  
    cursor: 'pointer'  
  }}\>  
      \<div className="flex flex-col items-center justify-center h-full gap-2"\>  
        \<div className="font-mono text-center" style={{  
        fontSize: '10px',  
        color: DMG\_PALETTE.lightest,  
        fontFamily: '"Press Start 2P", monospace',  
        lineHeight: '1.4'  
      }}\>  
          DAILY QUEST  
        \</div\>  
        \<div className="font-mono text-center" style={{  
        fontSize: '8px',  
        color: DMG\_PALETTE.light,  
        fontFamily: '"Press Start 2P", monospace'  
      }}\>  
          15 Min Walk  
        \</div\>  
      \</div\>  
      \<div style={{  
      position: 'absolute',  
      bottom: '8px',  
      left: '50%',  
      transform: 'translateX(-50%)',  
      width: '60%',  
      height: '4px',  
      backgroundColor: DMG\_PALETTE.dark,  
      display: "none"  
    }} /\>  
    \</motion.button\>;  
};  
const TabBar \= ({  
  activeTab,  
  onTabChange  
}: {  
  activeTab: string;  
  onTabChange: (tab: string) \=\> void;  
}) \=\> {  
  const tabs \= \[{  
    id: 'home',  
    label: 'HOME',  
    icon: Home  
  }, {  
    id: 'battle',  
    label: 'FIGHT',  
    icon: Sword  
  }, {  
    id: 'profile',  
    label: 'YOU',  
    icon: User  
  }, {  
    id: 'settings',  
    label: 'GEAR',  
    icon: Settings  
  }\] as any\[\];  
  return \<div className="flex justify-around items-center" style={{  
    height: '56px',  
    backgroundColor: DMG\_PALETTE.lightest,  
    borderTop: \`2px solid ${DMG\_PALETTE.darkest}\`  
  }}\>  
      {tabs.map(tab \=\> {  
      const Icon \= tab.icon;  
      const isActive \= activeTab \=== tab.id;  
      return \<motion.button key={tab.id} whileTap={{  
        scale: 0.96,  
        y: 1  
      }} onClick={() \=\> onTabChange(tab.id)} className="flex flex-col items-center justify-center gap-1" style={{  
        flex: 1,  
        height: '100%',  
        backgroundColor: isActive ? DMG\_PALETTE.darkest : 'transparent',  
        border: 'none',  
        cursor: 'pointer'  
      }}\>  
            \<Icon size={16} style={{  
          color: isActive ? DMG\_PALETTE.lightest : DMG\_PALETTE.darkest,  
          strokeWidth: 3  
        }} /\>  
            \<div className="font-mono" style={{  
          fontSize: '6px',  
          color: isActive ? DMG\_PALETTE.lightest : DMG\_PALETTE.darkest,  
          fontFamily: '"Press Start 2P", monospace'  
        }}\>  
              {tab.label}  
            \</div\>  
          \</motion.button\>;  
    })}  
    \</div\>;  
};  
const StatsRibbon \= () \=\> {  
  const stats \= \[{  
    label: 'STEPS',  
    value: '7,560'  
  }, {  
    label: 'CALORIES',  
    value: '340'  
  }, {  
    label: 'WORKOUT',  
    value: '22m'  
  }\] as any\[\];  
  return \<div className="flex justify-around gap-1 px-2"\>  
      {stats.map((stat, i) \=\> \<div key={i} className="flex-1 flex flex-col items-center py-1.5" style={{  
      backgroundColor: SHELL\_PALETTE.body,  
      border: \`2px solid ${SHELL\_PALETTE.speaker}\`,  
      imageRendering: 'pixelated'  
    }}\>  
          \<div className="font-mono" style={{  
        fontSize: '7px',  
        color: SHELL\_PALETTE.dpad,  
        fontFamily: '"Press Start 2P", monospace',  
        marginBottom: '2px'  
      }}\>  
            {stat.label}  
          \</div\>  
          \<div className="font-mono" style={{  
        fontSize: '10px',  
        color: SHELL\_PALETTE.dpad,  
        fontFamily: '"Press Start 2P", monospace'  
      }}\>  
            {stat.value}  
          \</div\>  
        \</div\>)}  
    \</div\>;  
};  
const StatsPanel \= ({  
  onClose  
}: {  
  onClose: () \=\> void;  
}) \=\> {  
  return \<motion.div initial={{  
    y: '100%'  
  }} animate={{  
    y: 0  
  }} exit={{  
    y: '100%'  
  }} transition={{  
    duration: 0.25,  
    ease: 'easeOut'  
  }} className="absolute inset-0 z-50 flex flex-col" style={{  
    backgroundColor: SHELL\_PALETTE.body,  
    border: \`3px solid ${SHELL\_PALETTE.bezel}\`  
  }} onClick={onClose}\>  
      \<div className="flex-1 flex items-center justify-center"\>  
        \<div className="font-mono text-center" style={{  
        fontSize: '12px',  
        color: SHELL\_PALETTE.dpad,  
        fontFamily: '"Press Start 2P", monospace'  
      }}\>  
          STATS DETAILS  
          \<br /\>  
          \<br /\>  
          (Tap to close)  
        \</div\>  
      \</div\>  
    \</motion.div\>;  
};

// @component: GameBoyDashboard  
export const GameBoyDashboard \= (props: GameBoyDashboardProps) \=\> {  
  const \[activeTab, setActiveTab\] \= useState('home');  
  const \[showStatsPanel, setShowStatsPanel\] \= useState(false);  
  const handleRingsClick \= () \=\> {  
    setShowStatsPanel(true);  
  };  
  const handleQuestClick \= () \=\> {  
    console.log('Quest clicked \- navigate to workout screen');  
  };  
  const handleTabChange \= (tab: string) \=\> {  
    setActiveTab(tab);  
    console.log(\`Navigate to ${tab}\`);  
  };

  // @return  
  return \<div className="relative flex items-center justify-center p-8"\>  
      \<link rel="preconnect" href="https://fonts.googleapis.com" /\>  
      \<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /\>  
      \<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P\&display=swap" rel="stylesheet" /\>  
        
      \<div className="relative" style={{  
      width: '375px',  
      height: '667px',  
      backgroundColor: SHELL\_PALETTE.body,  
      borderRadius: '20px 20px 40px 40px',  
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',  
      padding: '20px',  
      imageRendering: 'pixelated'  
    }}\>  
        \<div className="absolute top-8 left-1/2 \-translate-x-1/2 flex gap-1" style={{  
        width: '60px',  
        height: '8px'  
      }}\>  
          {Array.from({  
          length: 6  
        }).map((\_, i) \=\> \<div key={i} style={{  
          flex: 1,  
          height: '100%',  
          backgroundColor: SHELL\_PALETTE.speaker,  
          borderRadius: '1px'  
        }} /\>)}  
        \</div\>

        \<div className="relative mt-12" style={{  
        backgroundColor: SHELL\_PALETTE.bezel,  
        padding: '12px',  
        borderRadius: '8px'  
      }}\>  
          \<div className="relative overflow-hidden" style={{  
          width: '100%',  
          height: '480px',  
          backgroundColor: DMG\_PALETTE.lightest,  
          imageRendering: 'pixelated'  
        }}\>  
            \<div className="h-full flex flex-col p-4 gap-4"\>  
              \<div className="text-center font-mono" style={{  
              fontSize: '12px',  
              color: DMG\_PALETTE.darkest,  
              fontFamily: '"Press Start 2P", monospace',  
              marginBottom: '8px'  
            }}\>16BitFit\</div\>

              \<HomeAvatar /\>

              \<motion.div className="flex justify-center gap-8" whileTap={{  
              scale: 0.98  
            }} onClick={handleRingsClick} style={{  
              cursor: 'pointer'  
            }}\>  
                \<ProgressRing label="FIT LVL" level={5} progress={75} icon="dumbbell" color="\#B64A75" /\>  
                \<ProgressRing label="SKILL LVL" level={3} progress={40} icon="fist" color="\#2C3FA3" /\>  
              \</motion.div\>

              \<MomentumBar filled={5} total={7} /\>

              \<div className="flex-1 flex flex-col items-center justify-center gap-2"\>  
                \<QuestCartridge onClick={handleQuestClick} /\>  
                \<button className="font-mono" style={{  
                fontSize: '8px',  
                color: DMG\_PALETTE.light,  
                fontFamily: '"Press Start 2P", monospace',  
                background: 'none',  
                border: 'none',  
                cursor: 'pointer',  
                textDecoration: 'underline'  
              }}\>  
                  Change Quest  
                \</button\>  
              \</div\>

              \<TabBar activeTab={activeTab} onTabChange={handleTabChange} /\>  
            \</div\>

            \<AnimatePresence\>  
              {showStatsPanel && \<StatsPanel onClose={() \=\> setShowStatsPanel(false)} /\>}  
            \</AnimatePresence\>  
          \</div\>  
        \</div\>

        \<div className="mt-3"\>  
          \<StatsRibbon /\>  
        \</div\>

        \<div className="absolute bottom-12 left-1/2 \-translate-x-1/2 flex gap-16" style={{  
        display: "none"  
      }}\>  
          \<div className="relative"\>  
            \<div style={{  
            width: '60px',  
            height: '60px',  
            backgroundColor: SHELL\_PALETTE.dpad,  
            borderRadius: '8px',  
            position: 'relative',  
            display: "none"  
          }}\>  
              \<div style={{  
              position: 'absolute',  
              top: '50%',  
              left: '50%',  
              transform: 'translate(-50%, \-50%)',  
              width: '48px',  
              height: '12px',  
              backgroundColor: SHELL\_PALETTE.body  
            }} /\>  
              \<div style={{  
              position: 'absolute',  
              top: '50%',  
              left: '50%',  
              transform: 'translate(-50%, \-50%)',  
              width: '12px',  
              height: '48px',  
              backgroundColor: SHELL\_PALETTE.body  
            }} /\>  
            \</div\>  
          \</div\>

          \<div className="flex gap-4 items-center"\>  
            \<div style={{  
            width: '32px',  
            height: '32px',  
            backgroundColor: SHELL\_PALETTE.ab,  
            borderRadius: '50%',  
            border: \`2px solid ${SHELL\_PALETTE.dpad}\`,  
            display: "none"  
          }} /\>  
            \<div style={{  
            width: '32px',  
            height: '32px',  
            backgroundColor: SHELL\_PALETTE.ab,  
            borderRadius: '50%',  
            border: \`2px solid ${SHELL\_PALETTE.dpad}\`  
          }} /\>  
          \</div\>  
        \</div\>

        \<div className="absolute bottom-4 left-1/2 \-translate-x-1/2 flex gap-4"\>  
          \<div style={{  
          width: '32px',  
          height: '8px',  
          backgroundColor: SHELL\_PALETTE.startSelect,  
          borderRadius: '12px',  
          transform: 'rotate(-20deg)'  
        }} /\>  
          \<div style={{  
          width: '32px',  
          height: '8px',  
          backgroundColor: SHELL\_PALETTE.startSelect,  
          borderRadius: '12px',  
          transform: 'rotate(-20deg)'  
        }} /\>  
        \</div\>  
      \</div\>  
    \</div\>;  
};  
