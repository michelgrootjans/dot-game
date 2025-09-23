#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"


# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # PO generates 1 task per second
    create_task "$task_id"
    echo "PO created task $task_id"

    # Add task to backlog
    add_task "backlog" "$task_id"

    task_id=$((task_id + 1))
    sleep $(PO_thinking_time)
  done
}

# Display startup message
echo "Starting simulation for $TIME seconds..."

# Run all workers in parallel (includes cleanup)
run_workers
