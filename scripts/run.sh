http -f POST :3000/games/ gameId=1
http -f POST :3000/games/1/iterations duration=5000

http -f POST :3000/games/1/tasks taskId='t1'
http -f POST :3000/games/1/tasks taskId='t2'
http -f POST :3000/games/1/tasks taskId='t3'
http -f POST :3000/games/1/tasks taskId='t4'

sleep 1
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
sleep 1
http -f POST :3000/games/1/tasks/t2/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
sleep 1
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t3/move
sleep 1
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t2/move
http -f POST :3000/games/1/tasks/t4/move
sleep 1
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t2/move
http -f POST :3000/games/1/tasks/t3/move
sleep 1
http -f POST :3000/games/1/tasks/t1/move
http -f POST :3000/games/1/tasks/t2/move
http -f POST :3000/games/1/tasks/t3/move
http -f POST :3000/games/1/tasks/t4/move
