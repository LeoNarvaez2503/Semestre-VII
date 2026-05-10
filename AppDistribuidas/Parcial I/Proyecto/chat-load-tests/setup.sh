#!/bin/bash

# Chat Seguro Load Tests - Setup Script
# This script automates the creation of a test room and prepares the environment

set -e

echo "=========================================="
echo "Chat Seguro - Load Test Setup"
echo "=========================================="
echo ""

# Configuration
BASE_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
ROOM_NAME="LoadTest-Room"
ROOM_PIN="1234"
ROOM_TYPE="TEXT"
MAX_USERS="100"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if backend is running
echo -e "${YELLOW}Step 1: Checking if backend is running...${NC}"
if curl -s -m 5 "$BASE_URL/api/rooms/info" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running at $BASE_URL${NC}"
else
    echo -e "${RED}✗ Backend is NOT running at $BASE_URL${NC}"
    echo "Start it with: cd ChatSeguroSpring && docker-compose up -d && mvn spring-boot:run"
    exit 1
fi

echo ""

# Step 2: Login and get admin token
echo -e "${YELLOW}Step 2: Authenticating admin user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASS\"}")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}✗ Login failed. Response: $LOGIN_RESPONSE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Admin authenticated${NC}"
echo "  Token: ${ADMIN_TOKEN:0:20}..."

echo ""

# Step 3: Create test room
echo -e "${YELLOW}Step 3: Creating test room...${NC}"

ROOM_RESPONSE=$(curl -s -X POST "$BASE_URL/api/rooms/create" \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=$ADMIN_TOKEN" \
  -d "{
    \"roomName\":\"$ROOM_NAME\",
    \"roomType\":\"$ROOM_TYPE\",
    \"pin\":\"$ROOM_PIN\",
    \"maxUsers\":$MAX_USERS
  }")

ROOM_ID=$(echo $ROOM_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$ROOM_ID" ]; then
    echo -e "${RED}✗ Room creation failed. Response: $ROOM_RESPONSE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Test room created${NC}"
echo "  Room Name: $ROOM_NAME"
echo "  Room ID: $ROOM_ID"
echo "  PIN: $ROOM_PIN"

echo ""

# Step 4: Display instructions
echo -e "${YELLOW}Step 4: Next steps...${NC}"
echo ""
echo "1. Update ChatLoadSimulation.scala with the Room ID:"
echo ""
echo -e "   ${GREEN}val TEST_ROOM_ID = \"$ROOM_ID\"${NC}"
echo ""
echo "2. Run load tests:"
echo ""
echo "   cd chat-load-tests"
echo "   mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation"
echo ""
echo "3. Open the generated report (after test completes):"
echo ""
echo "   target/gatling/chat-load-test-results-*/index.html"
echo ""

echo -e "${GREEN}Setup completed successfully!${NC}"
