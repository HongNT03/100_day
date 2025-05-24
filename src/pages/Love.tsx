import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, Gift } from "lucide-react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  emoji: string;
}

const Love: React.FC = () => {
  const [showSurprise, setShowSurprise] = useState<boolean>(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(0);

  // Initialize confetti and floating hearts
  useEffect(() => {
    const generateConfetti = (): ConfettiPiece[] => {
      const pieces: ConfettiPiece[] = [];
      const colors = [
        "#ff6b9d",
        "#c44569",
        "#f8b500",
        "#ff9ff3",
        "#54a0ff",
        "#ff6b6b",
      ];

      for (let i = 0; i < 100; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: Math.random() * 3 + 2,
          },
        });
      }
      return pieces;
    };

    const generateFloatingHearts = (): FloatingHeart[] => {
      const hearts: FloatingHeart[] = [];
      const heartEmojis = ["💖", "💕", "💗", "💝", "❤️", "🌹", "💐", "✨"];

      for (let i = 0; i < 20; i++) {
        hearts.push({
          id: i,
          x: Math.random() * window.innerWidth,
          delay: Math.random() * 10,
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        });
      }
      return hearts;
    };

    setConfettiPieces(generateConfetti());
    setFloatingHearts(generateFloatingHearts());

    // Animate day counter
    const dayInterval = setInterval(() => {
      setCurrentDay((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);

    return () => clearInterval(dayInterval);
  }, []);

  const handleSurpriseClick = (): void => {
    setShowSurprise(!showSurprise);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const heartVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Poppins:wght@300;400;500;600&display=swap');
        
        .dancing-script {
          font-family: 'Dancing Script', cursive;
        }
        
        .great-vibes {
          font-family: 'Great Vibes', cursive;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }
        
        .confetti-piece {
          position: absolute;
          animation: confetti-fall 3s linear infinite;
        }
        
        .floating-heart {
          position: absolute;
          animation: float-up 6s ease-in-out infinite;
          font-size: 2rem;
        }
      `}</style>

      {/* Confetti Animation */}
      {confettiPieces.slice(0, 50).map((piece, index) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: piece.x,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: piece.x + piece.velocity.x * 50,
            rotate: piece.rotation,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating Hearts */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-4xl pointer-events-none"
          style={{ left: heart.x }}
          initial={{ y: window.innerHeight + 50, opacity: 0 }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            x: [0, 30, -30, 0],
          }}
          transition={{
            duration: 8,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <motion.div
          className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-6 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </motion.div>

            <h1 className="great-vibes text-6xl md:text-8xl text-pink-600 mb-4">
              Happy 100 Days
            </h1>

            <motion.div
              className="text-8xl mb-4"
              variants={heartVariants}
              animate="animate"
            >
              💖
            </motion.div>

            <h2 className="dancing-script text-4xl md:text-5xl text-purple-700 font-semibold">
              My Love
            </h2>
          </motion.div>

          {/* Day Counter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white bg-opacity-40 rounded-2xl p-6 inline-block">
              <div className="flex items-center gap-2 text-pink-600 mb-2">
                <Calendar className="w-6 h-6" />
                <span className="text-lg font-semibold">Days Together</span>
              </div>
              <div className="text-6xl font-bold text-pink-600 dancing-script">
                {currentDay}
              </div>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-light">
              "Every day with you has been a blessing. <br />
              Here's to many more beautiful moments together."
            </p>

            {/* Animated Emojis */}
            <div className="flex justify-center items-center gap-6 text-4xl mb-8">
              {["💕", "🌹", "💗", "✨", "💝"].map((emoji, index) => (
                <motion.span
                  key={index}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            {/* Love Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="bg-white bg-opacity-40 rounded-2xl p-6"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl font-bold text-pink-600 dancing-script mb-2">
                  100
                </div>
                <div className="text-gray-600 font-medium">Days of Love</div>
              </motion.div>

              <motion.div
                className="bg-white bg-opacity-40 rounded-2xl p-6"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl font-bold text-purple-600 dancing-script mb-2">
                  ∞
                </div>
                <div className="text-gray-600 font-medium">
                  Precious Memories
                </div>
              </motion.div>

              <motion.div
                className="bg-white bg-opacity-40 rounded-2xl p-6"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl font-bold text-pink-600 dancing-script mb-2">
                  1
                </div>
                <div className="text-gray-600 font-medium">Forever Love</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Surprise Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.button
              onClick={handleSurpriseClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg dancing-script flex items-center gap-2 mx-auto"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#ec4899",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Click for a Surprise
              <Gift className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Surprise Content */}
          <AnimatePresence>
            {showSurprise && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="mt-8"
              >
                <div className="bg-white bg-opacity-50 rounded-3xl p-8 backdrop-blur-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="mb-6"
                  >
                    <img
                      src="/api/placeholder/300/300"
                      alt="Our beautiful memory together"
                      className="w-full max-w-xs h-80 object-cover rounded-2xl shadow-2xl mx-auto"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="dancing-script text-3xl md:text-4xl text-pink-600 mb-4 font-semibold">
                      My Heart Belongs to You 💝
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      "In your eyes, I found my home. In your heart, I found my
                      love. In your soul, I found my mate. These 100 days are
                      just the beginning of our forever story. I love you more
                      than words can express."
                    </p>

                    <div className="flex justify-center gap-2 text-3xl">
                      {["💖", "🌹", "💕", "✨", "💗", "🎀"].map(
                        (emoji, index) => (
                          <motion.span
                            key={index}
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                          >
                            {emoji}
                          </motion.span>
                        )
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Love;
