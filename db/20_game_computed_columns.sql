-- used just for sorting
CREATE or replace FUNCTION post_count(games)
RETURNS bigint AS $$
    SELECT COUNT(*) FROM posts p WHERE p.game = $1.id
$$ LANGUAGE SQL;
