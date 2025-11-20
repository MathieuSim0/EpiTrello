#!/bin/bash

echo "🧪 Test de l'API EpiTrello"
echo "=========================="
echo ""

API_URL="http://localhost:3001/api"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test de santé
echo "1️⃣  Test de santé de l'API..."
response=$(curl -s ${API_URL}/health)
if [[ $response == *"OK"* ]]; then
    echo -e "${GREEN}✅ API est en ligne${NC}"
else
    echo -e "${RED}❌ API ne répond pas${NC}"
    exit 1
fi
echo ""

# Test de création de board
echo "2️⃣  Test de création d'un tableau..."
board_response=$(curl -s -X POST ${API_URL}/boards \
    -H 'Content-Type: application/json' \
    -d '{"title":"Test Board","description":"Créé par le script de test"}')
board_id=$(echo $board_response | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
if [ ! -z "$board_id" ]; then
    echo -e "${GREEN}✅ Tableau créé (ID: $board_id)${NC}"
else
    echo -e "${RED}❌ Échec de création du tableau${NC}"
    exit 1
fi
echo ""

# Test de récupération des boards
echo "3️⃣  Test de récupération des tableaux..."
boards=$(curl -s ${API_URL}/boards)
if [[ $boards == *"$board_id"* ]]; then
    echo -e "${GREEN}✅ Tableaux récupérés${NC}"
else
    echo -e "${RED}❌ Échec de récupération${NC}"
    exit 1
fi
echo ""

# Test de création de liste
echo "4️⃣  Test de création d'une liste..."
list_response=$(curl -s -X POST ${API_URL}/lists \
    -H 'Content-Type: application/json' \
    -d "{\"title\":\"Test List\",\"board_id\":$board_id}")
list_id=$(echo $list_response | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
if [ ! -z "$list_id" ]; then
    echo -e "${GREEN}✅ Liste créée (ID: $list_id)${NC}"
else
    echo -e "${RED}❌ Échec de création de la liste${NC}"
    exit 1
fi
echo ""

# Test de création de carte
echo "5️⃣  Test de création d'une carte..."
card_response=$(curl -s -X POST ${API_URL}/cards \
    -H 'Content-Type: application/json' \
    -d "{\"title\":\"Test Card\",\"description\":\"Description de test\",\"list_id\":$list_id}")
card_id=$(echo $card_response | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
if [ ! -z "$card_id" ]; then
    echo -e "${GREEN}✅ Carte créée (ID: $card_id)${NC}"
else
    echo -e "${RED}❌ Échec de création de la carte${NC}"
    exit 1
fi
echo ""

# Test de récupération du board complet
echo "6️⃣  Test de récupération du tableau complet..."
board_detail=$(curl -s ${API_URL}/boards/$board_id)
if [[ $board_detail == *"$list_id"* ]] && [[ $board_detail == *"$card_id"* ]]; then
    echo -e "${GREEN}✅ Tableau complet récupéré avec listes et cartes${NC}"
else
    echo -e "${RED}❌ Échec de récupération complète${NC}"
    exit 1
fi
echo ""

# Test de déplacement de carte
echo "7️⃣  Test de déplacement d'une carte..."
# Créer une deuxième liste
list2_response=$(curl -s -X POST ${API_URL}/lists \
    -H 'Content-Type: application/json' \
    -d "{\"title\":\"Test List 2\",\"board_id\":$board_id}")
list2_id=$(echo $list2_response | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

move_response=$(curl -s -X PATCH ${API_URL}/cards/$card_id/move \
    -H 'Content-Type: application/json' \
    -d "{\"list_id\":$list2_id,\"position\":0}")
if [[ $move_response == *"$list2_id"* ]]; then
    echo -e "${GREEN}✅ Carte déplacée avec succès${NC}"
else
    echo -e "${RED}❌ Échec du déplacement${NC}"
    exit 1
fi
echo ""

# Test de suppression
echo "8️⃣  Test de suppression..."
delete_response=$(curl -s -X DELETE ${API_URL}/boards/$board_id -w "%{http_code}")
if [[ $delete_response == *"204"* ]]; then
    echo -e "${GREEN}✅ Tableau supprimé${NC}"
else
    echo -e "${RED}❌ Échec de suppression${NC}"
    exit 1
fi
echo ""

echo "================================"
echo -e "${GREEN}🎉 Tous les tests sont passés !${NC}"
echo "================================"
