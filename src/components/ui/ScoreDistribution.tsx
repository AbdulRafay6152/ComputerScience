import { motion } from 'framer-motion';

interface ScoreDistributionProps {
  scores: number[];
  title?: string;
}

export default function ScoreDistribution({ scores, title = 'Score Distribution' }: ScoreDistributionProps) {
  if (scores.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-stone-500 text-sm">No score data available</p>
        </div>
      </div>
    );
  }

  // Create distribution buckets
  const buckets = [
    { range: '0-20%', min: 0, max: 20, count: 0, color: 'bg-red-500' },
    { range: '21-40%', min: 21, max: 40, count: 0, color: 'bg-orange-500' },
    { range: '41-60%', min: 41, max: 60, count: 0, color: 'bg-amber-500' },
    { range: '61-80%', min: 61, max: 80, count: 0, color: 'bg-emerald-500' },
    { range: '81-100%', min: 81, max: 100, count: 0, color: 'bg-green-500' },
  ];

  scores.forEach(score => {
    const bucket = buckets.find(b => score >= b.min && score <= b.max);
    if (bucket) bucket.count++;
  });

  const maxCount = Math.max(...buckets.map(b => b.count), 1);
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        <div className="text-sm">
          <span className="text-stone-500">Average: </span>
          <span className="font-semibold text-stone-900">{avgScore}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {buckets.map((bucket, index) => {
          const percentage = (bucket.count / scores.length) * 100;
          const barWidth = (bucket.count / maxCount) * 100;

          return (
            <motion.div
              key={bucket.range}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-700">{bucket.range}</span>
                <span className="text-sm text-stone-500">
                  {bucket.count} ({percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-8 bg-stone-100 rounded-lg overflow-hidden">
                <motion.div
                  className={`h-full ${bucket.color} rounded-lg flex items-center justify-end pr-2`}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {bucket.count > 0 && (
                    <span className="text-xs font-medium text-white">{bucket.count}</span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-stone-900">{scores.length}</p>
            <p className="text-xs text-stone-500">Total Tests</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-stone-900">{Math.max(...scores)}%</p>
            <p className="text-xs text-stone-500">Highest</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-stone-900">{Math.min(...scores)}%</p>
            <p className="text-xs text-stone-500">Lowest</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
