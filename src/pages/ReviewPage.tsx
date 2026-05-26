import { useState } from 'react'
import ReviewSession from '../components/ReviewSession'

interface Props {
  subjectId: string | null
  chapterId: string | null
}

export default function ReviewPage({ subjectId, chapterId }: Props) {
  const [mode, setMode] = useState<'sequential' | 'random' | null>(null)

  if (!subjectId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-5xl mb-4">🧠</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">复习模式</h2>
          <p className="text-gray-400">请在左侧选择一个科目和章节开始复习</p>
        </div>
      </div>
    )
  }

  if (!chapterId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-4xl mb-3">📖</p>
          <p className="text-gray-400">请在左侧选择一个章节</p>
        </div>
      </div>
    )
  }

  if (!mode) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">选择复习模式</h2>
          <div className="flex gap-4">
            <button
              className="w-48 p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              onClick={() => setMode('sequential')}
            >
              <p className="text-3xl mb-3">📋</p>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600">
                顺序做题
              </p>
              <p className="text-xs text-gray-400 mt-1">按添加顺序逐题练习</p>
            </button>
            <button
              className="w-48 p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              onClick={() => setMode('random')}
            >
              <p className="text-3xl mb-3">🔀</p>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600">
                乱序做题
              </p>
              <p className="text-xs text-gray-400 mt-1">随机打乱题目顺序</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ReviewSession
        key={`${chapterId}-${mode}`}
        subjectId={subjectId}
        chapterId={chapterId}
        mode={mode}
        onExit={() => setMode(null)}
      />
    </div>
  )
}
