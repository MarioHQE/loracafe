#!/bin/bash

# Script de prueba para el sistema JWT de Lora Cafe
# Asegúrate de que la aplicación esté corriendo en localhost:8090

BASE_URL="http://localhost:8090"
echo "🧪 Probando sistema de autenticación JWT - Lora Cafe"
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para hacer requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "$headers" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "$headers")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "Status: $http_code"
    echo "Response: $body"
    echo "---"
}

echo -e "${YELLOW}1. Probando registro de usuario...${NC}"
make_request "POST" "/api/auth/register" '{
    "nombre": "Test",
    "apellido": "Usuario",
    "email": "test@example.com",
    "password": "password123",
    "telefono": "123456789",
    "direccion": "Calle Test 123"
}'

echo -e "${YELLOW}2. Probando login...${NC}"
make_request "POST" "/api/auth/login" '{
    "email": "test@example.com",
    "password": "password123"
}'

# Extraer token de la respuesta (asumiendo que está en formato JSON)
echo -e "${YELLOW}3. Extrayendo token JWT...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "password": "password123"
    }')

# Extraer token usando jq si está disponible, o con grep/sed
if command -v jq &> /dev/null; then
    JWT_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token')
else
    JWT_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -n "$JWT_TOKEN" ] && [ "$JWT_TOKEN" != "null" ]; then
    echo -e "${GREEN}Token extraído exitosamente${NC}"
    echo "Token: ${JWT_TOKEN:0:50}..."
    
    echo -e "${YELLOW}4. Probando acceso a ruta protegida...${NC}"
    make_request "GET" "/api/protected/profile" "" "Authorization: Bearer $JWT_TOKEN"
    
    echo -e "${YELLOW}5. Probando acceso a ruta de usuario...${NC}"
    make_request "GET" "/api/protected/user" "" "Authorization: Bearer $JWT_TOKEN"
    
    echo -e "${YELLOW}6. Probando validación de token...${NC}"
    make_request "GET" "/api/auth/validate" "" "Authorization: Bearer $JWT_TOKEN"
    
else
    echo -e "${RED}Error: No se pudo extraer el token JWT${NC}"
    echo "Respuesta completa: $TOKEN_RESPONSE"
fi

echo -e "${YELLOW}7. Probando acceso sin token (debería fallar)...${NC}"
make_request "GET" "/api/protected/profile" ""

echo -e "${GREEN}✅ Pruebas completadas${NC}"
echo "Revisa los resultados arriba para verificar que todo funciona correctamente." 