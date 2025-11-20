import { useState } from 'react';

const HomePage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">EpiTrello</h1>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <button
                onClick={onGetStarted}
                className="btn-primary"
              >
                Commencer →
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Gérez vos projets avec simplicité
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              EpiTrello est un outil de gestion de projet basé sur la méthode Kanban.
              Organisez vos tâches, suivez leur progression et collaborez efficacement.
            </p>
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              Accéder à mes tableaux →
            </button>
          </div>

          {/* Preview Image/Mockup */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-2 bg-gray-200 rounded mb-3 w-24"></div>
                    <div className="space-y-2">
                      <div className="h-16 bg-blue-100 rounded"></div>
                      <div className="h-16 bg-blue-100 rounded"></div>
                      <div className="h-16 bg-blue-100 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-2 bg-gray-200 rounded mb-3 w-24"></div>
                    <div className="space-y-2">
                      <div className="h-16 bg-yellow-100 rounded"></div>
                      <div className="h-16 bg-yellow-100 rounded"></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-2 bg-gray-200 rounded mb-3 w-24"></div>
                    <div className="space-y-2">
                      <div className="h-16 bg-green-100 rounded"></div>
                      <div className="h-16 bg-green-100 rounded"></div>
                      <div className="h-16 bg-green-100 rounded"></div>
                      <div className="h-16 bg-green-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg text-gray-600">
              Tout ce dont vous avez besoin pour gérer vos projets efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tableaux Kanban
              </h3>
              <p className="text-gray-600">
                Créez des tableaux pour chaque projet et organisez vos tâches en colonnes
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drag & Drop
              </h3>
              <p className="text-gray-600">
                Déplacez vos cartes facilement par glisser-déposer pour suivre leur progression
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Temps réel
              </h3>
              <p className="text-gray-600">
                Synchronisation instantanée de vos modifications entre le frontend et le backend
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✏️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Édition facile
              </h3>
              <p className="text-gray-600">
                Modifiez vos cartes et listes directement en cliquant dessus
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interface moderne
              </h3>
              <p className="text-gray-600">
                Design épuré et professionnel pour une meilleure expérience utilisateur
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sauvegarde auto
              </h3>
              <p className="text-gray-600">
                Vos données sont automatiquement sauvegardées dans la base de données
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Accédez à vos tableaux et commencez à organiser vos projets dès maintenant
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
          >
            Accéder à l'application →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong className="text-gray-900">EpiTrello</strong> - Gestion de projet simplifiée
            </p>
            <p className="text-sm">
              Développé avec React, Node.js, Express et SQLite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;