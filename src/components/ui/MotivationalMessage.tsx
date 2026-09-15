import { motion } from 'framer-motion';

interface MotivationalMessageProps {
  percentage: number;
  delay?: number;
}

export default function MotivationalMessage({ percentage, delay = 0 }: MotivationalMessageProps) {
  const getMessage = () => {
    if (percentage === 100) {
      return {
        emoji: '🏆',
        title: 'Perfect Score!',
        message: 'Outstanding! You\'ve mastered this topic completely.',
        color: 'from-amber-50 to-yellow-50 border-amber-200',
        textColor: 'text-amber-900',
      };
    }
    if (percentage >= 90) {
      return {
        emoji: '🌟',
        title: 'Excellent Work!',
        message: 'You\'ve demonstrated exceptional understanding. Keep up the great work!',
        color: 'from-emerald-50 to-green-50 border-emerald-200',
        textColor: 'text-emerald-900',
      };
    }
    if (percentage >= 80) {
      return {
        emoji: '👏',
        title: 'Great Job!',
        message: 'You have a strong grasp of the material. Just a bit more practice to perfect it!',
        color: 'from-blue-50 to-cyan-50 border-blue-200',
        textColor: 'text-blue-900',
      };
    }
    if (percentage >= 70) {
      return {
        emoji: '💪',
        title: 'Good Effort!',
        message: 'You\'re on the right track. Review the questions you missed to improve further.',
        color: 'from-indigo-50 to-purple-50 border-indigo-200',
        textColor: 'text-indigo-900',
      };
    }
    if (percentage >= 60) {
      return {
        emoji: '📚',
        title: 'Keep Learning!',
        message: 'You\'re making progress. Focus on the areas where you struggled and try again.',
        color: 'from-orange-50 to-amber-50 border-orange-200',
        textColor: 'text-orange-900',
      };
    }
    if (percentage >= 50) {
      return {
        emoji: '🎯',
        title: 'Room to Grow',
        message: 'Don\'t give up! Review the material and take the test again to improve your score.',
        color: 'from-rose-50 to-pink-50 border-rose-200',
        textColor: 'text-rose-900',
      };
    }
    return {
      emoji: '💡',
      title: 'Time to Study',
      message: 'Every expert was once a beginner. Review the material carefully and try again.',
      color: 'from-stone-50 to-gray-50 border-stone-200',
      textColor: 'text-stone-900',
    };
  };

  const { emoji, title, message, color, textColor } = getMessage();

  return (
    <motion.div
      className={`p-6 rounded-2xl border-2 bg-gradient-to-br ${color}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center">
        <motion.div
          className="text-5xl mb-3"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.2, type: 'spring', stiffness: 200 }}
        >
          {emoji}
        </motion.div>
        <motion.h3
          className={`text-xl font-bold mb-2 ${textColor}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className={`text-sm ${textColor} opacity-90`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.5 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}
