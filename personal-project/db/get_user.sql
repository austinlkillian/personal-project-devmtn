select *
from game_users
where username= $1 AND password= $2;
