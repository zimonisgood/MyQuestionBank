import type { Question } from '../types'

interface Props {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

export default function QuestionList({ questions, onEdit, onDelete }: Props) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">📝</p>
        <p>暂无题目，请在上方添加</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-400">#{idx + 1}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    q.type === 'choice'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {q.type === 'choice' ? '选择题' : '文本题'}
                </span>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{q.content}</p>
              {q.type === 'choice' && q.options && (
                <div className="mt-2 space-y-1">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        i === q.correctIndex
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-500'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === q.correctIndex && ' ✓'}
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'text' && (
                <p className="mt-2 text-xs text-gray-500">
                  答案：{q.answer}
                </p>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                className="px-2 py-1 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                onClick={() => onEdit(q)}
              >
                编辑
              </button>
              <button
                className="px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                onClick={() => onDelete(q.id)}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
