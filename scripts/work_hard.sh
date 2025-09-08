#!/bin/bash

# Start a new game iteration with 30 seconds duration (30000 ms)
http --ignore-stdin -f POST :3000/api/games/dummy/iterations duration=30000

# Create a temporary directory for task tracking
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

# Function for the Product Owner (PO)
po_work() {
  local end_time=$((SECONDS + 30))
  local task_id=1

  while [ $SECONDS -lt $end_time ]; do
    # PO generates 1 task per second
    http --ignore-stdin -f POST :3000/api/games/dummy/tasks taskId="$task_id"
    echo "PO created task $task_id"

    # Add task to backlog
    add_task "backlog" "$task_id"

    task_id=$((task_id + 1))
    sleep 1
  done
}

# Function for the Analyst
analyst_work() {
  local end_time=$((SECONDS + 30))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in the backlog
    local task=$(get_next_task "backlog")

    if [ -n "$task" ]; then
      # Move task from backlog to analysis
      remove_task "backlog" "$task"
      add_task "analysis" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Analyst moved task $task to analysis"

      # Analyst thinks for about 1.2 seconds
      sleep 1.2

      # Move from analysis to analysis done
      remove_task "analysis" "$task"
      add_task "analysis_done" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Analyst moved task $task to analysis done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the Developer
developer_work() {
  local end_time=$((SECONDS + 30))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in analysis done
    local task=$(get_next_task "analysis_done")

    if [ -n "$task" ]; then
      # Move task from analysis done to development
      remove_task "analysis_done" "$task"
      add_task "development" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Developer moved task $task to development"

      # Developer thinks for about 2 seconds
      sleep 2

      # Move from development to development done
      remove_task "development" "$task"
      add_task "development_done" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Developer moved task $task to development done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the Ops
ops_work() {
  local end_time=$((SECONDS + 30))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in development done
    local task=$(get_next_task "development_done")

    if [ -n "$task" ]; then
      # Move task from development done to ops
      remove_task "development_done" "$task"
      add_task "ops" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Ops moved task $task to ops"

      # Ops thinks for about 1.5 seconds
      sleep 1.5

      # Move from ops to ops done
      remove_task "ops" "$task"
      add_task "ops_done" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "Ops moved task $task to ops done"
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Function for the QA
qa_work() {
  local end_time=$((SECONDS + 30))

  while [ $SECONDS -lt $end_time ]; do
    # Check if there are tasks in ops done
    local task=$(get_next_task "ops_done")

    if [ -n "$task" ]; then
      # Move task from ops done to qa
      remove_task "ops_done" "$task"
      add_task "qa" "$task"

      http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
      echo "QA moved task $task to qa"

      # QA thinks for about 0.9 seconds
      sleep 0.9

      # 9/10 probability to move to done, otherwise reject
      if [ $(( RANDOM % 10 )) -lt 9 ]; then
        # Move from qa to done
        remove_task "qa" "$task"
        add_task "done" "$task"

        http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/move
        echo "QA moved task $task to done"
      else
        # Reject the task
        remove_task "qa" "$task"
        add_task "rejected" "$task"

        http --ignore-stdin -f POST :3000/api/games/dummy/tasks/$task/reject
        echo "QA rejected task $task"
      fi
    else
      # If no tasks, wait a bit
      sleep 0.2
    fi
  done
}

# Run all workers in parallel
echo "Starting simulation for 30 seconds..."
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

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "Simulation completed."
