import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as store from '../../lib/store';
import { Button, Input, Card, Badge, EmptyState } from '../../components/ui';

type SortField = 'name' | 'score' | 'percentage' | 'date';
type SortDirection = 'asc' | 'desc';

export default function AdminResults() {
  const { testId } = useParams<{ testId: string }>();
  const test = testId ? store.getTestById(testId) : undefined;
  const results = testId ? store.getResultsByTestId(testId) : [];

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = results.map(r => {
      const user = store.getUserById(r.userId);
      return {
        ...r,
        studentName: user?.name || 'Unknown',
        studentEmail: user?.email || 'Unknown',
      };
    });

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.studentName.toLowerCase().includes(term) ||
        r.studentEmail.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'percentage':
          comparison = a.percentage - b.percentage;
          break;
        case 'date':
          comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [results, search, sortField, sortDirection]);

  if (!test) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <EmptyState
          title="Test not found"
          description="The test you're looking for doesn't exist."
          action={
            <Link to="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-stone-300 ml-1">↕</span>;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 slide-up">
        <Link to="/admin" className="text-sm text-stone-500 hover:text-stone-700 transition-colors duration-300 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mt-3">{test.title}</h1>
        
        {results.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span className="text-sm text-stone-600">{results.length} submission{results.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span className="text-sm text-stone-600">Avg: {Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-stone-600">Highest: {Math.max(...results.map(r => r.percentage))}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm text-stone-600">Lowest: {Math.min(...results.map(r => r.percentage))}%</span>
            </div>
          </div>
        )}
        {results.length === 0 && (
          <p className="text-stone-500 mt-1 text-sm">No submissions yet.</p>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <EmptyState
          title={results.length === 0 ? "No submissions yet" : "No results found"}
          description={results.length === 0 ? "Students haven't taken this test yet." : "Try adjusting your search."}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-stone-200 rounded-xl overflow-hidden fade-in">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th
                    className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide cursor-pointer hover:text-stone-700 transition-colors duration-300"
                    onClick={() => handleSort('name')}
                  >
                    Student <SortIcon field="name" />
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide cursor-pointer hover:text-stone-700 transition-colors duration-300"
                    onClick={() => handleSort('score')}
                  >
                    Score <SortIcon field="score" />
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide cursor-pointer hover:text-stone-700 transition-colors duration-300"
                    onClick={() => handleSort('percentage')}
                  >
                    Percentage <SortIcon field="percentage" />
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide cursor-pointer hover:text-stone-700 transition-colors duration-300"
                    onClick={() => handleSort('date')}
                  >
                    Submitted <SortIcon field="date" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((result, idx) => (
                  <tr 
                    key={result.id} 
                    className={`transition-colors duration-300 hover:bg-stone-50 ${idx < filteredAndSorted.length - 1 ? 'border-b border-stone-50' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-stone-900">{result.studentName}</p>
                      <p className="text-xs text-stone-400">{result.studentEmail}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-stone-700">
                        {result.score}/{result.total}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={
                        result.percentage >= 70 ? 'success' :
                        result.percentage >= 50 ? 'warning' : 'danger'
                      }>
                        {result.percentage}%
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-stone-500">
                        {new Date(result.submittedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredAndSorted.map((result, index) => (
              <Card key={result.id} className="p-4 stagger-item" style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{result.studentName}</p>
                    <p className="text-xs text-stone-400">{result.studentEmail}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      result.percentage >= 70 ? 'success' :
                      result.percentage >= 50 ? 'warning' : 'danger'
                    }>
                      {result.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-500">
                    Score: {result.score}/{result.total}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(result.submittedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
