import { useState } from 'react'
import HomePage from './components/HomePage'
import Board from './components/Board'
import BoardList from './components/BoardList'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'boards', 'board'
  const [selectedBoardId, setSelectedBoardId] = useState(null)

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
      {currentView === 'home' && (
        <HomePage onGetStarted={handleGetStarted} />
      )}

      {currentView === 'boards' && (
        <>
          <button
            onClick={handleBackToHome}
            className="fixed top-4 left-4 z-10 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 font-semibold transition-all border border-gray-200"
          >
            <span>←</span> Accueil
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
            <span>←</span> Retour aux tableaux
          </button>
          <Board boardId={selectedBoardId} />
        </div>
      )}
    </>
  )
}

export default App
