DROP FUNCTION posts_from_user(userid uuid);

CREATE OR REPLACE FUNCTION posts_from_user(userid uuid)
RETURNS jsonb[] AS $$
  SELECT COALESCE(array_agg(q.jsonb_build_object), ARRAY[]::jsonb[])
  FROM (
    SELECT jsonb_build_object(
      'id', p.id,
      'name', name,
      'slug', slug,
      'tags', tags,
      'seats', seats,
      'date', date,
      'time', time,
      'type', type,
      'image', image,
      'place', place,
      'place_link', place_link,
      'game', (SELECT jsonb_build_object('id', id, 'name', name, 'slug', slug) FROM games g WHERE g.id = p.game),
      'section', (SELECT jsonb_build_object('id', id, 'name', name) FROM sections s WHERE s.id = p.section),
      'narrator', narrator(p.*),
      'players', players(p.*)
    )
    FROM posts p
    WHERE p.narrator_id = userid
    OR p.id = ANY(select post_id from players where user_id = userid)
    ORDER BY date desc, time desc, narrator_id desc, slug desc
  ) q
$$ LANGUAGE SQL;