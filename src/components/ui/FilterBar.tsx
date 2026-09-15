import { motion } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  difficulties: string[];
  selectedCategory: string;
  selectedDifficulty: string;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

export default function FilterBar({
  categories,
  difficulties,
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
}: FilterBarProps) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm text-stone-500 font-medium">Category:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              selectedCategory === ''
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                selectedCategory === category
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm text-stone-500 font-medium">Difficulty:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onDifficultyChange('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
              selectedDifficulty === ''
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => onDifficultyChange(difficulty)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                selectedDifficulty === difficulty
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
