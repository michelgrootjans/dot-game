#!/bin/bash

# Tests the full ColumnTaken flow end-to-end:
#
#   t= 0s  Player A: HTTP join → reserves first column
#   t= 6s  Reservation expires (Player A's WebSocket has not connected yet)
#   t= 6s  Player B: HTTP join → same column is free → reserves it
#   t= 6s  Player B: WebSocket connects → claims the column
#   t=10s  Player A: WebSocket connects (late) → receives ColumnTaken
#          → follows /join redirect → gets assigned the next column
#
# Expected result: B holds the first column, A ends up on the second.
#
# Usage: GAME_URL=http://localhost:3000/games/<game_id> ./scripts/test_join_race.sh

source "$(dirname "$0")/common.sh"

SCRIPT_DIR="$(dirname "$0")"
JOIN_URL="${GAME_URL}/join"
RESERVATION_TIMEOUT=5   # must match reserve() timeout in Game.js
WS_DELAY=10             # Player A connects WebSocket this many seconds after HTTP join

TEMP_DIR=$(mktemp -d)
WS_B_PID=""

cleanup() {
  [ -n "$WS_B_PID" ] && kill "$WS_B_PID" 2>/dev/null
  wait 2>/dev/null
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "Testing join race condition against: $JOIN_URL"
echo "  Reservation timeout : ${RESERVATION_TIMEOUT}s"
echo "  Player A WebSocket delay: ${WS_DELAY}s"
echo ""

# --- Player A: HTTP join ---
COLUMN_A_INITIAL=$(curl -s -o /dev/null -w "%{url_effective}" -L "$JOIN_URL")
echo "Player A reserved: $COLUMN_A_INITIAL"

BASE_URL=$(echo "$COLUMN_A_INITIAL" | sed 's|/games/.*||')
GAME_ID=$(echo "$COLUMN_A_INITIAL"  | sed 's|.*/games/||' | cut -d'/' -f1)
COLUMN_ID=$(echo "$COLUMN_A_INITIAL" | rev | cut -d'/' -f1 | rev)

# Player A's WebSocket connects late — after the reservation has expired
(sleep $WS_DELAY && node "$SCRIPT_DIR/ws_connect.js" "$BASE_URL" "$GAME_ID" "$COLUMN_ID") \
  > "$TEMP_DIR/player_a" 2>&1 &
PLAYER_A_PID=$!

# --- Wait for reservation to expire ---
echo "Waiting $((RESERVATION_TIMEOUT + 1))s for reservation to expire..."
sleep $((RESERVATION_TIMEOUT + 1))

# --- Player B: HTTP join + immediate WebSocket ---
COLUMN_B=$(curl -s -o /dev/null -w "%{url_effective}" -L "$JOIN_URL")
echo "Player B reserved: $COLUMN_B"

BASE_URL_B=$(echo "$COLUMN_B"   | sed 's|/games/.*||')
GAME_ID_B=$(echo "$COLUMN_B"    | sed 's|.*/games/||' | cut -d'/' -f1)
COLUMN_ID_B=$(echo "$COLUMN_B"  | rev | cut -d'/' -f1 | rev)
node "$SCRIPT_DIR/ws_connect.js" "$BASE_URL_B" "$GAME_ID_B" "$COLUMN_ID_B" &
WS_B_PID=$!

# --- Wait for Player A's WebSocket to connect and resolve ---
# Kill Player A's process after a deadline so the test fails rather than hangs
# if the server never emits ColumnTaken (e.g. old implementation).
TIMEOUT=$((WS_DELAY + 10))
echo "Waiting for Player A's WebSocket to connect at ${WS_DELAY}s and handle ColumnTaken (timeout: ${TIMEOUT}s)..."
( sleep $TIMEOUT && kill $PLAYER_A_PID 2>/dev/null ) &
TIMEOUT_PID=$!
wait $PLAYER_A_PID 2>/dev/null
kill $TIMEOUT_PID 2>/dev/null

COLUMN_A_FINAL=$(grep "reassigned to:" "$TEMP_DIR/player_a" | sed 's|.*reassigned to: ||')

echo ""
echo "Player A final column : ${COLUMN_A_FINAL:-<not reassigned>}"
echo "Player B column       : $COLUMN_B"
echo ""

PASS=1

if [ -z "$COLUMN_A_FINAL" ]; then
  echo "FAIL: Player A did not receive ColumnTaken — slot was not protected."
  PASS=0
fi

if [ -n "$COLUMN_A_FINAL" ] && [ "$COLUMN_A_FINAL" = "$COLUMN_B" ]; then
  echo "FAIL: Both players ended up on the same column."
  PASS=0
fi

if [ "$PASS" -eq 1 ]; then
  echo "PASS: Player B claimed the first column, Player A was reassigned to a different one."
  exit 0
else
  exit 1
fi
