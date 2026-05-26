import { useState } from 'react'
import Sidebar from './components/Sidebar'
import UploadPage from './pages/UploadPage'
import ReviewPage from './pages/ReviewPage'

type Page = 'upload' | 'review'

export default function App() {
  const [page, setPage] = useState<Page>('upload')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentPage={page}
        onPageChange={setPage}
        selectedSubjectId={selectedSubjectId}
        selectedChapterId={selectedChapterId}
        onSelectSubject={(id) => {
          setSelectedSubjectId(id)
          setSelectedChapterId(null)
        }}
        onSelectChapter={setSelectedChapterId}
      />
      <main className="flex-1 overflow-y-auto">
        {page === 'upload' ? (
          <UploadPage subjectId={selectedSubjectId} chapterId={selectedChapterId} />
        ) : (
          <ReviewPage subjectId={selectedSubjectId} chapterId={selectedChapterId} />
        )}
      </main>
    </div>
  )
}
