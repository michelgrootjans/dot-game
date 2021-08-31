# The agile dot game
This is an online simulation of the agile dot game

This is not a finished project. These are the rough sketches of an online dot-game.

# Run it locally
run the following commands:

`npm run serverstart`

`open localhost:3000`

`http -f POST :3000/games gameId=g1`

`http -f POST :3000/games/g1/iteration iterationId='i1' duration=5000`

# ToDo
- join as a worker
  - you will be a [tester, developer, worker, ...]
  - work in inbox
    - take item in workplace
    - move item to outbox
- join as an observer
  - see kanban board
- join as a moderator
  - define the different iterations
    - push/pull
    - batch size
  - start the timer
  - when timer ends
    - show graph + stats
- create a new workshop
- join an existing workshop

# Busy

# Done