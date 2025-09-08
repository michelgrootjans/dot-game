#!/bin/bash

curl -s -X POST -d "duration=15000" http://localhost:3000/api/games/dummy/iterations > /dev/null

#po
curl -s -X POST -d "taskId=1" http://localhost:3000/api/games/dummy/tasks > /dev/null
curl -s -X POST -d "taskId=2" http://localhost:3000/api/games/dummy/tasks > /dev/null
curl -s -X POST -d "taskId=3" http://localhost:3000/api/games/dummy/tasks > /dev/null
curl -s -X POST -d "taskId=4" http://localhost:3000/api/games/dummy/tasks > /dev/null
curl -s -X POST -d "taskId=5" http://localhost:3000/api/games/dummy/tasks > /dev/null

#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null
#po
curl -s -X POST -d "taskId=6" http://localhost:3000/api/games/dummy/tasks > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null
#po
curl -s -X POST -d "taskId=7" http://localhost:3000/api/games/dummy/tasks > /dev/null

sleep 1
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null
#dev
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
#po
curl -s -X POST -d "taskId=8" http://localhost:3000/api/games/dummy/tasks > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/4/move > /dev/null
#po
curl -s -X POST -d "taskId=9" http://localhost:3000/api/games/dummy/tasks > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/4/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/5/move > /dev/null
#po
curl -s -X POST -d "taskId=10" http://localhost:3000/api/games/dummy/tasks > /dev/null

sleep 1
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/5/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/6/move > /dev/null
#po
curl -s -X POST -d "taskId=11" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/4/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/6/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/7/move > /dev/null
#po
curl -s -X POST -d "taskId=12" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/4/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/5/move > /dev/null
#dev
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
#qa
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/7/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/8/move > /dev/null
#po
curl -s -X POST -d "taskId=13" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/5/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/6/move > /dev/null
#qa
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/1/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/8/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/9/move > /dev/null
#po
curl -s -X POST -d "taskId=14" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/6/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/7/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/9/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/10/move > /dev/null
#po
curl -s -X POST -d "taskId=15" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/7/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/8/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/10/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/11/move > /dev/null
#po
curl -s -X POST -d "taskId=16" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/8/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/9/move > /dev/null
#dev
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null
#qa
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/11/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/12/move > /dev/null
#po
curl -s -X POST -d "taskId=17" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/9/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/10/move > /dev/null
#qa
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/2/move > /dev/null

sleep 1
#analyst
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/12/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/13/move > /dev/null
#po
curl -s -X POST -d "taskId=18" http://localhost:3000/api/games/dummy/tasks > /dev/null
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/10/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/11/move > /dev/null

sleep 1
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/11/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/12/move > /dev/null
#dev
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/4/move > /dev/null
#qa
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/move > /dev/null

sleep 1
#design
curl -s -X POST http://localhost:3000/api/games/dummy/tasks/3/reject > /dev/null
