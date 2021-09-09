http -f POST :3000/api/games/default/iterations duration=35000

#po
http -f POST :3000/api/games/default/tasks taskId='1'
http -f POST :3000/api/games/default/tasks taskId='2'
http -f POST :3000/api/games/default/tasks taskId='3'
http -f POST :3000/api/games/default/tasks taskId='4'
http -f POST :3000/api/games/default/tasks taskId='5'

#analyst
http -f POST :3000/api/games/default/tasks/1/move
#po
http -f POST :3000/api/games/default/tasks taskId='6'

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move
#design
http -f POST :3000/api/games/default/tasks/1/move
#po
http -f POST :3000/api/games/default/tasks taskId='7'

sleep 1
#design
http -f POST :3000/api/games/default/tasks/1/move
#dev
http -f POST :3000/api/games/default/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/2/move
http -f POST :3000/api/games/default/tasks/3/move
#design
http -f POST :3000/api/games/default/tasks/2/move
#po
http -f POST :3000/api/games/default/tasks taskId='8'

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move
#po
http -f POST :3000/api/games/default/tasks taskId='9'

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/4/move
http -f POST :3000/api/games/default/tasks/5/move
#po
http -f POST :3000/api/games/default/tasks taskId='10'

sleep 1
#design
http -f POST :3000/api/games/default/tasks/2/move
http -f POST :3000/api/games/default/tasks/3/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/5/move
http -f POST :3000/api/games/default/tasks/6/move
#po
http -f POST :3000/api/games/default/tasks taskId='11'
#design
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/6/move
http -f POST :3000/api/games/default/tasks/7/move
#po
http -f POST :3000/api/games/default/tasks taskId='12'
#design
http -f POST :3000/api/games/default/tasks/4/move
http -f POST :3000/api/games/default/tasks/5/move
#dev
http -f POST :3000/api/games/default/tasks/1/move
http -f POST :3000/api/games/default/tasks/2/move
#qa
http -f POST :3000/api/games/default/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/7/move
http -f POST :3000/api/games/default/tasks/8/move
#po
http -f POST :3000/api/games/default/tasks taskId='13'
#design
http -f POST :3000/api/games/default/tasks/5/move
http -f POST :3000/api/games/default/tasks/6/move
#qa
http -f POST :3000/api/games/default/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/8/move
http -f POST :3000/api/games/default/tasks/9/move
#po
http -f POST :3000/api/games/default/tasks taskId='14'
#design
http -f POST :3000/api/games/default/tasks/6/move
http -f POST :3000/api/games/default/tasks/7/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/9/move
http -f POST :3000/api/games/default/tasks/10/move
#po
http -f POST :3000/api/games/default/tasks taskId='15'
#design
http -f POST :3000/api/games/default/tasks/7/move
http -f POST :3000/api/games/default/tasks/8/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/10/move
http -f POST :3000/api/games/default/tasks/11/move
#po
http -f POST :3000/api/games/default/tasks taskId='16'
#design
http -f POST :3000/api/games/default/tasks/8/move
http -f POST :3000/api/games/default/tasks/9/move
#dev
http -f POST :3000/api/games/default/tasks/2/move
http -f POST :3000/api/games/default/tasks/3/move
#qa
http -f POST :3000/api/games/default/tasks/2/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/11/move
http -f POST :3000/api/games/default/tasks/12/move
#po
http -f POST :3000/api/games/default/tasks taskId='17'
#design
http -f POST :3000/api/games/default/tasks/9/move
http -f POST :3000/api/games/default/tasks/10/move
#qa
http -f POST :3000/api/games/default/tasks/2/move

sleep 1
#analyst
http -f POST :3000/api/games/default/tasks/12/move
http -f POST :3000/api/games/default/tasks/13/move
#po
http -f POST :3000/api/games/default/tasks taskId='18'
#design
http -f POST :3000/api/games/default/tasks/10/move
http -f POST :3000/api/games/default/tasks/11/move

sleep 1
#design
http -f POST :3000/api/games/default/tasks/11/move
http -f POST :3000/api/games/default/tasks/12/move
#dev
http -f POST :3000/api/games/default/tasks/3/move
http -f POST :3000/api/games/default/tasks/4/move
#qa
http -f POST :3000/api/games/default/tasks/3/move

sleep 1
#design
http -f POST :3000/api/games/default/tasks/12/move
