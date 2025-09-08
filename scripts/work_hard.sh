#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"

# Set default simulation time to 60 seconds if not provided
TIME=60

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    TIME=*)
      TIME="${arg#*=}"
      ;;
  esac
done

# Start a new game iteration with TIME seconds duration (TIME*1000 ms)
curl -s -X POST -d "duration=$((TIME * 1000))" http://localhost:3000/api/games/dummy/iterations > /dev/null

# Setup environment
setup_environment

# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # PO generates 1 task per second
    curl -s -X POST -d "taskId=$task_id" http://localhost:3000/api/games/dummy/tasks > /dev/null
    echo "PO created task $task_id"

    # Add task to backlog
    add_task "backlog" "$task_id"

    task_id=$((task_id + 1))
    sleep 1
  done
}

# Display startup message
echo "Starting simulation for $TIME seconds..."

# Run all workers in parallel
run_workers

# Clean up
cleanup
