import Store from 'electron-store'

interface StoreSchema {
  subjects: Array<{ id: string; name: string }>
  chapters: Array<{ id: string; name: string; subjectId: string }>
  questions: Array<{
    id: string
    subjectId: string
    chapterId: string
    type: 'text' | 'choice'
    content: string
    answer: string
    options?: string[]
    correctIndex?: number
    createdAt: number
  }>
  progress: Array<{
    subjectId: string
    chapterId: string
    mode: 'sequential' | 'random'
    currentIndex: number
    questionOrder: string[]
  }>
}

const store = new Store<StoreSchema>({
  defaults: {
    subjects: [],
    chapters: [],
    questions: [],
    progress: []
  }
})

export function getSubjects() {
  return store.get('subjects')
}

export function saveSubject(subject: StoreSchema['subjects'][0]) {
  const subjects = store.get('subjects')
  const idx = subjects.findIndex((s) => s.id === subject.id)
  if (idx >= 0) {
    subjects[idx] = subject
  } else {
    subjects.push(subject)
  }
  store.set('subjects', subjects)
}

export function deleteSubject(id: string) {
  store.set(
    'subjects',
    store.get('subjects').filter((s) => s.id !== id)
  )
  store.set(
    'chapters',
    store.get('chapters').filter((c) => c.subjectId !== id)
  )
  store.set(
    'questions',
    store.get('questions').filter((q) => q.subjectId !== id)
  )
  store.set(
    'progress',
    store.get('progress').filter((p) => p.subjectId !== id)
  )
}

export function getChapters(subjectId: string) {
  return store.get('chapters').filter((c) => c.subjectId === subjectId)
}

export function saveChapter(chapter: StoreSchema['chapters'][0]) {
  const chapters = store.get('chapters')
  const idx = chapters.findIndex((c) => c.id === chapter.id)
  if (idx >= 0) {
    chapters[idx] = chapter
  } else {
    chapters.push(chapter)
  }
  store.set('chapters', chapters)
}

export function deleteChapter(id: string) {
  store.set(
    'chapters',
    store.get('chapters').filter((c) => c.id !== id)
  )
  store.set(
    'questions',
    store.get('questions').filter((q) => q.chapterId !== id)
  )
  store.set(
    'progress',
    store.get('progress').filter((p) => p.chapterId !== id)
  )
}

export function getQuestions(chapterId: string) {
  return store.get('questions').filter((q) => q.chapterId === chapterId)
}

export function saveQuestion(question: StoreSchema['questions'][0]) {
  const questions = store.get('questions')
  questions.push(question)
  store.set('questions', questions)
}

export function updateQuestion(question: StoreSchema['questions'][0]) {
  const questions = store.get('questions')
  const idx = questions.findIndex((q) => q.id === question.id)
  if (idx >= 0) {
    questions[idx] = question
    store.set('questions', questions)
  }
}

export function deleteQuestion(id: string) {
  store.set(
    'questions',
    store.get('questions').filter((q) => q.id !== id)
  )
}

export function getProgress(chapterId: string, mode: string) {
  return (
    store.get('progress').find((p) => p.chapterId === chapterId && p.mode === mode) || null
  )
}

export function saveProgress(progress: StoreSchema['progress'][0]) {
  const all = store.get('progress')
  const idx = all.findIndex(
    (p) => p.chapterId === progress.chapterId && p.mode === progress.mode
  )
  if (idx >= 0) {
    all[idx] = progress
  } else {
    all.push(progress)
  }
  store.set('progress', all)
}

export function deleteProgress(chapterId: string, mode: string) {
  store.set(
    'progress',
    store.get('progress').filter((p) => !(p.chapterId === chapterId && p.mode === mode))
  )
}
