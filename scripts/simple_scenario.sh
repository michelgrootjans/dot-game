http -f POST :3000/api/games/dummy/iterations duration=35000

#po
http -f POST :3000/api/games/dummy/tasks taskId='1'
http -f POST :3000/api/games/dummy/tasks taskId='2'
http -f POST :3000/api/games/dummy/tasks taskId='3'
http -f POST :3000/api/games/dummy/tasks taskId='4'
http -f POST :3000/api/games/dummy/tasks taskId='5'

#analyst
http -f POST :3000/api/games/dummy/tasks/1/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='6'

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/1/move
http -f POST :3000/api/games/dummy/tasks/2/move
#design
http -f POST :3000/api/games/dummy/tasks/1/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='7'

sleep 1
#design
http -f POST :3000/api/games/dummy/tasks/1/move
#dev
http -f POST :3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/2/move
http -f POST :3000/api/games/dummy/tasks/3/move
#design
http -f POST :3000/api/games/dummy/tasks/2/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='8'

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/3/move
http -f POST :3000/api/games/dummy/tasks/4/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='9'

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/4/move
http -f POST :3000/api/games/dummy/tasks/5/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='10'

sleep 1
#design
http -f POST :3000/api/games/dummy/tasks/2/move
http -f POST :3000/api/games/dummy/tasks/3/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/5/move
http -f POST :3000/api/games/dummy/tasks/6/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='11'
#design
http -f POST :3000/api/games/dummy/tasks/3/move
http -f POST :3000/api/games/dummy/tasks/4/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/6/move
http -f POST :3000/api/games/dummy/tasks/7/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='12'
#design
http -f POST :3000/api/games/dummy/tasks/4/move
http -f POST :3000/api/games/dummy/tasks/5/move
#dev
http -f POST :3000/api/games/dummy/tasks/1/move
http -f POST :3000/api/games/dummy/tasks/2/move
#qa
http -f POST :3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/7/move
http -f POST :3000/api/games/dummy/tasks/8/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='13'
#design
http -f POST :3000/api/games/dummy/tasks/5/move
http -f POST :3000/api/games/dummy/tasks/6/move
#qa
http -f POST :3000/api/games/dummy/tasks/1/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/8/move
http -f POST :3000/api/games/dummy/tasks/9/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='14'
#design
http -f POST :3000/api/games/dummy/tasks/6/move
http -f POST :3000/api/games/dummy/tasks/7/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/9/move
http -f POST :3000/api/games/dummy/tasks/10/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='15'
#design
http -f POST :3000/api/games/dummy/tasks/7/move
http -f POST :3000/api/games/dummy/tasks/8/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/10/move
http -f POST :3000/api/games/dummy/tasks/11/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='16'
#design
http -f POST :3000/api/games/dummy/tasks/8/move
http -f POST :3000/api/games/dummy/tasks/9/move
#dev
http -f POST :3000/api/games/dummy/tasks/2/move
http -f POST :3000/api/games/dummy/tasks/3/move
#qa
http -f POST :3000/api/games/dummy/tasks/2/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/11/move
http -f POST :3000/api/games/dummy/tasks/12/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='17'
#design
http -f POST :3000/api/games/dummy/tasks/9/move
http -f POST :3000/api/games/dummy/tasks/10/move
#qa
http -f POST :3000/api/games/dummy/tasks/2/move

sleep 1
#analyst
http -f POST :3000/api/games/dummy/tasks/12/move
http -f POST :3000/api/games/dummy/tasks/13/move
#po
http -f POST :3000/api/games/dummy/tasks taskId='18'
#design
http -f POST :3000/api/games/dummy/tasks/10/move
http -f POST :3000/api/games/dummy/tasks/11/move

sleep 1
#design
http -f POST :3000/api/games/dummy/tasks/11/move
http -f POST :3000/api/games/dummy/tasks/12/move
#dev
http -f POST :3000/api/games/dummy/tasks/3/move
http -f POST :3000/api/games/dummy/tasks/4/move
#qa
http -f POST :3000/api/games/dummy/tasks/3/move

sleep 1
#design
http -f POST :3000/api/games/dummy/tasks/12/reject
