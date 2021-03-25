CREATE OR REPLACE FUNCTION narrator(posts)
RETURNS jsonb AS $$
    select jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'avatar', u.avatar
    )
    from posts p
    left join users u on u.id = p.narrator_id
    where p.id = $1.id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION players(posts)
RETURNS jsonb[] AS $$

select COALESCE(array_agg(q.jsonb_build_object), ARRAY[]::jsonb[]) 
from (
    select jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'avatar', u.avatar
    )
    from posts p
    join players up on up.post_id = p.id
    join users u on u.id = up.user_id
    where p.id = $1.id
) q

$$ LANGUAGE SQL;

CREATE or replace FUNCTION has_free_seats(posts)
RETURNS boolean AS $$
  SELECT seats > coalesce(array_length(players(p.*), 1), 0) FROM posts p where id = $1.id
$$ LANGUAGE SQL;
