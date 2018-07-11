select unicorns.id, unicorns.file_name, unicorns.name, unicorns.user_id
from unicorns
inner join game_users
on unicorns.user_id = game_users.id
where unicorns.user_id = $1;
