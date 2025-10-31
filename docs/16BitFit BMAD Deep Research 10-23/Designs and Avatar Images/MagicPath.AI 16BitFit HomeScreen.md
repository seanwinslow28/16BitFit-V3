import React from 'react';  
import { motion, useReducedMotion } from 'framer-motion';  
type HomeScreenProps \= {  
  steps?: number;  
  calories?: number;  
  workoutMinutes?: number;  
  onNavigate?: (route: 'activity' | 'history' | 'settings') \=\> void;  
};

// non-exported helpers and constants above the component  
const haptics \= {  
  light: () \=\> {  
    try {  
      if ('vibrate' in navigator) navigator.vibrate(10);  
    } catch {}  
  },  
  medium: () \=\> {  
    try {  
      if ('vibrate' in navigator) navigator.vibrate(\[10, 20, 10\]);  
    } catch {}  
  }  
};  
const formatNumber \= (n: number) \=\> new Intl.NumberFormat('en-US', {  
  maximumFractionDigits: 0  
}).format(n);

// @component: HomeScreen  
export const HomeScreen \= (props: HomeScreenProps) \=\> {  
  const steps \= props.steps ?? 7560;  
  const calories \= props.calories ?? 356;  
  const workoutMinutes \= props.workoutMinutes ?? 42;  
  const prefersReducedMotion \= useReducedMotion();  
  const pressVariants \= prefersReducedMotion ? {  
    rest: {},  
    tap: {},  
    release: {}  
  } : {  
    rest: {  
      scale: 1,  
      transition: {  
        type: 'spring',  
        stiffness: 500,  
        damping: 30  
      }  
    },  
    tap: {  
      scale: 0.98,  
      transition: {  
        duration: 0.1,  
        ease: 'easeIn'  
      }  
    },  
    release: {  
      scale: \[0.98, 1.02, 1\],  
      transition: {  
        times: \[0, 0.7, 1\],  
        duration: 0.18,  
        ease: 'easeOut'  
      }  
    }  
  };  
  const handlePress \= (route: 'activity' | 'history' | 'settings') \=\> {  
    haptics.light();  
    props.onNavigate?.(route);  
  };

  // @return  
  return \<div className="min-h-screen w-full flex items-center justify-center p-4" style={{  
    backgroundColor: '\#C4BEBB',  
    color: '\#272929'  
  }} aria-label="16BitFit Home Screen"\>  
      \<div className="w-full max-w-md border-2 rounded-lg shadow-xl overflow-hidden" style={{  
      borderColor: '\#545454',  
      backgroundColor: '\#C4BEBB'  
    }} role="region" aria-label="Device Shell"\>  
        \<div className="p-4 sm:p-6 space-y-6"\>  
          {/\* GB Screen \*/}  
          \<div className="relative rounded-\[4px\] border-2" style={{  
          backgroundColor: '\#9BBC0F',  
          borderColor: '\#0F380F',  
          boxShadow: 'inset 0 0 0 2px \#84D07D'  
        }} role="group" aria-label="Game Boy Screen"\>  
            {/\* Dot matrix overlay \*/}  
            \<div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-\[4px\]" style={{  
            maskImage: 'none',  
            opacity: 0.12,  
            backgroundImage: 'repeating-radial-gradient(circle,\#0F380F 0 0.5px,transparent 0 14px)',  
            imageRendering: 'pixelated'  
          }} /\>  
            \<div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col items-center gap-6"\>  
              \<h1 className="text-base sm:text-lg tracking-wider" style={{  
              fontFamily: '"Press Start 2P", monospace',  
              color: '\#0F380F'  
            }} aria-label="Title"\>  
                HOME  
              \</h1\>

              {/\* Avatar Panel \*/}  
              \<div className="w-full flex items-center justify-center"\>  
                \<div className="w-\[184px\] sm:w-\[200px\] rounded-\[4px\] p-3" style={{  
                border: '2px solid \#0F380F'  
              }} role="group" aria-label="Avatar Panel"\>  
                  \<div className="mx-auto w-\[144px\] h-\[144px\] rounded-\[4px\] border-2" style={{  
                  borderColor: '\#0F380F',  
                  backgroundColor: '\#8BAC0F',  
                  imageRendering: 'pixelated'  
                }} aria-label="Avatar" /\>  
                  \<div className="mt-3 text-center"\>  
                    \<p className="text-\[10px\] leading-4" style={{  
                    color: '\#0F380F',  
                    fontFamily: '"Press Start 2P", monospace'  
                  }}\>  
                      PLAYER 1  
                    \</p\>  
                  \</div\>  
                \</div\>  
              \</div\>

              {/\* Menu Stack \*/}  
              \<div className="w-full max-w-xs mx-auto space-y-3" role="menu" aria-label="Main Menu"\>  
                {\[{  
                key: 'activity',  
                label: 'ACTIVITY'  
              }, {  
                key: 'history',  
                label: 'BATTLE'  
              }, {  
                key: 'settings',  
                label: 'SETTINGS'  
              }\].map(item \=\> \<motion.button key={item.key} type="button" role="menuitem" aria-label={item.label} initial="rest" whileTap="tap" animate="release" variants={pressVariants} onClick={() \=\> handlePress(item.key as 'activity' | 'history' | 'settings')} onKeyDown={e \=\> {  
                if (e.key \=== 'Enter' || e.key \=== ' ') {  
                  e.preventDefault();  
                  handlePress(item.key as 'activity' | 'history' | 'settings');  
                }  
              }} className="w-full select-none" style={{  
                WebkitTapHighlightColor: 'transparent'  
              }}\>  
                    \<div className="w-full rounded-\[4px\] border-2 px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-\[var(--ring)\]" style={{  
                  borderColor: '\#0F380F',  
                  backgroundColor: '\#FF00FF',  
                  color: '\#0F380F',  
                  fontFamily: '"Press Start 2P", monospace',  
                  background: "\#ca3cca"  
                }}\>  
                      \<span className="text-\[12px\]"\>{item.label}\</span\>  
                    \</div\>  
                  \</motion.button\>)}  
              \</div\>  
            \</div\>  
          \</div\>

          {/\* Stats Ribbon \*/}  
          \<div className="w-full rounded-md border" style={{  
          borderColor: '\#545454',  
          backgroundColor: '\#C4BEBB'  
        }} role="region" aria-label="Stats Ribbon"\>  
            \<div className="grid grid-cols-3 divide-x" style={{  
            borderColor: '\#545454'  
          }}\>  
              {\[{  
              label: 'STEPS',  
              value: formatNumber(steps)  
            }, {  
              label: 'CALORIES',  
              value: formatNumber(calories)  
            }, {  
              label: 'WORKOUT',  
              value: \`${workoutMinutes} MIN\`  
            }\].map((s, i) \=\> \<div key={i} className="px-3 py-3 sm:py-4 flex flex-col items-center justify-center gap-1" style={{  
              minHeight: 56  
            }}\>  
                  \<span className="text-\[10px\] tracking-wide" style={{  
                color: '\#272929',  
                fontFamily: '"Press Start 2P", monospace'  
              }}\>  
                    {s.label}  
                  \</span\>  
                  \<span className="text-sm sm:text-base" style={{  
                color: '\#272929',  
                fontFamily: '"Press Start 2P", monospace'  
              }} aria-live="polite"\>  
                    {s.value}  
                  \</span\>  
                \</div\>)}  
            \</div\>  
          \</div\>

          {/\* Subtle shell hint \*/}  
          \<div className="text-center text-\[10px\]" style={{  
          fontFamily: '"Press Start 2P", monospace',  
          color: "\#5c9650",  
          lineHeight: "1",  
          fontSize: "20px",  
          fontWeight: "700"  
        }}\>  
            16BitFit  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>;  
};  
