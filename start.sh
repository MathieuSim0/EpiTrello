#!/bin/bash

echo "🚀 Démarrage de EpiTrello..."
echo ""

# Vérifier si les node_modules existent
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🔧 Démarrage du backend sur http://localhost:3001"
cd backend && npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

echo "🎨 Démarrage du frontend sur http://localhost:5173"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ EpiTrello est démarré !"
echo "📊 Backend: http://localhost:3001/api"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter..."

# Fonction pour arrêter les processus
cleanup() {
    echo ""
    echo "🛑 Arrêt de EpiTrello..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT

# Attendre indéfiniment
wait
