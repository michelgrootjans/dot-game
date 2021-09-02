#http -f POST :3000/api/games/ gameId=default
http -f POST :3000/api/games/default/iterations duration=5000

http -f POST :3000/api/games/default/tasks taskId='t1'
http -f POST :3000/api/games/default/tasks taskId='t2'
http -f POST :3000/api/games/default/tasks taskId='t3'
http -f POST :3000/api/games/default/tasks taskId='t4'

sleep 1
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
sleep 1
http -f POST :3000/api/games/default/tasks/t2/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t3/move
sleep 1
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t3/move
sleep 1
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move
http -f POST :3000/api/games/default/tasks/t4/move
sleep 1
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move
http -f POST :3000/api/games/default/tasks/t3/move
sleep 1
http -f POST :3000/api/games/default/tasks/t1/move
http -f POST :3000/api/games/default/tasks/t2/move
http -f POST :3000/api/games/default/tasks/t3/move
http -f POST :3000/api/games/default/tasks/t4/move
