http -f POST :3000/api/games/default/iterations duration=10000

http -f POST :3000/api/games/default/tasks taskId='t1'
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks taskId='t2'
http -f POST :3000/api/games/default/tasks taskId='t3'
http -f POST :3000/api/games/default/tasks taskId='t4'
http -f POST :3000/api/games/default/tasks taskId='t5'
http -f POST :3000/api/games/default/tasks taskId='t6'
http -f POST :3000/api/games/default/tasks taskId='t7'
http -f POST :3000/api/games/default/tasks taskId='t8'
http -f POST :3000/api/games/default/tasks taskId='t9'
http -f POST :3000/api/games/default/tasks taskId='t10'

http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move

sleep 1
http -f POST :3000/api/games/default/tasks/t2/move
http -f POST :3000/api/games/default/tasks/t3/move

sleep 1
http -f POST :3000/api/games/default/tasks/t3/move
http -f POST :3000/api/games/default/tasks/t4/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move

sleep 1
http -f POST :3000/api/games/default/tasks/t3/move
http -f POST :3000/api/games/default/tasks/t4/move
http -f POST :3000/api/games/default/tasks/t5/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move

sleep 1
http -f POST :3000/api/games/default/tasks/t3/move
http -f POST :3000/api/games/default/tasks/t4/move
http -f POST :3000/api/games/default/tasks/t5/move
http -f POST :3000/api/games/default/tasks/t6/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move
