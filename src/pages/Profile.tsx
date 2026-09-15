import { useAuth } from '../context/AuthContext';
import * as store from '../lib/store';
import { Link } from 'react-router-dom';
import { Card, Button, EmptyState } from '../components/ui';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const results = store.getResultsByUserId(user.id);
  const tests = store.getTests();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Info */}
      <Card className="p-6 sm:p-8 mb-8 scale-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-stone-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-900">{user.name}</h1>
            <p className="text-sm text-stone-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div>
            <p className="text-xs text-stone-400">Account Type</p>
            <p className="text-sm font-medium text-stone-700 capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Member Since</p>
            <p className="text-sm font-medium text-stone-700">
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </Card>

      {/* Test History */}
      <div>
        <h2 className="text-lg font-medium text-stone-800 mb-4 slide-up" style={{ animationDelay: '0.2s' }}>
          Test History
        </h2>
        
        {results.length === 0 ? (
          <EmptyState
            title="No tests completed yet"
            description="Start taking tests to see your history here."
            action={
              <Link to="/tests">
                <Button>Browse Tests</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => {
              const test = tests.find(t => t.id === result.testId);
              return (
                <Link
                  key={result.id}
                  to={`/results/${result.id}`}
                  className="block stagger-item"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <Card hoverable className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-stone-900">{test?.title || 'Unknown Test'}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {new Date(result.submittedAt).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-stone-900">
                          {result.score}/{result.total}
                        </p>
                        <p className="text-xs text-stone-500">{result.percentage}%</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
