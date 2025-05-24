import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Sparkles, Calendar, Gift, Music, Star, Flower2 } from 'lucide-react';

// Utility to generate and memoize random values for petals, stars, bokeh
function useRandomArray(length, generator) {
  return useMemo(() => Array.from({ length }).map(generator), [length]);
}

const FINAL_DAY = 100; // End day value
const START_DAY = 1;   // Start day value

const LovePage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showSurprise, setShowSurprise] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Memoized random data for all floating elements
  const petals = useRandomArray(12, () => ({
    left: Math.random() * 100,
    fontSize: 12 + Math.random() * 8,
    duration: 12 + Math.random() * 8,
    delay: Math.random() * 8
  }));

  const stars = useRandomArray(12, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    fontSize: 8 + Math.random() * 6,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2
  }));

  const bokehs = useRandomArray(10, () => {
    const colors = [
      'rgba(255, 182, 193, 0.4)',
      'rgba(221, 160, 221, 0.4)',
      'rgba(255, 218, 185, 0.4)',
      'rgba(230, 230, 250, 0.4)'
    ];
    return {
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 20 + Math.random() * 40,
      height: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 2
    };
  });

  const confetti = useRandomArray(20, () => ({
    left: Math.random() * 100,
    fontSize: 12 + Math.random() * 8,
    duration: 6 + Math.random() * 4,
    x: Math.random() * 60 - 30,
    emoji: ['💖', '💕', '🌸', '✨', '💝'][Math.floor(Math.random() * 5)]
  }));

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Music control
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Playback error:', err));
      }
    }
  };

  // --- Day number animation using framer-motion spring ---
  // Animate from 1 to 100 smoothly on mount, never update state.
  const dayValue = useMotionValue(START_DAY);
  const smoothDay = useSpring(dayValue, { duration: 6, stiffness: 50, damping: 22 });

  useEffect(() => {
    // Animate smoothly from start to end on mount
    dayValue.set(FINAL_DAY);
    // eslint-disable-next-line
  }, []);

  // Floating rose petals
  const createRosePetals = () =>
    petals.map((petal, i) => (
      <motion.div
        key={`petal-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${petal.left}%`,
          fontSize: `${petal.fontSize}px`,
          willChange: 'transform, opacity'
        }}
        initial={{ y: -50, opacity: 0, rotate: 0 }}
        animate={{
          y: window.innerHeight + 100,
          opacity: [0, 0.7, 0.5, 0],
          rotate: [0, 180, 360],
          x: [0, 30, -30, 20, -20, 0],
        }}
        transition={{
          duration: petal.duration,
          delay: petal.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🌸
      </motion.div>
    ));

  // Sparkly stars
  const createStars = () =>
    stars.map((star, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute text-yellow-200 pointer-events-none"
        style={{
          left: `${star.left}%`,
          top: `${star.top}%`,
          fontSize: `${star.fontSize}px`,
          willChange: 'transform, opacity'
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: star.duration,
          delay: star.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨
      </motion.div>
    ));

  // Dreamy bokeh particles
  const createBokehParticles = () =>
    bokehs.map((bokeh, i) => (
      <motion.div
        key={`bokeh-${i}`}
        className="absolute rounded-full opacity-30 pointer-events-none"
        style={{
          left: `${bokeh.left}%`,
          top: `${bokeh.top}%`,
          width: `${bokeh.width}px`,
          height: `${bokeh.height}px`,
          background: `radial-gradient(circle, ${bokeh.color}, transparent)`,
          willChange: 'transform, opacity'
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, -20, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: bokeh.duration,
          delay: bokeh.delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ));

  // Animated day number as a component to avoid re-rendering parent
  function AnimatedDayNumber() {
    const [display, setDisplay] = useState(START_DAY);
    useEffect(() => {
      const unsubscribe = smoothDay.on('change', v => {
        setDisplay(Math.round(v));
      });
      return unsubscribe;
    }, [smoothDay]);
    return (
      <motion.span
        style={{ display: "inline-block", minWidth: "2ch" }}
      >
        {display}
      </motion.span>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes:wght@400&family=Dancing+Script:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Dreamy Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 via-transparent to-lavender-200/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-rose-100/20 to-pink-200/20"></div>
        </div>
        {/* Audio */}
        <audio ref={audioRef} loop>
          <source src="/music/ambient-love-piano.mp3" type="audio/mpeg" />
          <source src="/music/romantic-ambient.mp3" type="audio/mpeg" />
        </audio>
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {createRosePetals()}
          {createStars()}
          {createBokehParticles()}
        </div>
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {confetti.map((c, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-400 pointer-events-none"
                style={{
                  left: `${c.left}%`,
                  top: `-20px`,
                  fontSize: `${c.fontSize}px`,
                  willChange: 'transform, opacity'
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: [0, 360],
                  opacity: [1, 0.7, 0],
                  x: [0, c.x],
                }}
                transition={{
                  duration: c.duration,
                  delay: i * 0.12,
                  ease: "easeOut"
                }}
              >
                {c.emoji}
              </motion.div>
            ))}
          </div>
        )}
        {/* Music Control Button */}
        <motion.button
          onClick={toggleMusic}
          className="fixed top-6 right-6 bg-pink-200/30 backdrop-blur-lg rounded-full p-4 text-rose-600 hover:bg-pink-200/50 transition-all shadow-lg border border-pink-200/50 z-50"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(236, 72, 153, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={isPlaying ? {
            rotate: [0, 5, -5, 0],
            boxShadow: [
              "0 0 20px rgba(236, 72, 153, 0.3)",
              "0 0 30px rgba(236, 72, 153, 0.5)",
              "0 0 20px rgba(236, 72, 153, 0.3)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
        >
          <Music className="w-6 h-6" />
        </motion.button>
        {/* Main Content */}
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 z-20">
          <div className="w-full max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center mb-16"
            >
              {/* Glowing Heart Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 relative"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(236, 72, 153, 0.4)",
                    "0 0 50px rgba(236, 72, 153, 0.6)",
                    "0 0 30px rgba(236, 72, 153, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: "radial-gradient(circle, rgba(255, 182, 193, 0.8), rgba(255, 105, 180, 0.6), rgba(221, 160, 221, 0.4))"
                }}
              >
                <Heart className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
                {/* Sparkles */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 45}deg) translateY(-60px)`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>
              {/* Magical Title */}
              <motion.h1
                className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 drop-shadow-2xl relative"
                style={{ fontFamily: "'Great Vibes', cursive" }}
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                Happy 100 Days
                {/* Glowing Effect */}
                <motion.div
                  className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold text-pink-300/20 blur-sm"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Happy 100 Days
                </motion.div>
              </motion.h1>
              {/* Floating Hearts */}
              <motion.div
                className="text-8xl md:text-9xl mb-8 relative"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                💕
                {['💖', '💗', '💝'].map((heart, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-4xl"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-80px)`,
                    }}
                    animate={{
                      rotate: [i * 120, i * 120 + 360],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 6,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                  >
                    {heart}
                  </motion.span>
                ))}
              </motion.div>
              <motion.h2
                className="text-4xl md:text-6xl text-rose-500 font-semibold drop-shadow-lg"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                My Precious Love
              </motion.h2>
            </motion.div>
            {/* Enchanted Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {[
                { label: "Days of Pure Magic", icon: Calendar, gradient: "from-pink-400 to-rose-500" },
                { number: "∞", label: "Precious Moments", icon: Star, gradient: "from-purple-400 to-pink-500" },
                { number: "1", label: "Eternal Love", icon: Heart, gradient: "from-rose-400 to-red-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-pink-200/50 shadow-xl relative overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={{ delay: 1.4 + index * 0.2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-3xl`}></div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-full mb-6 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                  <motion.div
                    className="text-5xl md:text-6xl font-bold mb-4 text-rose-600"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {stat.label === "Days of Pure Magic"
                      ? <AnimatedDayNumber />
                      : stat.number}
                  </motion.div>
                  <div className="text-rose-500 font-medium text-lg">{stat.label}</div>
                  <motion.div
                    className="absolute top-4 right-4 text-yellow-400"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
            {/* Love Letter */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1.2 }}
              className="bg-white/50 backdrop-blur-2xl rounded-3xl p-12 mb-16 border border-pink-200/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 text-pink-400">
                <Flower2 className="w-8 h-8 opacity-60" />
              </div>
              <div className="absolute top-4 right-4 text-pink-400">
                <Flower2 className="w-8 h-8 opacity-60 transform scale-x-[-1]" />
              </div>
              <div className="max-w-4xl mx-auto text-center">
                <motion.p
                  className="text-2xl md:text-3xl font-light text-rose-700 leading-relaxed mb-8"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  "In your eyes, I found my home. In your smile, I found my joy.
                  In your heart, I found my forever. Every sunrise with you feels like
                  the first day of spring, full of promise and endless beauty.
                  Here's to our love story that grows more magical with each passing day."
                </motion.p>
                <div className="flex justify-center items-center gap-6 text-4xl mb-8">
                  {['💕', '🌹', '💗', '✨', '💝', '🌸', '💖'].map((emoji, index) => (
                    <motion.span
                      key={index}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.4,
                        ease: "easeInOut"
                      }}
                      className="drop-shadow-lg"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Surprise Button and Letter */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              <motion.button
                className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 px-12 py-6 rounded-full text-2xl font-bold shadow-2xl transition-all flex items-center gap-4 mx-auto text-white border-2 border-white/30 overflow-hidden"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                whileTap={{ scale: 0.95 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)"
                }}
                onClick={() => setShowSurprise(!showSurprise)}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(236, 72, 153, 0.4)",
                    "0 0 40px rgba(236, 72, 153, 0.8)",
                    "0 0 20px rgba(236, 72, 153, 0.4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <Sparkles className="w-6 h-6 z-10" />
                💝 Open Your Heart's Gift 💝
                <Gift className="w-6 h-6 z-10" />
              </motion.button>
            </motion.div>
            <AnimatePresence>
              {showSurprise && (
                <motion.div
                  className="w-full max-w-4xl mx-auto"
                  initial={{ opacity: 0, scale: 0.8, y: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 100 }}
                  transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                >
                  <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-12 border border-pink-200/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-3xl"></div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-pink-300 text-2xl opacity-60"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${10 + Math.random() * 80}%`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 4,
                          delay: i * 0.5,
                          repeat: Infinity,
                        }}
                      >
                        🌸
                      </motion.div>
                    ))}
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 to-rose-200/50 rounded-3xl blur-xl"></div>
                        <img
                          src="/images/image.jpg"
                          alt="Our precious memory"
                          className="rounded-3xl shadow-2xl border-4 border-pink-200/50 w-full relative z-10"
                          loading="lazy"
                        />
                        <motion.div
                          className="absolute top-4 right-4 text-4xl"
                          animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          💕
                        </motion.div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center md:text-left relative"
                      >
                        <motion.h3
                          className="text-5xl md:text-6xl text-rose-600 mb-8 font-bold drop-shadow-lg"
                          style={{ fontFamily: "'Great Vibes', cursive" }}
                          animate={{
                            textShadow: [
                              "0 0 10px rgba(236, 72, 153, 0.3)",
                              "0 0 20px rgba(236, 72, 153, 0.5)",
                              "0 0 10px rgba(236, 72, 153, 0.3)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          You Are My Universe 💝
                        </motion.h3>
                        <div className="space-y-6 text-rose-700">
                          <motion.p
                            className="text-xl leading-relaxed"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            My Dearest Love,
                          </motion.p>
                          <motion.p
                            className="text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            These 100 days have been the most beautiful chapters of my life.
                            Your laughter is my favorite melody, your smile my brightest star.
                            In your arms, I've found my sanctuary, and in your love, my purpose.
                          </motion.p>
                          <motion.p
                            className="text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                          >
                            Here's to infinity more days of loving you, dreaming with you,
                            and building our fairy tale together. You are my always and forever.
                          </motion.p>
                          <motion.p
                            className="text-xl font-semibold"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                          >
                            Forever yours, 💖
                          </motion.p>
                        </div>
                        <div className="flex justify-center md:justify-start flex-wrap gap-4 text-3xl mt-8">
                          {['💖', '🌹', '💕', '✨', '💗', '🎀', '💝', '🌸', '⭐'].map((emoji, index) => (
                            <motion.span
                              key={index}
                              animate={{
                                y: [0, -15, 0],
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.3, 1]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                              className="drop-shadow-lg"
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default LovePage;