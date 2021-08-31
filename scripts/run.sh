http -f POST :3000/games/ gameId=1
http -f POST :3000/games/1/iterations iterationId='i1' duration=5000

http -f POST :3000/games/1/tasks taskId='t1'
http -f POST :3000/games/1/tasks taskId='t2'
http -f POST :3000/games/1/tasks taskId='t3'
http -f POST :3000/games/1/tasks taskId='t4'
http -f POST :3000/games/1/tasks taskId='t5'
http -f POST :3000/games/1/tasks taskId='t6'
http -f POST :3000/games/1/tasks taskId='t7'
http -f POST :3000/games/1/tasks taskId='t8'
http -f POST :3000/games/1/tasks taskId='t9'


sleep 1
http -f POST :3000/games/1/tasks/t1/move taskId='t1'
http -f POST :3000/games/1/tasks/t1/move taskId='t2'
http -f POST :3000/games/1/tasks/t1/move taskId='t3'
sleep 1
http -f POST :3000/games/1/tasks/t1/move taskId='t1'
sleep 1
http -f POST :3000/games/1/tasks/t1/move taskId='t2'
sleep 1
http -f POST :3000/games/1/tasks/t1/move taskId='t3'
sleep 1
http -f POST :3000/games/1/tasks/t1/move taskId='t4'
http -f POST :3000/games/1/tasks/t1/move taskId='t5'
http -f POST :3000/games/1/tasks/t1/move taskId='t6'
