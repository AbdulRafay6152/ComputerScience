import { motion } from 'framer-motion';

interface AnalyticsChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  type?: 'bar' | 'line';
  height?: number;
}

export default function AnalyticsChart({ data, title, type = 'bar', height = 200 }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-stone-900 mb-4">{title}</h3>
      
      <div className="relative" style={{ height }}>
        {type === 'bar' && (
          <div className="flex items-end justify-between gap-2 h-full">
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full bg-stone-700 rounded-t-lg relative group cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ minHeight: item.value > 0 ? '4px' : '0' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value}
                    </div>
                  </motion.div>
                  <span className="text-xs text-stone-500 text-center truncate w-full">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
