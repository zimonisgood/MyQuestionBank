export interface Subject {
  id: string
  name: string
}

export interface Chapter {
  id: string
  name: string
  subjectId: string
}

export interface Question {
  id: string
  subjectId: string
  chapterId: string
  type: 'text' | 'choice'
  content: string
  answer: string
  options?: string[]
  correctIndex?: number
  createdAt: number
}

export interface ReviewProgress {
  subjectId: string
  chapterId: string
  mode: 'sequential' | 'random'
  currentIndex: number
  questionOrder: string[]
}

export interface ElectronAPI {
  getSubjects: () => Promise<Subject[]>
  saveSubject: (subject: Subject) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  getChapters: (subjectId: string) => Promise<Chapter[]>
  saveChapter: (chapter: Chapter) => Promise<void>
  deleteChapter: (id: string) => Promise<void>
  getQuestions: (chapterId: string) => Promise<Question[]>
  saveQuestion: (question: Question) => Promise<void>
  updateQuestion: (question: Question) => Promise<void>
  deleteQuestion: (id: string) => Promise<void>
  getProgress: (chapterId: string, mode: string) => Promise<ReviewProgress | null>
  saveProgress: (progress: ReviewProgress) => Promise<void>
  deleteProgress: (chapterId: string, mode: string) => Promise<void>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
