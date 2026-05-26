import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getSubjects: () => ipcRenderer.invoke('get-subjects'),
  saveSubject: (subject) => ipcRenderer.invoke('save-subject', subject),
  deleteSubject: (id) => ipcRenderer.invoke('delete-subject', id),
  getChapters: (subjectId) => ipcRenderer.invoke('get-chapters', subjectId),
  saveChapter: (chapter) => ipcRenderer.invoke('save-chapter', chapter),
  deleteChapter: (id) => ipcRenderer.invoke('delete-chapter', id),
  getQuestions: (chapterId) => ipcRenderer.invoke('get-questions', chapterId),
  saveQuestion: (question) => ipcRenderer.invoke('save-question', question),
  updateQuestion: (question) => ipcRenderer.invoke('update-question', question),
  deleteQuestion: (id) => ipcRenderer.invoke('delete-question', id),
  getProgress: (chapterId, mode) => ipcRenderer.invoke('get-progress', chapterId, mode),
  saveProgress: (progress) => ipcRenderer.invoke('save-progress', progress),
  deleteProgress: (chapterId, mode) => ipcRenderer.invoke('delete-progress', chapterId, mode)
})
