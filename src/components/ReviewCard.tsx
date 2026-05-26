import { useState } from 'react'
import type { Question } from '../types'

interface Props {
  question: Question
  index: number
  total: number
  onNext: () => void
  onPrev: () => void
  hasPrev: boolean
  hasNext: boolean
}

export default function ReviewCard({
  question,
  index,
  total,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  function reset() {
    setShowAnswer(false)
    setSelectedOption(null)
    setConfirmed(false)
  }

  function handleNext() {
    reset()
    onNext()
  }

  function handlePrev() {
    reset()
    onPrev()
  }

  function handleConfirm() {
    if (selectedOption === null) return
    setConfirmed(true)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            第 {index + 1} / {total} 题
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              question.type === 'choice'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {question.type === 'choice' ? '选择题' : '文本题'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Question */}
        <div className="p-8">
          <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
            {question.content}
          </p>
        </div>

        {/* Choice options */}
        {question.type === 'choice' && question.options && (
          <div className="px-8 pb-4 space-y-2">
            {question.options.map((opt, i) => {
              let optionStyle = 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
              if (confirmed) {
                if (i === question.correctIndex) {
                  optionStyle = 'bg-green-50 text-green-800 border-green-300'
                } else if (i === selectedOption && i !== question.correctIndex) {
                  optionStyle = 'bg-red-50 text-red-800 border-red-300'
                } else {
                  optionStyle = 'bg-gray-50 text-gray-400 border-gray-200'
                }
              } else if (i === selectedOption) {
                optionStyle = 'bg-indigo-50 text-indigo-700 border-indigo-300'
              }

              return (
                <button
                  key={i}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${optionStyle}`}
                  onClick={() => !confirmed && setSelectedOption(i)}
                  disabled={confirmed}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {confirmed && i === question.correctIndex && (
                    <span className="float-right text-green-600 font-medium">✓ 正确</span>
                  )}
                  {confirmed && i === selectedOption && i !== question.correctIndex && (
                    <span className="float-right text-red-600 font-medium">✗ 错误</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Answer area */}
        <div className="border-t border-gray-100">
          {question.type === 'text' && (
            <div className="p-8">
              {showAnswer ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <p className="text-xs font-medium text-green-600 mb-2">答案</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{question.answer}</p>
                </div>
              ) : (
                <button
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => setShowAnswer(true)}
                >
                  显示答案
                </button>
              )}
            </div>
          )}

          {question.type === 'choice' && !confirmed && (
            <div className="p-8">
              <button
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  selectedOption !== null
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleConfirm}
                disabled={selectedOption === null}
              >
                确认答案
              </button>
            </div>
          )}

          {question.type === 'choice' && confirmed && (
            <div className="p-8">
              <div
                className={`rounded-xl p-4 text-center font-medium ${
                  selectedOption === question.correctIndex
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {selectedOption === question.correctIndex ? '回答正确！' : '回答错误'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            hasPrev
              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          onClick={handlePrev}
          disabled={!hasPrev}
        >
          ← 上一题
        </button>
        <button
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            hasNext
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleNext}
          disabled={!hasNext}
        >
          下一题 →
        </button>
      </div>
    </div>
  )
}
