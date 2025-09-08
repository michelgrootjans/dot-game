#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"

# Set default values
TIME=60
BASE_URL="http://localhost:3000"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    TIME=*)
      TIME="${arg#*=}"
      ;;
    BASE_URL=*)
      BASE_URL="${arg#*=}"
      ;;
  esac
done

# Export BASE_URL for common.sh
export BASE_URL

# Start a new game iteration with TIME seconds duration (TIME*1000 ms)
curl -s -X POST -d "duration=$((TIME * 1000))" "$BASE_URL/api/games/dummy/iterations" > /dev/null

# Setup environment
setup_environment

# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # PO generates 1 task per second
    curl -s -X POST -d "taskId=$task_id" "$BASE_URL/api/games/dummy/tasks" > /dev/null
    echo "PO created task $task_id"

    # Add task to backlog
    add_task "backlog" "$task_id"

    task_id=$((task_id + 1))
    sleep $(random_thinking_time 1)
  done
}

# Display startup message
echo "Starting simulation for $TIME seconds..."

# Run all workers in parallel
run_workers

# Clean up
cleanup
