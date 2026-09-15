import { motion } from 'framer-motion';

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: 'test_submitted' | 'test_created' | 'student_registered';
    title: string;
    description: string;
    timestamp: string;
    icon?: string;
  }>;
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'test_submitted':
        return '📝';
      case 'test_created':
        return '✨';
      case 'student_registered':
        return '👤';
      default:
        return '📌';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'test_submitted':
        return 'bg-blue-50 border-blue-200';
      case 'test_created':
        return 'bg-green-50 border-green-200';
      case 'student_registered':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-stone-50 border-stone-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-stone-500 text-sm">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white border border-stone-200 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className={`p-4 rounded-lg border ${getColor(activity.type)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {activity.icon || getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 text-sm">{activity.title}</p>
                <p className="text-xs text-stone-600 mt-1">{activity.description}</p>
                <p className="text-xs text-stone-400 mt-2">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
