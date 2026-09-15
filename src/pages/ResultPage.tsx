import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as store from '../lib/store';
import { 
  ScoreRing, 
  PerformanceBreakdown, 
  QuestionReview, 
  ShareButton, 
  MotivationalMessage,
  Button 
} from '../components/ui';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const result = id ? store.getResultById(id) : undefined;
  const test = result ? store.getTestById(result.testId) : undefined;

  if (!result || !test || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Result Not Found</h2>
          <p className="text-stone-600 mb-6">The result you're looking for doesn't exist.</p>
          <Link to="/tests">
            <Button>Back to Tests</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Verify ownership
  if (result.userId !== user.id && user.role !== 'admin') {
    navigate('/tests');
    return null;
  }

  // Time tracking can be added in future enhancement
  const timeTaken = undefined;

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            Test Complete!
          </h1>
          <p className="text-stone-600">{test.title}</p>
        </motion.div>

        {/* Score Ring */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ScoreRing
            percentage={result.percentage}
            score={result.score}
            total={result.total}
            size="lg"
          />
        </motion.div>

        {/* Motivational Message */}
        <div className="mb-8">
          <MotivationalMessage percentage={result.percentage} delay={0.4} />
        </div>

        {/* Performance Breakdown */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Performance Breakdown</h2>
          <PerformanceBreakdown
            score={result.score}
            total={result.total}
            percentage={result.percentage}
            timeTaken={timeTaken}
          />
        </div>

        {/* Share Button */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ShareButton
            testName={test.title}
            score={result.score}
            total={result.total}
            percentage={result.percentage}
          />
        </motion.div>

        {/* Detailed Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-xl font-bold text-stone-900 mb-4">Question Review</h2>
          <div className="space-y-3">
            {test.questions.map((question, index) => (
              <QuestionReview
                key={question.id}
                questions={test.questions}
                answers={result.answers}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link to="/tests" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Tests
            </Button>
          </Link>
          <Link to={`/tests/${test.slug}`} className="flex-1">
            <Button className="w-full">
              Retake Test
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
