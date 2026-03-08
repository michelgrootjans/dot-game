#!/bin/bash

# Source common functions
source "$(dirname "$0")/common.sh"

# Defaults
WIP=5

# Parse WIP locally and common args via common.sh helper
for arg in "$@"; do
  case $arg in
    WIP=*)
      WIP="${arg#*=}"
      ;;
  esac
done

# --- Helpers specific to Kanban WIP constraints ---
count_column() {
  local column=$1
  if [ -f "$TEMP_DIR/$column" ]; then
    wc -l < "$TEMP_DIR/$column"
  else
    echo 0
  fi
}

count_columns_sum() {
  local sum=0
  for col in "$@"; do
    local c=$(count_column "$col")
    sum=$((sum + c))
  done
  echo $sum
}

# --- Workers (override the ones from common.sh with WIP gating) ---
# Product Owner: generates 1 task per second, but is WIP-gated on backlog outbox
po_work() {
  local end_time=$((SECONDS + TIME))
  local task_id=1
  while [ $SECONDS -lt $end_time ]; do
    # Apply WIP gate: PO outbox is the backlog column
    local outbox_count=$(count_column "backlog")
    if [ "$outbox_count" -ge "$WIP" ]; then
      # Outbox full, wait
      sleep 0.2
      continue
    fi

    create_task "$task_id"
    echo "PO created task $task_id"
    add_task "backlog" "$task_id"
    task_id=$((task_id + 1))
    sleep $(PO_thinking_time)
  done
}

# Analyst: outbox is analysis_done; avg think ~1.2s
analyst_work() {
  local end_time=$((SECONDS + TIME))
  while [ $SECONDS -lt $end_time ]; do
    # WIP gate on outbox
    local outbox_count=$(count_column "analysis_done")
    if [ "$outbox_count" -ge "$WIP" ]; then
      # Outbox full, wait
      sleep 0.2
      continue
    fi

    local task=$(get_next_task "backlog")
    if [ -n "$task" ]; then
      advance_task "$task" "backlog" "analysis"
      echo "Analyst moved task $task to analysis"

      sleep $(analyst_thinking_time)

      advance_task "$task" "analysis" "analysis_done"
      echo "Analyst moved task $task to analysis done"
    else
      sleep 0.2
    fi
  done
}

# Developer: outbox is development_done; avg think ~2s
developer_work() {
  local end_time=$((SECONDS + TIME))
  while [ $SECONDS -lt $end_time ]; do
    local outbox_count=$(count_column "development_done")
    if [ "$outbox_count" -ge "$WIP" ]; then
      sleep 0.2
      continue
    fi

    local task=$(get_next_task "analysis_done")
    if [ -n "$task" ]; then
      advance_task "$task" "analysis_done" "development"
      echo "Developer moved task $task to development"

      sleep $(developer_thinking_time)

      advance_task "$task" "development" "development_done"
      echo "Developer moved task $task to development done"
    else
      sleep 0.2
    fi
  done
}

# Ops: outbox is ops_done; avg think ~1.5s
ops_work() {
  local end_time=$((SECONDS + TIME))
  while [ $SECONDS -lt $end_time ]; do
    local outbox_count=$(count_column "ops_done")
    if [ "$outbox_count" -ge "$WIP" ]; then
      sleep 0.2
      continue
    fi

    local task=$(get_next_task "development_done")
    if [ -n "$task" ]; then
      advance_task "$task" "development_done" "ops"
      echo "Ops moved task $task to ops"

      sleep $(ops_thinking_time)

      advance_task "$task" "ops" "ops_done"
      echo "Ops moved task $task to ops done"
    else
      sleep 0.2
    fi
  done
}

# QA: no outbox constraint; avg think ~0.9s
qa_work() {
  local end_time=$((SECONDS + TIME))
  while [ $SECONDS -lt $end_time ]; do
    local task=$(get_next_task "ops_done")
    if [ -n "$task" ]; then
      advance_task "$task" "ops_done" "qa"
      echo "QA moved task $task to qa"

      sleep $(qa_thinking_time)

      if qa_approves; then
        advance_task "$task" "qa" "done"
        echo "QA moved task $task to done"
      else
        remove_task "qa" "$task"
        add_task "rejected" "$task"
        reject_task "$task"
        echo "QA rejected task $task"
      fi
    else
      sleep 0.2
    fi
  done
}

# Display startup message
echo "Starting Kanban simulation for $TIME seconds with per-worker outbox WIP limit of $WIP..."

# Run (includes cleanup)
run_workers
