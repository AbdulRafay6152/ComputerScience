import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Test, Question } from '../../types';
import { generateId } from '../../lib/auth';
import * as store from '../../lib/store';

interface PDFImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

export default function PDFImport({ isOpen, onClose, onImport }: PDFImportProps) {
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [testCategory, setTestCategory] = useState('Computer Science');
  const [testDifficulty, setTestDifficulty] = useState('Beginner');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [error, setError] = useState('');
  const [inputText, setInputText] = useState('');

  const parseQuestions = (text: string): Question[] => {
    const parsedQuestions: Question[] = [];
    
    // Split by question numbers
    const lines = text.split('\n');
    let currentQuestion = '';
    let currentOptions: string[] = [];
    let currentAnswer = 0;
    let questionNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a new question (starts with number followed by . or ))
      const questionMatch = line.match(/^(\d+)[\.\)]\s*(.+)/);
      
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuestion && currentOptions.length >= 2) {
          parsedQuestions.push({
            id: generateId(),
            testId: '',
            text: currentQuestion,
            options: currentOptions.slice(0, 4),
            correctAnswer: currentAnswer,
          });
        }
        
        // Start new question
        questionNumber++;
        currentQuestion = questionMatch[2].trim();
        currentOptions = [];
        currentAnswer = 0;
      } 
      // Check if this is an option (starts with A), B), etc.)
      else if (line.match(/^[A-Da-d][\.\)]/)) {
        const optionMatch = line.match(/^[A-Da-d][\.\)]\s*(.+)/);
        if (optionMatch) {
          currentOptions.push(optionMatch[1].trim());
        }
      }
      // Check if this is an answer
      else if (line.match(/^(answer|correct|ans|key)[:\s]/i)) {
        const answerMatch = line.match(/^(?:answer|correct|ans|key)[:\s]*([A-Da-d])/i);
        if (answerMatch) {
          const answerLetter = answerMatch[1].toUpperCase();
          currentAnswer = answerLetter.charCodeAt(0) - 65;
        }
      }
    }
    
    // Don't forget the last question
    if (currentQuestion && currentOptions.length >= 2) {
      parsedQuestions.push({
        id: generateId(),
        testId: '',
        text: currentQuestion,
        options: currentOptions.slice(0, 4),
        correctAnswer: currentAnswer,
      });
    }
    
    return parsedQuestions;
  };

  const handleParse = () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }
    
    const parsed = parseQuestions(inputText);
    
    if (parsed.length === 0) {
      setError('No questions could be extracted. Please check the format.');
      return;
    }
    
    setQuestions(parsed);
    setStep('review');
  };

  const handleImport = () => {
    if (!testTitle.trim()) {
      setError('Please provide a test title');
      return;
    }
    
    if (questions.length === 0) {
      setError('No questions to import');
      return;
    }

    const slug = testTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const testId = generateId();

    const questionsWithTestId = questions.map(q => ({
      ...q,
      testId: testId,
    }));

    const newTest: Test = {
      id: testId,
      title: testTitle.trim(),
      slug: slug,
      description: testDescription.trim() || `Test with ${questions.length} questions`,
      category: testCategory.trim(),
      difficulty: testDifficulty,
      questions: questionsWithTestId,
    };

    store.createTest(newTest);
    onImport();
    handleClose();
  };

  const handleClose = () => {
    setTestTitle('');
    setTestDescription('');
    setTestCategory('Computer Science');
    setTestDifficulty('Beginner');
    setQuestions([]);
    setStep('input');
    setError('');
    setInputText('');
    onClose();
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        testId: '',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === 'options') {
      updated[index] = { ...updated[index], options: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-4 sm:my-8 max-h-[95vh] flex flex-col"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-stone-900">Create Test</h3>
                <p className="text-sm text-stone-500 mt-1">
                  {step === 'input' ? 'Enter questions manually or paste from PDF' : 'Review and configure test'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 'input' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 How to Add Questions</h4>
                  <p className="text-xs text-blue-800 mb-2">
                    <strong>Option 1:</strong> Copy text from your PDF and paste it below
                  </p>
                  <p className="text-xs text-blue-800 mb-2">
                    <strong>Option 2:</strong> Click "Add Question Manually" to create questions one by one
                  </p>
                  <div className="mt-3 p-2 bg-white/50 rounded text-xs text-blue-700">
                    <strong>Format example:</strong><br />
                    1. What is 2+2?<br />
                    A) 3<br />
                    B) 4<br />
                    C) 5<br />
                    Answer: B
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Paste Questions (or type manually)
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 font-mono text-sm"
                    placeholder="1. What is the capital of France?&#10;A) London&#10;B) Paris&#10;C) Berlin&#10;Answer: B&#10;&#10;2. What is 2+2?&#10;A) 3&#10;B) 4&#10;C) 5&#10;Answer: B"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleParse}
                    className="flex-1 px-4 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors"
                  >
                    Parse Questions
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
                  >
                    Add Question Manually
                  </button>
                </div>

                {questions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-stone-900 mb-3">
                      Questions ({questions.length})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {questions.map((q, index) => (
                        <div key={q.id} className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => handleUpdateQuestion(index, 'text', e.target.value)}
                              className="flex-1 px-2 py-1 border border-stone-300 rounded text-sm"
                              placeholder="Question text"
                            />
                            <button
                              onClick={() => handleRemoveQuestion(index)}
                              className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-1">
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...q.options];
                                    newOptions[optIndex] = e.target.value;
                                    handleUpdateQuestion(index, 'options', newOptions);
                                  }}
                                  className="flex-1 px-2 py-1 border border-stone-300 rounded text-xs"
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                />
                                <input
                                  type="radio"
                                  name={`correct-${index}`}
                                  checked={q.correctAnswer === optIndex}
                                  onChange={() => handleUpdateQuestion(index, 'correctAnswer', optIndex)}
                                  className="w-4 h-4"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep('review')}
                      className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Continue to Test Setup →
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Test Title *
                    </label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                      placeholder="e.g., Computer Science - Chapter 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={testCategory}
                      onChange={(e) => setTestCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={testDescription}
                      onChange={(e) => setTestDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                      placeholder="Brief description of the test"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={testDifficulty}
                      onChange={(e) => setTestDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-stone-900 mb-2">
                    Questions ({questions.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={q.id} className="bg-white border border-stone-200 rounded p-2 text-sm">
                        <p className="font-medium text-stone-900">Q{index + 1}: {q.text}</p>
                        <div className="mt-1 space-y-0.5">
                          {q.options.map((opt, optIndex) => (
                            <p
                              key={optIndex}
                              className={`text-xs ${
                                optIndex === q.correctAnswer
                                  ? 'text-emerald-700 font-medium'
                                  : 'text-stone-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}) {opt}
                              {optIndex === q.correctAnswer && ' ✓'}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!testTitle || questions.length === 0}
                    className="flex-1 px-4 py-2 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
