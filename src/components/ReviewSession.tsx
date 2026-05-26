import { useState, useEffect, useCallback } from 'react'
import type { Question, ReviewProgress } from '../types'
import ReviewCard from './ReviewCard'

interface Props {
  subjectId: string
  chapterId: string
  mode: 'sequential' | 'random'
  onExit: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ReviewSession({ subjectId, chapterId, mode, onExit }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [order, setOrder] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    init()
  }, [chapterId, mode])

  async function init() {
    setLoading(true)
    const qs = await window.api.getQuestions(chapterId)
    setQuestions(qs)

    const progress = await window.api.getProgress(chapterId, mode)

    if (progress && progress.questionOrder.length === qs.length) {
      const orderStillValid = progress.questionOrder.every((id) =>
        qs.some((q) => q.id === id)
      )
      if (orderStillValid) {
        setOrder(progress.questionOrder)
        setCurrentIndex(progress.currentIndex)
        setLoading(false)
        return
      }
    }

    const ids = qs.map((q) => q.id)
    const newOrder = mode === 'random' ? shuffle(ids) : ids
    setOrder(newOrder)
    setCurrentIndex(0)
    setLoading(false)
  }

  const persistProgress = useCallback(
    async (idx: number) => {
      const progress: ReviewProgress = {
        subjectId,
        chapterId,
        mode,
        currentIndex: idx,
        questionOrder: order
      }
      await window.api.saveProgress(progress)
    },
    [subjectId, chapterId, mode, order]
  )

  function handleNext() {
    if (currentIndex < order.length - 1) {
      const next = currentIndex + 1
      setCurrentIndex(next)
      persistProgress(next)
    } else {
      setFinished(true)
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      const prev = currentIndex - 1
      setCurrentIndex(prev)
      persistProgress(prev)
    }
  }

  async function handleRestart() {
    await window.api.deleteProgress(chapterId, mode)
    const ids = questions.map((q) => q.id)
    const newOrder = mode === 'random' ? shuffle(ids) : ids
    setOrder(newOrder)
    setCurrentIndex(0)
    setFinished(false)
    const progress: ReviewProgress = {
      subjectId,
      chapterId,
      mode,
      currentIndex: 0,
      questionOrder: newOrder
    }
    await window.api.saveProgress(progress)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 mb-4">该章节暂无题目</p>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          onClick={onExit}
        >
          返回
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">复习完成！</h2>
        <p className="text-gray-500 mb-6">
          你已完成本章节全部 {questions.length} 道题目
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            onClick={handleRestart}
          >
            重新开始
          </button>
          <button
            className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            onClick={onExit}
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  const currentQuestionId = order[currentIndex]
  const currentQuestion = questions.find((q) => q.id === currentQuestionId)

  if (!currentQuestion) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">题目数据异常</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          onClick={handleRestart}
        >
          重新开始
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          onClick={onExit}
        >
          ← 退出复习
        </button>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {mode === 'sequential' ? '顺序模式' : '乱序模式'}
        </span>
      </div>
      <ReviewCard
        key={currentQuestionId}
        question={currentQuestion}
        index={currentIndex}
        total={order.length}
        onNext={handleNext}
        onPrev={handlePrev}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < order.length - 1}
      />
    </div>
  )
}
