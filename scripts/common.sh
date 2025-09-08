#!/bin/bash

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

# Function to generate random thinking time with a specific average
random_thinking_time() {
  local average=$1
  # Generate a random number between 0.5*average and 1.5*average
  # This will ensure the times average to the specified value over multiple iterations
  local random_factor=$(echo "scale=3; 0.5 + $RANDOM / 32767" | bc)
  local random_time=$(echo "scale=3; $average * $random_factor" | bc)
  echo $random_time
}

# Function for the Analyst
analyst_work() {
  local end_time=$((SECONDS + TIME))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in the backlog
    local task=$(get_next_task "backlog")

    if [ -n "$task" ]; then
      # Move task from backlog to analysis
      remove_task "backlog" "$task"
      add_task "analysis" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
      echo "Analyst moved task $task to analysis"

      sleep $(random_thinking_time 2)

      # Move from analysis to analysis done
      remove_task "analysis" "$task"
      add_task "analysis_done" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
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
      remove_task "analysis_done" "$task"
      add_task "development" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
      echo "Developer moved task $task to development"

      sleep $(random_thinking_time 5)

      # Move from development to development done
      remove_task "development" "$task"
      add_task "development_done" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
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
      remove_task "development_done" "$task"
      add_task "ops" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
      echo "Ops moved task $task to ops"

      sleep $(random_thinking_time 2)

      # Move from ops to ops done
      remove_task "ops" "$task"
      add_task "ops_done" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
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
      remove_task "ops_done" "$task"
      add_task "qa" "$task"

      curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
      echo "QA moved task $task to qa"

      sleep $(random_thinking_time 1)

      # 9/10 probability to move to done, otherwise reject
      if [ $(( RANDOM % 10 )) -lt 9 ]; then
        # Move from qa to done
        remove_task "qa" "$task"
        add_task "done" "$task"

        curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/move > /dev/null
        echo "QA moved task $task to done"
      else
        # Reject the task
        remove_task "qa" "$task"
        add_task "rejected" "$task"

        curl -s -X POST http://localhost:3000/api/games/dummy/tasks/$task/reject > /dev/null
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
}

# Function to clean up
cleanup() {
  # Clean up temporary directory
  rm -rf "$TEMP_DIR"
  echo "Simulation completed."
}
