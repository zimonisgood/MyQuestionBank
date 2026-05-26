import { useState, useEffect } from 'react'
import type { Question } from '../types'
import { v4 as uuid } from 'uuid'

interface Props {
  subjectId: string
  chapterId: string
  editingQuestion?: Question | null
  onSaved: () => void
  onCancel?: () => void
}

export default function QuestionForm({
  subjectId,
  chapterId,
  editingQuestion,
  onSaved,
  onCancel
}: Props) {
  const [type, setType] = useState<'text' | 'choice'>('text')
  const [content, setContent] = useState('')
  const [answer, setAnswer] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)

  useEffect(() => {
    if (editingQuestion) {
      setType(editingQuestion.type)
      setContent(editingQuestion.content)
      setAnswer(editingQuestion.answer)
      if (editingQuestion.type === 'choice') {
        setOptions(editingQuestion.options || ['', '', '', ''])
        setCorrectIndex(editingQuestion.correctIndex ?? 0)
      }
    } else {
      resetForm()
    }
  }, [editingQuestion])

  function resetForm() {
    setType('text')
    setContent('')
    setAnswer('')
    setOptions(['', '', '', ''])
    setCorrectIndex(0)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    if (type === 'text' && !answer.trim()) return
    if (type === 'choice' && options.some((o) => !o.trim())) return

    const question: Question = {
      id: editingQuestion?.id || uuid(),
      subjectId,
      chapterId,
      type,
      content: content.trim(),
      answer: type === 'text' ? answer.trim() : options[correctIndex],
      options: type === 'choice' ? options.map((o) => o.trim()) : undefined,
      correctIndex: type === 'choice' ? correctIndex : undefined,
      createdAt: editingQuestion?.createdAt || Date.now()
    }

    if (editingQuestion) {
      await window.api.updateQuestion(question)
    } else {
      await window.api.saveQuestion(question)
    }

    resetForm()
    onSaved()
  }

  function updateOption(index: number, value: string) {
    const next = [...options]
    next[index] = value
    setOptions(next)
  }

  function addOption() {
    setOptions([...options, ''])
  }

  function removeOption(index: number) {
    if (options.length <= 2) return
    const next = options.filter((_, i) => i !== index)
    setOptions(next)
    if (correctIndex >= next.length) {
      setCorrectIndex(next.length - 1)
    }
  }

  const isEditing = !!editingQuestion

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? '编辑题目' : '添加题目'}
      </h3>

      {/* Type selector */}
      {!isEditing && (
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'text'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setType('text')}
          >
            纯文本题
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === 'choice'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setType('choice')}
          >
            选择题
          </button>
        </div>
      )}

      {/* Question content */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">题干</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y min-h-[80px]"
          rows={3}
          placeholder="请输入题目内容..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {type === 'text' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">答案</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y min-h-[60px]"
            rows={2}
            placeholder="请输入答案..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">选项</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
                    correctIndex === i
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  onClick={() => setCorrectIndex(i)}
                  title={correctIndex === i ? '正确答案' : '设为正确答案'}
                >
                  {String.fromCharCode(65 + i)}
                </button>
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder={`选项 ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 text-sm"
                    onClick={() => removeOption(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            onClick={addOption}
          >
            + 添加选项
          </button>
          <p className="mt-1 text-xs text-gray-400">点击字母按钮设置正确答案</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? '保存修改' : '添加题目'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            className="px-5 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            onClick={onCancel}
          >
            取消
          </button>
        )}
      </div>
    </form>
  )
}
