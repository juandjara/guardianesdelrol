CREATE OR REPLACE FUNCTION narrator(posts)
RETURNS jsonb AS $$
    select
        jsonb_build_object(
            'id', coalesce(u.id::text, concat('anon-dm-', slugify(p.guest_narrator))),
            'display_name', coalesce(u.display_name, p.guest_narrator),
            'email', u.email,
            'avatar', u.avatar,
            'anon', (p.narrator_id is null)
        )
    from posts p
    left join users u on u.id = p.narrator_id
    where p.id = $1.id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION players(posts)
RETURNS jsonb[] AS $$

select COALESCE(array_agg(q.jsonb_build_object), ARRAY[]::jsonb[]) 
from (
    select
    jsonb_build_object(
        'id', u.id::text,
        'email', u.email,
        'display_name', u.display_name,
        'avatar', u.avatar,
        'anon', false
    )
    from posts p
    join players up on up.post_id = p.id
    join users u on u.id = up.user_id
    where p.id = $1.id

    union all

    select
    jsonb_build_object(
        'id', concat('anon-player-', slugify(gp.name)),
        'email', null,
        'display_name', gp.name,
        'avatar', null,
        'anon', true
    )
    from posts p
    join guest_players gp on gp.post_id = p.id
    where p.id = $1.id
) q

$$ LANGUAGE SQL;

CREATE or replace FUNCTION has_free_seats(posts)
RETURNS boolean AS $$
  SELECT seats > coalesce(array_length(players(p.*), 1), 0) FROM posts where id = $1.id
$$ LANGUAGE SQL;
