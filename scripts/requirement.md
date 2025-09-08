add a script /scripts/work_hard.sh, similar to /scripts/simple_scenario.sh that simulates the following:

the scenrio runs for 60 seconds
there are 10 columns:
- backlog
- analysis
- analysis done
- development
- development done
- ops
- ops done
- qa
- done
- rejected

5 workers work on tasks in parallel
the workers are named: PO, Analyst, Developer, Ops and QA
the workers are organised like this
- the po:
  - outbox: backlog
- the analyst:
  - inbox: backlog, workspace: analysis, outbox: analysis done
- the developer
  - inbox: analysis done, workspace: development, outbox: developlent done
- the ops
  - inbox: development done, workspace: ops, outbox: ops done
- the qa
  - inbox: ops done, workspace: qa, outbox: done or rejected

Except for the PO, workers do nothing if there is nothing in their inbox or workspace.

The PO generates 1 task per second
The analyst takes one item at a time in their workspace, thinks for about 1.2 seconds, then moves the task to their outbox
The developer takes one item at a time in their workspace, thinks for about 2 seconds, then moves the task to their outbox
The ops takes one item at a time in their workspace, thinks for about 1.5 seconds, then moves the task to their outbox
The ops takes one item at a time in their workspace, thinks for about 0.9 seconds, then has a 9/10 probability to move the task to done, otherwise they reject the task

All 5 workers work in parallel for the duration of the simulation. Thinking time is random with an average given in the requirements above.
Make the length of the simulation an optional parameter TIME that defaults to 60
Parameters should be provided as `./scripts/work_hard.sh TIME=30`.

starting an iteration is done by calling `http -f POST :3000/api/games/dummy/iterations duration=[duration in miliseconds]`
creating an item and adding it to the backlog is done by calling `http -f POST :3000/api/games/dummy/tasks taskId='[id]'`
moving an item to the next column is done by calling `http -f POST :3000/api/games/dummy/tasks/[id]/move`
rejecting a task is done by calling `http -f POST :3000/api/games/dummy/tasks/[id]/reject`

create a second script /scripts/limit_wip.sh
this script has the same requirements as above, with an extra constraint:
- the total work in progress is the number of tasks that have been created and are not done or rejected
- the PO not allowed to create a task if the total work in progress is 10 or more
- make this wip-limit an optional parameter WIP that defaults to 10

Update readme.md accordingly
