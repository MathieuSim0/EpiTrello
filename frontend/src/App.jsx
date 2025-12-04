import { useState } from 'react'
import HomePage from './components/HomePage'
import Board from './components/Board'
import BoardList from './components/BoardList'
import LanguageSelector from './components/LanguageSelector'
import { useLanguage } from './i18n/LanguageContext'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'boards', 'board'
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const { t } = useLanguage()

  const handleGetStarted = () => {
    setCurrentView('boards')
  }

  const handleSelectBoard = (boardId) => {
    setSelectedBoardId(boardId)
    setCurrentView('board')
  }

  const handleBackToBoards = () => {
    setSelectedBoardId(null)
    setCurrentView('boards')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setSelectedBoardId(null)
  }

  return (
    <>
      {/* Sélecteur de langue global */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {currentView === 'home' && (
        <HomePage onGetStarted={handleGetStarted} />
      )}

      {currentView === 'boards' && (
        <>
          <button
            onClick={handleBackToHome}
            className="fixed top-4 left-4 z-10 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-semibold transition-all border border-gray-200"
          >
            <span>←</span> {t('home')}
          </button>
          <BoardList onSelectBoard={handleSelectBoard} />
        </>
      )}

      {currentView === 'board' && (
        <div>
          <button
            onClick={handleBackToBoards}
            className="fixed top-4 left-4 z-10 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-semibold transition-all border border-gray-200"
          >
            <span>←</span> {t('backToBoards')}
          </button>
          <Board boardId={selectedBoardId} onBoardDeleted={handleBackToBoards} />
        </div>
      )}
    </>
  )
}

export default App
