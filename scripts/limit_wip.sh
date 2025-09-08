#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"

# Set default values
WIP=10
TIME=60
BASE_URL="http://localhost:3000"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    WIP=*)
      WIP="${arg#*=}"
      ;;
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

# Function to count total work in progress
# WIP is defined as tasks that are not in done or rejected columns
count_wip() {
  local wip=0
  # Count tasks in each column except done and rejected
  for column in backlog analysis analysis_done development development_done ops ops_done qa; do
    local count=$(wc -l < "$TEMP_DIR/$column")
    wip=$((wip + count))
  done
  echo $wip
}

# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # Check if WIP limit is reached
    local wip=$(count_wip)

    if [ $wip -lt $WIP ]; then
      # PO generates 1 task per second if WIP is under limit
      curl -s -X POST -d "taskId=$task_id" "$BASE_URL/api/games/dummy/tasks" > /dev/null
      echo "PO created task $task_id (WIP: $wip/$WIP)"

      # Add task to backlog
      add_task "backlog" "$task_id"

      task_id=$((task_id + 1))
    else
      echo "PO waiting - WIP limit reached: $wip/$WIP"
    fi

    sleep $(random_thinking_time 1)
  done
}

# Display startup message
echo "Starting simulation for $TIME seconds with WIP limit of $WIP..."

# Run all workers in parallel
run_workers

# Clean up
cleanup
