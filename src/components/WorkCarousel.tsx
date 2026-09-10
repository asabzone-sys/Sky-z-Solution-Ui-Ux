import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, PlayCircle, Eye, Layers, Database, Compass, BarChart3, Radio, ExternalLink } from 'lucide-react';
import { PORTFOLIO_CARDS } from '../data/content';
import { useNavigation } from '../context/NavigationContext';

export const WorkCarousel: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeIndex, setActiveIndex] = useState(2); // Center default: Knowledge Base
  const [touchStartX, setTouchStartX] = useState(0);

  const totalCards = PORTFOLIO_CARDS.length;

  const orbitNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const orbitPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      orbitNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [orbitNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') orbitPrev();
      if (e.key === 'ArrowRight') orbitNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orbitPrev, orbitNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) orbitPrev();
      else orbitNext();
    }
  };

  // Helper to compute 3D arc styling for each card
  const getCardStyle = (index: number) => {
    let offset = index - activeIndex;
    if (offset > 2) offset -= 5;
    if (offset < -2) offset += 5;

    let x = 0;
    let y = 0;
    let rotate = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;
    const pointerEvents: 'auto' | 'none' = 'auto';

    if (offset === 0) {
      x = 0;
      y = -12;
      rotate = 0;
      scale = 1.05;
      opacity = 1;
      zIndex = 40;
    } else if (offset === -1) {
      x = -280;
      y = 36;
      rotate = -7;
      scale = 0.92;
      opacity = 0.9;
      zIndex = 30;
    } else if (offset === 1) {
      x = 280;
      y = 36;
      rotate = 7;
      scale = 0.92;
      opacity = 0.9;
      zIndex = 30;
    } else if (offset === -2) {
      x = -490;
      y = 85;
      rotate = -14;
      scale = 0.82;
      opacity = 0.6;
      zIndex = 20;
    } else if (offset === 2) {
      x = 490;
      y = 85;
      rotate = 14;
      scale = 0.82;
      opacity = 0.6;
      zIndex = 20;
    }

    return {
      transform: `translate3d(${x}px, ${y}px, 0px) rotate(${rotate}deg) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents,
      transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease, box-shadow 0.55s ease',
    };
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative select-none bg-skyz-bg border-y border-skyz-border transition-colors duration-200" id="work">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skyz-surface mb-2 border border-skyz-border shadow-sm">
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                01 // Systems Showcase
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-skyz-text tracking-tight font-bold">
              Interface Explorations
            </h2>
          </div>
          <p className="text-sm sm:text-base text-skyz-text-muted max-w-md">
            Interactive system prototypes illustrating spatial composition, dynamic content orchestration, and responsive state flows.
          </p>
        </div>

        {/* Carousel Curved Arc Stage */}
        <div
          className="w-full relative py-6 sm:py-12 min-h-[500px] sm:min-h-[560px] flex items-center justify-center overflow-hidden sm:overflow-visible skyz-arc-track"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle Arc Guide Line */}
          <svg className="absolute inset-x-0 bottom-12 w-full h-[320px] pointer-events-none text-skyz-accent/20 opacity-60 hidden sm:block" fill="none" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <path d="M 0 350 C 350 80, 850 80, 1200 350" stroke="currentColor" strokeWidth="2" strokeDasharray="8 10" />
          </svg>

          {/* Cards Deck */}
          <div className="relative w-full max-w-5xl flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
            {/* CARD 0: Media Pipeline */}
            <div
              className="absolute cursor-pointer"
              style={getCardStyle(0)}
              onClick={() => setActiveIndex(0)}
            >
              <div className="w-[260px] sm:w-[310px] h-[430px] sm:h-[480px] rounded-[2rem] bg-[#EFF6FF] dark:bg-[#0E1726] p-4 sm:p-5 flex flex-col justify-between border border-[#BFDBFE] dark:border-[#1E293B] card-shadow-flank hover:scale-[1.02] transition-all">
                <div className="w-full h-[270px] sm:h-[300px] rounded-[1.5rem] bg-[#0c121d] relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#050b14] via-[#0e1e38] to-[#142d54]" />
                  <div className="relative w-36 h-52 sm:w-40 sm:h-56 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#60A5FA] to-[#1E3A8A] p-[2px] shadow-[0_10px_30px_rgba(56,189,248,0.25)] transform -rotate-6">
                    <div className="w-full h-full rounded-[14px] bg-[#090d16] flex flex-col justify-between p-3 overflow-hidden relative">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400/20 via-blue-500/20 to-transparent blur-md" />
                      <div className="flex items-center justify-between relative z-10">
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                        <span className="text-[9px] font-mono text-[#38BDF8] font-semibold">STREAM FEED</span>
                      </div>
                      <div className="relative z-10 space-y-1.5 my-auto">
                        <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
                        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500 to-slate-400" />
                        <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-sky-300 to-blue-600" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-white/80 relative z-10 font-mono">
                        <span>PIPELINE ACTIVE</span>
                        <PlayCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E3A8A] dark:text-[#93C5FD] tracking-tight">Media Pipeline</h3>
                  <p className="text-xs text-[#3B82F6] dark:text-[#60A5FA] mt-0.5">Asset streaming & encoding system</p>
                </div>
              </div>
            </div>

            {/* CARD 1: Editorial Engine */}
            <div
              className="absolute cursor-pointer"
              style={getCardStyle(1)}
              onClick={() => setActiveIndex(1)}
            >
              <div className="w-[260px] sm:w-[310px] h-[430px] sm:h-[480px] rounded-[2rem] bg-[#F0FDF4] dark:bg-[#0B1A12] p-4 sm:p-5 flex flex-col justify-between border border-[#BBF7D0] dark:border-[#143823] card-shadow-flank hover:scale-[1.02] transition-all">
                <div className="w-full h-[270px] sm:h-[300px] rounded-[1.5rem] bg-[#142618] relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1b3421] to-[#0f1f14]" />
                  <div className="relative w-44 sm:w-48 bg-[#0b140d] rounded-xl p-1.5 shadow-2xl border border-white/15 z-10">
                    <div className="w-full h-24 sm:h-28 rounded-lg bg-[#E2F0D9] p-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-[#A8C992] pb-1">
                        <span className="text-[10px] font-bold text-[#2D401E] uppercase tracking-wider">Content Engine</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      </div>
                      <div className="space-y-1 my-1">
                        <div className="h-1.5 w-16 bg-[#4A6B2C] rounded-full" />
                        <div className="h-1 w-full bg-[#8FB673] rounded-full" />
                        <div className="h-1 w-5/6 bg-[#8FB673] rounded-full" />
                        <div className="h-1 w-2/3 bg-[#8FB673] rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-[#4A6B2C] font-mono">
                        <span>INDEXED SCHEMA</span>
                        <span className="font-bold">LIVE STATUS</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-4 bg-[#142416] rounded-b-sm z-10" />
                  <div className="w-16 h-1 bg-[#0b140d] rounded-full shadow-sm z-10" />
                </div>
                <div className="text-center py-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#14532D] dark:text-[#86EFAC] tracking-tight">Editorial Engine</h3>
                  <p className="text-xs text-[#16A34A] dark:text-[#4ADE80] mt-0.5">Structured layout & publishing architecture</p>
                </div>
              </div>
            </div>

            {/* CARD 2: Knowledge Base (Active Default) */}
            <div
              className="absolute cursor-pointer"
              style={getCardStyle(2)}
              onClick={() => setActiveIndex(2)}
            >
              <div className="w-[280px] sm:w-[340px] h-[450px] sm:h-[500px] rounded-[2.25rem] bg-skyz-surface p-4 sm:p-5 flex flex-col justify-between border-2 border-skyz-accent card-shadow-active relative">
                <div className="absolute -inset-3 rounded-[2.75rem] bg-gradient-to-tr from-skyz-accent/20 via-skyz-accent-secondary/20 to-transparent blur-2xl -z-10 pointer-events-none" />
                <div className="w-full h-[270px] sm:h-[300px] rounded-[1.75rem] bg-[#0B0F14] relative overflow-hidden flex items-end justify-center px-4 pb-3 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#151B24] via-[#0F131A] to-[#080B10]" />
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />
                  
                  {/* Visual Structure */}
                  <div className="relative z-10 flex items-end justify-center gap-2 w-full max-w-[240px]">
                    <div className="w-7 h-36 rounded-t-md bg-[#1E293B] border-t border-l border-white/20 shadow-lg flex flex-col justify-between p-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span className="text-[8px] font-mono text-white/50 transform -rotate-90 uppercase tracking-widest">LAYER 01</span>
                    </div>
                    <div className="w-7 h-44 rounded-t-md bg-[#0284C7] border-t border-l border-white/25 shadow-xl flex flex-col justify-between p-1.5 items-center">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/40 mt-2 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                      </div>
                      <span className="text-[8px] font-mono text-white/80 transform -rotate-90 uppercase tracking-widest">VECTORS</span>
                    </div>
                    <div className="w-8 h-48 rounded-t-md bg-[#38BDF8] border-t border-l border-white/30 shadow-2xl flex flex-col justify-between p-1.5 items-center">
                      <span className="w-2 h-1 bg-white/80 rounded-full mt-2" />
                      <span className="text-[9px] font-mono text-[#080B10] font-bold transform -rotate-90 tracking-wider">INDEX</span>
                    </div>
                    <div className="w-8 h-56 rounded-t-md bg-[#0F766E] border-t border-l border-white/20 shadow-2xl flex flex-col justify-between p-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-teal-200/40 mt-3" />
                      <span className="text-[9px] font-mono text-teal-100/70 transform -rotate-90 tracking-widest uppercase">CACHE</span>
                    </div>
                    <div className="w-8 h-60 rounded-t-md bg-[#1E293B] border-t border-l border-white/20 shadow-2xl flex flex-col justify-between p-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8] mt-4" />
                      <span className="text-[9px] font-mono text-[#38BDF8] transform -rotate-90 tracking-widest uppercase">SKYZ</span>
                    </div>
                  </div>
                </div>
                <div className="text-center py-2.5 px-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-skyz-text tracking-tight">Knowledge Base</h3>
                  <p className="text-xs sm:text-[13px] text-skyz-text-muted mt-1 font-medium leading-tight">
                    Vector-indexed search & reference catalog interface
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: Market Intelligence */}
            <div
              className="absolute cursor-pointer"
              style={getCardStyle(3)}
              onClick={() => setActiveIndex(3)}
            >
              <div className="w-[260px] sm:w-[310px] h-[430px] sm:h-[480px] rounded-[2rem] bg-[#FEF2F2] dark:bg-[#1C0F11] p-4 sm:p-5 flex flex-col justify-between border border-[#FECACA] dark:border-[#38161A] card-shadow-flank hover:scale-[1.02] transition-all">
                <div className="w-full h-[270px] sm:h-[300px] rounded-[1.5rem] bg-[#291215] relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#38161a] to-[#1a0a0c]" />
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                      <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-t-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border-2 border-red-300 shadow-lg flex flex-col items-center justify-between p-1">
                        <div className="w-4 h-6 border border-red-400 rounded-full mt-2 opacity-80 animate-pulse" />
                        <div className="w-8 h-2 bg-red-600 rounded-b-sm" />
                      </div>
                      <div className="absolute -top-1 w-6 h-6 rounded-full bg-white dark:bg-[#291215] shadow-md flex items-center justify-center text-[9px] text-red-600 font-bold border border-red-300">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute -bottom-1 w-6 h-6 rounded-full bg-red-400/20 border border-red-300/40" />
                      <div className="absolute -left-2 top-8 w-5 h-5 rounded-full bg-red-400/20 border border-red-300/40" />
                      <div className="absolute -right-2 top-8 w-5 h-5 rounded-full bg-red-400/20 border border-red-300/40" />
                    </div>
                  </div>
                </div>
                <div className="text-center py-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#7F1D1D] dark:text-[#FCA5A5] tracking-tight">Market Intelligence</h3>
                  <p className="text-xs text-[#DC2626] dark:text-[#F87171] mt-0.5">Telemetry & data aggregation framework</p>
                </div>
              </div>
            </div>

            {/* CARD 4: Spatial Topology */}
            <div
              className="absolute cursor-pointer"
              style={getCardStyle(4)}
              onClick={() => setActiveIndex(4)}
            >
              <div className="w-[260px] sm:w-[310px] h-[430px] sm:h-[480px] rounded-[2rem] bg-[#FFFBEB] dark:bg-[#1A1508] p-4 sm:p-5 flex flex-col justify-between border border-[#FDE68A] dark:border-[#3D3012] card-shadow-flank hover:scale-[1.02] transition-all">
                <div className="w-full h-[270px] sm:h-[300px] rounded-[1.5rem] bg-[#241E10] relative overflow-hidden flex flex-col items-center justify-end p-3 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2e2615] via-[#211a0c] to-[#120f06]" />
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="flex items-end justify-center gap-1.5 mb-2">
                      <div className="w-3 h-14 bg-[#B45309] rounded-t-sm shadow-md border-t border-white/20" />
                      <div className="w-4 h-22 bg-[#D97706] rounded-t-sm shadow-lg border-t border-white/30" />
                      <div className="w-5 h-32 bg-[#F59E0B] rounded-t-sm shadow-xl border-t border-white/40 flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-white/60" />
                      </div>
                      <div className="w-4 h-26 bg-[#D97706] rounded-t-sm shadow-lg border-t border-white/30" />
                      <div className="w-3 h-16 bg-[#B45309] rounded-t-sm shadow-md border-t border-white/20" />
                    </div>
                    <div className="w-40 sm:w-44 h-9 rounded-full border border-amber-300/40 bg-[#1C1509] shadow-xl flex items-center justify-center transform -rotate-4">
                      <div className="w-36 h-6 rounded-full border border-dashed border-amber-400/40 flex items-center justify-between px-3 text-[8px] text-amber-200/90 font-mono">
                        <span>CLUSTER 04</span>
                        <span>TOPOLOGY</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center py-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#78350F] dark:text-[#FCD34D] tracking-tight">Spatial Topology</h3>
                  <p className="text-xs text-[#D97706] dark:text-[#FBBF24] mt-0.5">Hierarchical systems & topology interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex flex-col items-center gap-3 mt-4 sm:mt-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous portfolio card"
              onClick={orbitPrev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-skyz-surface shadow-sm hover:shadow-md border border-skyz-border flex items-center justify-center text-skyz-text hover:text-skyz-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Indicator Bullets */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-skyz-surface/90 shadow-sm border border-skyz-border backdrop-blur-md">
              {PORTFOLIO_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  aria-label={`Go to slide ${card.index + 1}`}
                  onClick={() => setActiveIndex(card.index)}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                    card.index === activeIndex
                       ? 'w-7 bg-skyz-text dark:bg-skyz-accent'
                       : 'w-2.5 bg-skyz-border hover:bg-skyz-accent/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next portfolio card"
              onClick={orbitNext}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-skyz-surface shadow-sm hover:shadow-md border border-skyz-border flex items-center justify-center text-skyz-text hover:text-skyz-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-skyz-text-muted flex items-center gap-1.5 text-center px-4">
            <Eye className="w-4 h-4 text-skyz-accent" />
            Navigate with controls, swipe gesture, or arrow keys.
          </p>

          <button
            type="button"
            id="view-all-projects-btn"
            onClick={() => navigate('work')}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text font-medium text-xs sm:text-sm border border-skyz-border hover:border-skyz-accent/40 shadow-sm transition-all cursor-pointer"
          >
            <span>View Architecture Showcase</span>
            <ExternalLink className="w-3.5 h-3.5 text-skyz-accent" />
          </button>
        </div>
      </div>
    </section>
  );
};
