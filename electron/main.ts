import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import * as store from './store'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: '题库助手',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('get-subjects', () => store.getSubjects())
  ipcMain.handle('save-subject', (_, subject) => store.saveSubject(subject))
  ipcMain.handle('delete-subject', (_, id) => store.deleteSubject(id))
  ipcMain.handle('get-chapters', (_, subjectId) => store.getChapters(subjectId))
  ipcMain.handle('save-chapter', (_, chapter) => store.saveChapter(chapter))
  ipcMain.handle('delete-chapter', (_, id) => store.deleteChapter(id))
  ipcMain.handle('get-questions', (_, chapterId) => store.getQuestions(chapterId))
  ipcMain.handle('save-question', (_, question) => store.saveQuestion(question))
  ipcMain.handle('update-question', (_, question) => store.updateQuestion(question))
  ipcMain.handle('delete-question', (_, id) => store.deleteQuestion(id))
  ipcMain.handle('get-progress', (_, chapterId, mode) => store.getProgress(chapterId, mode))
  ipcMain.handle('save-progress', (_, progress) => store.saveProgress(progress))
  ipcMain.handle('delete-progress', (_, chapterId, mode) =>
    store.deleteProgress(chapterId, mode)
  )

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
