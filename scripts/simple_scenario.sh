http -f POST :3000/api/games/default/iterations duration=10000

http -f POST :3000/api/games/default/tasks taskId='1'
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks taskId='2'
http -f POST :3000/api/games/default/tasks taskId='3'
http -f POST :3000/api/games/default/tasks taskId='4'
http -f POST :3000/api/games/default/tasks taskId='5'
http -f POST :3000/api/games/default/tasks taskId='6'
http -f POST :3000/api/games/default/tasks taskId='7'
http -f POST :3000/api/games/default/tasks taskId='8'
http -f POST :3000/api/games/default/tasks taskId='9'
http -f POST :3000/api/games/default/tasks taskId='10'

http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move

sleep 1
http -f POST :3000/api/games/default/tasks/2/move
http -f POST :3000/api/games/default/tasks/3/move

sleep 1
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move

sleep 1
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move
http -f POST :3000/api/games/default/tasks/5/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move

sleep 1
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move
http -f POST :3000/api/games/default/tasks/5/move
http -f POST :3000/api/games/default/tasks/6/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move
