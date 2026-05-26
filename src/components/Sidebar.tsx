import { useEffect, useState } from 'react'
import type { Subject, Chapter } from '../types'
import { v4 as uuid } from 'uuid'

interface Props {
  currentPage: 'upload' | 'review'
  onPageChange: (page: 'upload' | 'review') => void
  selectedSubjectId: string | null
  selectedChapterId: string | null
  onSelectSubject: (id: string | null) => void
  onSelectChapter: (id: string | null) => void
}

export default function Sidebar({
  currentPage,
  onPageChange,
  selectedSubjectId,
  selectedChapterId,
  onSelectSubject,
  onSelectChapter
}: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newChapterName, setNewChapterName] = useState('')
  const [editingSubject, setEditingSubject] = useState<string | null>(null)
  const [editingChapter, setEditingChapter] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    loadSubjects()
  }, [])

  useEffect(() => {
    if (selectedSubjectId) {
      loadChapters(selectedSubjectId)
    } else {
      setChapters([])
    }
  }, [selectedSubjectId])

  async function loadSubjects() {
    const data = await window.api.getSubjects()
    setSubjects(data)
  }

  async function loadChapters(subjectId: string) {
    const data = await window.api.getChapters(subjectId)
    setChapters(data)
  }

  async function addSubject() {
    const name = newSubjectName.trim()
    if (!name) return
    const subject: Subject = { id: uuid(), name }
    await window.api.saveSubject(subject)
    setNewSubjectName('')
    await loadSubjects()
    onSelectSubject(subject.id)
  }

  async function addChapter() {
    const name = newChapterName.trim()
    if (!name || !selectedSubjectId) return
    const chapter: Chapter = { id: uuid(), name, subjectId: selectedSubjectId }
    await window.api.saveChapter(chapter)
    setNewChapterName('')
    await loadChapters(selectedSubjectId)
    onSelectChapter(chapter.id)
  }

  async function handleDeleteSubject(id: string) {
    await window.api.deleteSubject(id)
    if (selectedSubjectId === id) {
      onSelectSubject(null)
      onSelectChapter(null)
    }
    await loadSubjects()
  }

  async function handleDeleteChapter(id: string) {
    await window.api.deleteChapter(id)
    if (selectedChapterId === id) {
      onSelectChapter(null)
    }
    if (selectedSubjectId) {
      await loadChapters(selectedSubjectId)
    }
  }

  async function handleRenameSubject(id: string) {
    const name = editName.trim()
    if (!name) return
    await window.api.saveSubject({ id, name })
    setEditingSubject(null)
    setEditName('')
    await loadSubjects()
  }

  async function handleRenameChapter(id: string) {
    const name = editName.trim()
    if (!name || !selectedSubjectId) return
    await window.api.saveChapter({ id, name, subjectId: selectedSubjectId })
    setEditingChapter(null)
    setEditName('')
    await loadChapters(selectedSubjectId)
  }

  const tabClass = (active: boolean) =>
    `flex-1 py-2 text-center text-sm font-medium rounded-lg transition-colors ${
      active
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Mode tabs */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button className={tabClass(currentPage === 'upload')} onClick={() => onPageChange('upload')}>
            上传管理
          </button>
          <button className={tabClass(currentPage === 'review')} onClick={() => onPageChange('review')}>
            复习模式
          </button>
        </div>
      </div>

      {/* Subject list */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          科目
        </h3>
        <div className="space-y-1">
          {subjects.map((s) => (
            <div
              key={s.id}
              className={`group flex items-center rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                selectedSubjectId === s.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => onSelectSubject(s.id)}
            >
              {editingSubject === s.id ? (
                <input
                  className="flex-1 text-sm bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubject(s.id)
                    if (e.key === 'Escape') setEditingSubject(null)
                  }}
                  onBlur={() => handleRenameSubject(s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="flex-1 text-sm truncate">{s.name}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      className="text-gray-400 hover:text-indigo-600 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingSubject(s.id)
                        setEditName(s.name)
                      }}
                      title="重命名"
                    >
                      ✎
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSubject(s.id)
                      }}
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add subject */}
        <div className="mt-2 flex gap-1">
          <input
            className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            placeholder="新建科目..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
          />
          <button
            className="px-2 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={addSubject}
          >
            +
          </button>
        </div>

        {/* Chapter list */}
        {selectedSubjectId && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              章节
            </h3>
            <div className="space-y-1">
              {chapters.map((c) => (
                <div
                  key={c.id}
                  className={`group flex items-center rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    selectedChapterId === c.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => onSelectChapter(c.id)}
                >
                  {editingChapter === c.id ? (
                    <input
                      className="flex-1 text-sm bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameChapter(c.id)
                        if (e.key === 'Escape') setEditingChapter(null)
                      }}
                      onBlur={() => handleRenameChapter(c.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span className="flex-1 text-sm truncate">{c.name}</span>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          className="text-gray-400 hover:text-indigo-600 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingChapter(c.id)
                            setEditName(c.name)
                          }}
                          title="重命名"
                        >
                          ✎
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-500 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChapter(c.id)
                          }}
                          title="删除"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-1">
              <input
                className="flex-1 text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                placeholder="新建章节..."
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addChapter()}
              />
              <button
                className="px-2 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={addChapter}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
