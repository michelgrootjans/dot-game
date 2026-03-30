#!/bin/bash

# Tests that two players joining sequentially are assigned to different columns,
# even when the reservation window expires between the two joins.
#
# Player A joins and connects a WebSocket (claiming the slot). Player B joins
# after the reservation timeout and should be assigned the next column.
#
# CURRENTLY FAILS: Player A's slot is claimed via WebSocket, but the reservation
# expires before that happens, allowing Player B to grab the same column.
# PASSES after fix: the slot is claimed at HTTP time, so Player B is redirected.
#
# Usage: GAME_URL=http://localhost:3000/games/<game_id> ./scripts/test_join_race.sh

source "$(dirname "$0")/common.sh"

SCRIPT_DIR="$(dirname "$0")"
JOIN_URL="${GAME_URL}/join"
RESERVATION_TIMEOUT=5  # seconds, must match findFreeWork timeout in Game.js

cleanup() {
  [ -n "$WS_PID" ] && kill "$WS_PID" 2>/dev/null
  wait 2>/dev/null
}
trap cleanup EXIT

echo "Testing join race condition against: $JOIN_URL"
echo ""

# Player A joins and connects a WebSocket to claim the slot
COLUMN_A=$(curl -s -o /dev/null -w "%{url_effective}" -L "$JOIN_URL")
echo "Player A assigned to: $COLUMN_A"

BASE_URL=$(echo "$COLUMN_A" | sed 's|/games/.*||')
GAME_ID=$(echo "$COLUMN_A" | sed 's|.*/games/||' | cut -d'/' -f1)
COLUMN_ID=$(echo "$COLUMN_A" | rev | cut -d'/' -f1 | rev)
node "$SCRIPT_DIR/ws_connect.js" "$BASE_URL" "$GAME_ID" "$COLUMN_ID" &
WS_PID=$!

# Wait for the reservation to expire — Player A's WebSocket is connected,
# so the slot should remain claimed regardless
echo "Waiting $((RESERVATION_TIMEOUT + 1))s for reservation to expire..."
sleep $((RESERVATION_TIMEOUT + 1))

# Player B joins — should be redirected away from Player A's claimed column
COLUMN_B=$(curl -s -o /dev/null -w "%{url_effective}" -L "$JOIN_URL")
echo "Player B assigned to: $COLUMN_B"

echo ""
if [ "$COLUMN_A" = "$COLUMN_B" ]; then
  echo "FAIL: Both players were assigned to the same column."
  echo "      Race condition is present."
  exit 1
else
  echo "PASS: Players were assigned to different columns."
  exit 0
fi
