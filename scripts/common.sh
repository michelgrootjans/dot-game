#!/bin/bash

# Default game URL (can be overridden by scripts that source this file)
GAME_URL=${GAME_URL:-"http://localhost:3000/games/dummy"}
# Default time in seconds for simulations (can be overridden by scripts or via env)
TIME=${TIME:-60}

# Parse common KEY=VALUE CLI args: TIME, GAME_URL
# This function will be invoked automatically when common.sh is sourced
parse_common_args() {
  for arg in "$@"; do
    case $arg in
      TIME=*)
        TIME="${arg#*=}"
        ;;
      GAME_URL=*)
        GAME_URL="${arg#*=}"
        ;;
    esac
  done
  export GAME_URL
}

# Common helper to build the game API base URL
# Usage: curl "$(game_url)/iterations" ...
game_url() {
  # Transform GAME_URL by inserting /api before /games
  # Example: https://example.com/games/123 -> https://example.com/api/games/123
  echo "$GAME_URL" | sed 's|/games/|/api/games/|'
}

# --- Common API wrappers ---
# Start a new iteration given duration in milliseconds
start_iteration() {
  local duration_ms=$1
  curl -s -X POST -d "duration=${duration_ms}" "$(game_url)/iterations" > /dev/null
}

# Create a new task with given task id
create_task() {
  local task_id=$1
  curl -s -X POST -d "taskId=${task_id}" "$(game_url)/tasks" > /dev/null
}

# Move a task forward in the workflow
move_task() {
  local task_id=$1
  curl -s -X POST "$(game_url)/tasks/${task_id}/move" > /dev/null
}

# Reject a task from QA
reject_task() {
  local task_id=$1
  curl -s -X POST "$(game_url)/tasks/${task_id}/reject" > /dev/null
}

# Create a temporary directory for task tracking
setup_environment() {
  TEMP_DIR=$(mktemp -d)
  echo "Using temporary directory for task tracking: $TEMP_DIR"

  # Initialize tracking files for each column
  touch "$TEMP_DIR/backlog"
  touch "$TEMP_DIR/analysis"
  touch "$TEMP_DIR/analysis_done"
  touch "$TEMP_DIR/development"
  touch "$TEMP_DIR/development_done"
  touch "$TEMP_DIR/ops"
  touch "$TEMP_DIR/ops_done"
  touch "$TEMP_DIR/qa"
  touch "$TEMP_DIR/done"
  touch "$TEMP_DIR/rejected"
}

# Function to get the next task from a column
get_next_task() {
  local column=$1
  if [ -s "$TEMP_DIR/$column" ]; then
    head -1 "$TEMP_DIR/$column"
  else
    echo ""
  fi
}

# Function to remove a task from a column
remove_task() {
  local column=$1
  local task=$2
  if [ -n "$task" ]; then
    grep -v "^$task$" "$TEMP_DIR/$column" > "$TEMP_DIR/$column.tmp"
    mv "$TEMP_DIR/$column.tmp" "$TEMP_DIR/$column"
  fi
}

# Function to add a task to a column
add_task() {
  local column=$1
  local task=$2
  if [ -n "$task" ]; then
    echo "$task" >> "$TEMP_DIR/$column"
  fi
}

# Advance a task from one column to another and notify server
# Usage: advance_task "<taskId>" "<from>" "<to>"
advance_task() {
  local task=$1
  local from=$2
  local to=$3
  remove_task "$from" "$task"
  add_task "$to" "$task"
  move_task "$task"
}

# Function to generate random thinking time with a specific average
random_thinking_time() {
  local average=$1
  # Generate a random number between 0.5*average and 1.5*average
  # This will ensure the times average to the specified value over multiple iterations
  local random_factor=$(echo "scale=3; 0.5 + $RANDOM / 32767" | bc)
  local random_time=$(echo "scale=3; $average * $random_factor" | bc)
  echo $random_time
}

# Role-specific thinking time helpers (centralized)
PO_thinking_time() {
  random_thinking_time 1
}
analyst_thinking_time() {
  random_thinking_time 2
}
developer_thinking_time() {
  random_thinking_time 5
}
ops_thinking_time() {
  random_thinking_time 2
}
qa_thinking_time() {
  random_thinking_time 1
}

# QA approval probability helper (centralized)
# Configure with QA_APPROVE_PERCENT (0-100), default 90
qa_approves() {
  local percent=${QA_APPROVE_PERCENT:-90}
  local roll=$((RANDOM % 100))
  [ "$roll" -lt "$percent" ]
}

# Function for the Analyst
analyst_work() {
  local end_time=$((SECONDS + TIME))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in the backlog
    local task=$(get_next_task "backlog")

    if [ -n "$task" ]; then
      # Move task from backlog to analysis
      advance_task "$task" "backlog" "analysis"
      echo "Analyst moved task $task to analysis"

      sleep $(random_thinking_time 2)

      # Move from analysis to analysis done
      advance_task "$task" "analysis" "analysis_done"
      echo "Analyst moved task $task to analysis done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the Developer
developer_work() {
  local end_time=$((SECONDS + TIME))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in analysis done
    local task=$(get_next_task "analysis_done")

    if [ -n "$task" ]; then
      # Move task from analysis done to development
      advance_task "$task" "analysis_done" "development"
      echo "Developer moved task $task to development"

      sleep $(random_thinking_time 5)

      # Move from development to development done
      advance_task "$task" "development" "development_done"
      echo "Developer moved task $task to development done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the Ops
ops_work() {
  local end_time=$((SECONDS + TIME))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in development done
    local task=$(get_next_task "development_done")

    if [ -n "$task" ]; then
      # Move task from development done to ops
      advance_task "$task" "development_done" "ops"
      echo "Ops moved task $task to ops"

      sleep $(random_thinking_time 2)

      # Move from ops to ops done
      advance_task "$task" "ops" "ops_done"
      echo "Ops moved task $task to ops done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the QA
qa_work() {
  local end_time=$((SECONDS + TIME))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in ops done
    local task=$(get_next_task "ops_done")

    if [ -n "$task" ]; then
      # Move task from ops done to qa
      advance_task "$task" "ops_done" "qa"
      echo "QA moved task $task to qa"

      sleep $(random_thinking_time 1)

      # Decide approval using centralized helper
      if qa_approves; then
        # Move from qa to done
        advance_task "$task" "qa" "done"
        echo "QA moved task $task to done"
      else
        # Reject the task
        remove_task "qa" "$task"
        add_task "rejected" "$task"

        reject_task "$task"
        echo "QA rejected task $task"
      fi
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function to run all workers in parallel
run_workers() {
  # Ensure iteration is started and environment is ready
  start_iteration $((TIME * 1000))
  setup_environment

  # Run all workers in parallel
  po_work &
  po_pid=$!
  analyst_work &
  analyst_pid=$!
  developer_work &
  developer_pid=$!
  ops_work &
  ops_pid=$!
  qa_work &
  qa_pid=$!

  # Wait for all processes to complete
  wait $po_pid
  wait $analyst_pid
  wait $developer_pid
  wait $ops_pid
  wait $qa_pid

  # Perform cleanup once all workers are done
  cleanup
}

# Function to clean up
cleanup() {
  # Clean up temporary directory
  rm -rf "$TEMP_DIR"
  echo "Simulation completed."
}

# Auto-parse common args when this file is sourced
# This uses the parent script's "$@" to pick up KEY=VALUE args
parse_common_args "$@"
