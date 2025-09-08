#!/bin/bash

curl -X POST -d "duration=20000" http://localhost:3000/api/games/dummy/iterations

#po
curl -X POST -d "taskId=1" http://localhost:3000/api/games/dummy/tasks
curl -X POST -d "taskId=2" http://localhost:3000/api/games/dummy/tasks
curl -X POST -d "taskId=3" http://localhost:3000/api/games/dummy/tasks
curl -X POST -d "taskId=4" http://localhost:3000/api/games/dummy/tasks
curl -X POST -d "taskId=5" http://localhost:3000/api/games/dummy/tasks

#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move
#po
curl -X POST -d "taskId=6" http://localhost:3000/api/games/dummy/tasks

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move
#po
curl -X POST -d "taskId=7" http://localhost:3000/api/games/dummy/tasks

sleep 1
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move
#dev
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
#po
curl -X POST -d "taskId=8" http://localhost:3000/api/games/dummy/tasks

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/4/move
#po
curl -X POST -d "taskId=9" http://localhost:3000/api/games/dummy/tasks

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/4/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/5/move
#po
curl -X POST -d "taskId=10" http://localhost:3000/api/games/dummy/tasks

sleep 1
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/5/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/6/move
#po
curl -X POST -d "taskId=11" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/4/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/6/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/7/move
#po
curl -X POST -d "taskId=12" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/4/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/5/move
#dev
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
#qa
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/7/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/8/move
#po
curl -X POST -d "taskId=13" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/5/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/6/move
#qa
curl -X POST http://localhost:3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/8/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/9/move
#po
curl -X POST -d "taskId=14" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/6/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/7/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/9/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/10/move
#po
curl -X POST -d "taskId=15" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/7/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/8/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/10/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/11/move
#po
curl -X POST -d "taskId=16" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/8/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/9/move
#dev
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move
#qa
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/11/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/12/move
#po
curl -X POST -d "taskId=17" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/9/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/10/move
#qa
curl -X POST http://localhost:3000/api/games/dummy/tasks/2/move

sleep 1
#analyst
curl -X POST http://localhost:3000/api/games/dummy/tasks/12/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/13/move
#po
curl -X POST -d "taskId=18" http://localhost:3000/api/games/dummy/tasks
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/10/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/11/move

sleep 1
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/11/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/12/move
#dev
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move
curl -X POST http://localhost:3000/api/games/dummy/tasks/4/move
#qa
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/move

sleep 1
#design
curl -X POST http://localhost:3000/api/games/dummy/tasks/3/reject
