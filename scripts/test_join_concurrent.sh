#!/bin/bash

# Tests that 6 players joining simultaneously are handled correctly:
# - 5 players are assigned to distinct columns
# - 1 player gets 'game full'
# - No column is double-booked
#
# Players that successfully join also hold a WebSocket connection open
# for the duration of the script, as a real participant would.
#
# Usage: GAME_URL=http://localhost:3000/games/<game_id> ./scripts/test_join_concurrent.sh

source "$(dirname "$0")/common.sh"

JOIN_URL="${GAME_URL}/join"
SCRIPT_DIR="$(dirname "$0")"
NUM_PLAYERS=6
EXPECTED_JOINED=5
EXPECTED_FULL=1

TEMP_DIR=$(mktemp -d)
PLAYER_PIDS=()

cleanup() {
  for pid in "${PLAYER_PIDS[@]}"; do
    pkill -P "$pid" 2>/dev/null  # kill child node process
    kill "$pid" 2>/dev/null       # kill the subshell itself
  done
  wait 2>/dev/null
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

join_and_connect() {
  local i=$1
  local result base_url game_id column_id

  result=$(curl -s -o /dev/null -w "%{url_effective}" -L "$JOIN_URL")
  echo "$result" > "$TEMP_DIR/player_$i"

  if [[ "$result" != *"/join" ]]; then
    base_url=$(echo "$result" | sed 's|/games/.*||')
    game_id=$(echo "$result" | sed 's|.*/games/||' | cut -d'/' -f1)
    column_id=$(echo "$result" | rev | cut -d'/' -f1 | rev)
    node "$SCRIPT_DIR/ws_connect.js" "$base_url" "$game_id" "$column_id"
  fi
}

echo "Testing concurrent join with $NUM_PLAYERS players against: $JOIN_URL"
echo ""

# Launch all players simultaneously
for i in $(seq 1 $NUM_PLAYERS); do
  join_and_connect "$i" &
  PLAYER_PIDS+=($!)
done

# Wait for all curl requests to finish (output files written) before analysing
for i in $(seq 1 $NUM_PLAYERS); do
  while [ ! -f "$TEMP_DIR/player_$i" ]; do sleep 0.1; done
done

# Analyse results
FULL_COUNT=0
JOINED_COUNT=0

for i in $(seq 1 $NUM_PLAYERS); do
  RESULT=$(cat "$TEMP_DIR/player_$i")
  if [[ "$RESULT" == *"/join" ]]; then
    echo "  Player $i: game full"
    FULL_COUNT=$((FULL_COUNT + 1))
  else
    echo "  Player $i: assigned to $RESULT"
    JOINED_COUNT=$((JOINED_COUNT + 1))
    echo "$RESULT" >> "$TEMP_DIR/columns"
  fi
done

echo ""

PASS=1

# Check for double-bookings
if [ -f "$TEMP_DIR/columns" ]; then
  DOUBLES=$(sort "$TEMP_DIR/columns" | uniq -d)
  if [ -n "$DOUBLES" ]; then
    echo "FAIL: The following column(s) were assigned to multiple players (double-booked):"
    echo "$DOUBLES" | sed 's/^/       /'
    PASS=0
  fi
fi

if [ "$JOINED_COUNT" -ne "$EXPECTED_JOINED" ]; then
  echo "FAIL: Expected $EXPECTED_JOINED player(s) to join, got $JOINED_COUNT"
  PASS=0
fi

if [ "$FULL_COUNT" -ne "$EXPECTED_FULL" ]; then
  echo "FAIL: Expected $EXPECTED_FULL player(s) to get 'game full', got $FULL_COUNT"
  PASS=0
fi

if [ "$PASS" -eq 1 ]; then
  echo "PASS: $JOINED_COUNT players joined distinct columns, $FULL_COUNT got 'game full'."
  exit 0
else
  exit 1
fi
