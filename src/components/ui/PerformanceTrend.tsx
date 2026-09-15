import { motion } from 'framer-motion';

interface PerformanceTrendProps {
  data: Array<{ date: string; score: number; testTitle: string }>;
  title?: string;
}

export default function PerformanceTrend({ data, title = 'Performance Trend' }: PerformanceTrendProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-stone-500 text-sm">No performance data available</p>
        </div>
      </div>
    );
  }

  const maxScore = 100;
  const minScore = 0;
  const range = maxScore - minScore;

  // Calculate points for SVG path
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * 100;
    const y = 100 - ((item.score - minScore) / range) * 100;
    return { x, y, ...item };
  });

  // Create SVG path
  const pathD = points.map((point, i) => {
    const cmd = i === 0 ? 'M' : 'L';
    return `${cmd} ${point.x} ${point.y}`;
  }).join(' ');

  // Create area path
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  const avgScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);
  const trend = data.length >= 2 
    ? data[data.length - 1].score - data[data.length - 2].score 
    : 0;

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-stone-500">Average:</span>
          <span className="font-semibold text-stone-900">{avgScore}%</span>
          {trend !== 0 && (
            <span className={`font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>

      <div className="relative h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e7e5e4"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area fill */}
          <motion.path
            d={areaD}
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#292524"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Data points */}
          {points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#292524"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            >
              <title>{`${point.testTitle}: ${point.score}%`}</title>
            </motion.circle>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#292524" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#292524" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {data.slice(-5).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-stone-500">
            <div className="w-2 h-2 rounded-full bg-stone-700" />
            <span>{item.testTitle.split(' ').slice(-1)[0]}: {item.score}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
