"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

const SWIPE_THRESHOLD = 50;

interface Story {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  color: string;
  videos: string[];
}

interface StoryModalProps {
  isOpen: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryModal({
  isOpen,
  stories,
  initialIndex,
  onClose,
}: StoryModalProps) {
  const [storyIndex, setStoryIndex] = useState(initialIndex);
  const [clipIndex, setClipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const story = stories[storyIndex];
  const clips = story?.videos ?? [];
  const totalClips = clips.length;

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setStoryIndex(initialIndex);
      setClipIndex(0);
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialIndex]);

  // Handle video time update → drive progress bar
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  // When clip ends → go to next clip or next story
  const handleVideoEnded = useCallback(() => {
    if (clipIndex < totalClips - 1) {
      setClipIndex((i) => i + 1);
      setProgress(0);
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setClipIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [clipIndex, totalClips, storyIndex, stories.length, onClose]);

  // Auto-play video when clip/story changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen) return;

    video.load();
    video.play().catch(() => {});
  }, [storyIndex, clipIndex, isOpen]);

  // Navigate between stories
  const goNextStory = useCallback(() => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setClipIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIndex, stories.length, onClose]);

  const goPrevStory = useCallback(() => {
    if (clipIndex > 0) {
      setClipIndex((i) => i - 1);
      setProgress(0);
    } else if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setClipIndex(0);
      setProgress(0);
    }
  }, [clipIndex, storyIndex]);

  // Tap navigation (left third = prev, right third = next clip)
  const handleTapNav = useCallback(
    (zone: "left" | "right") => {
      if (zone === "right") {
        if (clipIndex < totalClips - 1) {
          setClipIndex((i) => i + 1);
          setProgress(0);
        } else {
          goNextStory();
        }
      } else {
        goPrevStory();
      }
    },
    [clipIndex, totalClips, goNextStory, goPrevStory]
  );

  // Hold to pause
  const handlePointerDown = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      setIsPaused(true);
      videoRef.current?.pause();
    }, 200);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (isPaused) {
      setIsPaused(false);
      videoRef.current?.play().catch(() => {});
    }
  }, [isPaused]);

  // Swipe gesture tracking
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      // Only horizontal swipes (ignore vertical)
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          handleTapNav("right");
        } else {
          handleTapNav("left");
        }
      }
      touchStart.current = null;
    },
    [handleTapNav]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleTapNav("right");
      if (e.key === "ArrowLeft") handleTapNav("left");
      if (e.key === " ") {
        e.preventDefault();
        if (isPaused) {
          setIsPaused(false);
          videoRef.current?.play().catch(() => {});
        } else {
          setIsPaused(true);
          videoRef.current?.pause();
        }
      }
      if (e.key === "m") setMuted((m) => !m);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleTapNav, isPaused]);

  // Lock body scroll & hide navbar
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-modal-open", "true");
      const nav = document.querySelector("nav");
      if (nav) (nav as HTMLElement).style.transform = "translateY(-100%)";
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
      const nav = document.querySelector("nav");
      if (nav) (nav as HTMLElement).style.transform = "translateY(0)";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>

          {/* Story-level arrows — DESKTOP ONLY */}
          {storyIndex > 0 && (
            <button
              onClick={goPrevStory}
              className="absolute left-8 z-50 w-10 h-10 rounded-full bg-white/10 hidden md:flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
          )}
          {storyIndex < stories.length - 1 && (
            <button
              onClick={goNextStory}
              className="absolute right-8 z-50 w-10 h-10 rounded-full bg-white/10 hidden md:flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
          )}

          {/* Story container — 9:16 vertical format */}
          <motion.div
            key={`${storyIndex}-${clipIndex}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-[85vw] max-w-[400px] rounded-2xl overflow-hidden bg-black"
            style={{ aspectRatio: "9/16" }}
          >
            {/* Progress bars — one per clip */}
            <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 px-3 pt-3">
              {clips.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-[2px] rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:
                        idx < clipIndex
                          ? "100%"
                          : idx === clipIndex
                          ? `${progress}%`
                          : "0%",
                      backgroundColor: story.color,
                      transition:
                        idx === clipIndex ? "none" : "width 0.3s ease",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story header */}
            <div className="absolute top-6 left-3 right-3 z-40 flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${story.color}, ${story.color}66)`,
                  }}
                />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    {story.title}
                  </p>
                  <p className="text-[10px] text-white/50">{story.subtitle}</p>
                </div>
              </div>

              {/* Mute toggle */}
              <button
                onClick={() => setMuted((m) => !m)}
                className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-white/60" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Video player */}
            <video
              ref={videoRef}
              src={clips[clipIndex]}
              muted={muted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Paused indicator */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-35 flex items-center justify-center bg-black/20"
                >
                  <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-white/80"
                      fill="currentColor"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click/tap zones for navigation + swipe */}
            <div
              className="absolute inset-0 z-30 flex"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="w-1/2 h-full"
                onClick={() => handleTapNav("left")}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
              <div
                className="w-1/2 h-full"
                onClick={() => handleTapNav("right")}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>
          </motion.div>

          {/* Story counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-neutral-600 uppercase tracking-[0.2em]">
            {storyIndex + 1} / {stories.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
