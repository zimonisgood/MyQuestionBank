import { useState, useEffect } from 'react'
import type { Question } from '../types'
import QuestionForm from '../components/QuestionForm'
import QuestionList from '../components/QuestionList'

interface Props {
  subjectId: string | null
  chapterId: string | null
}

export default function UploadPage({ subjectId, chapterId }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  useEffect(() => {
    if (chapterId) {
      loadQuestions()
    } else {
      setQuestions([])
    }
    setEditingQuestion(null)
  }, [chapterId])

  async function loadQuestions() {
    if (!chapterId) return
    const data = await window.api.getQuestions(chapterId)
    setQuestions(data)
  }

  async function handleDelete(id: string) {
    await window.api.deleteQuestion(id)
    await loadQuestions()
  }

  if (!subjectId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-5xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">题库助手</h2>
          <p className="text-gray-400">请在左侧创建或选择一个科目开始</p>
        </div>
      </div>
    )
  }

  if (!chapterId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-4xl mb-3">📖</p>
          <p className="text-gray-400">请在左侧选择或创建一个章节</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <QuestionForm
        subjectId={subjectId}
        chapterId={chapterId}
        editingQuestion={editingQuestion}
        onSaved={() => {
          setEditingQuestion(null)
          loadQuestions()
        }}
        onCancel={() => setEditingQuestion(null)}
      />

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          已有题目（{questions.length}）
        </h3>
        <QuestionList
          questions={questions}
          onEdit={setEditingQuestion}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
