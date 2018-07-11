update game_users
set current_unicorn = $1
where id = $2;
