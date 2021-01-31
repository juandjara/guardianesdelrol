CREATE or replace FUNCTION full_posts(games)
RETURNS jsonb[] AS $$

SELECT array_agg(jsonb_build_object(
    'id', id,
    'name', name,
    'slug', slug,
    'image', image,
    'guest_players', guest_players,
    'guest_narrator', guest_narrator,
    'narrator', (
        SELECT jsonb_build_object(
            'id', u.id,
            'display_name', display_name,
            'email', email,
            'avatar_type', avatar_type
        ) FROM users u WHERE u.id = p.narrator
    ),
    'players', (
        SELECT array_agg(jsonb_build_object(
            'id', u.id,
            'display_name', display_name,
            'email', email,
            'avatar_type', avatar_type
        )) FROM users u
        JOIN players pp
        ON pp.post_id = p.id and pp.user_id = u.id
    )
))
FROM posts p
WHERE p.game = $1.id

$$ LANGUAGE SQL;