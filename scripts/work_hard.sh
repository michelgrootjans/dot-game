#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"

# Set default values
TIME=60
BASE_URL="http://localhost:3000"
GAME_ID="dummy"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    TIME=*)
      TIME="${arg#*=}"
      ;;
    BASE_URL=*)
      BASE_URL="${arg#*=}"
      ;;
    GAME_ID=*)
      GAME_ID="${arg#*=}"
      ;;
  esac
done

# Export BASE_URL and GAME_ID for common.sh
export BASE_URL
export GAME_ID

# Start a new game iteration with TIME seconds duration (TIME*1000 ms)
curl -s -X POST -d "duration=$((TIME * 1000))" "$(game_url)/iterations" > /dev/null

# Setup environment
setup_environment

# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # PO generates 1 task per second
    curl -s -X POST -d "taskId=$task_id" "$(game_url)/tasks" > /dev/null
    echo "PO created task $task_id"

    # Add task to backlog
    add_task "backlog" "$task_id"

    task_id=$((task_id + 1))
    sleep $(PO_thinking_time)
  done
}

# Display startup message
echo "Starting simulation for $TIME seconds..."

# Run all workers in parallel
run_workers

# Clean up
cleanup
