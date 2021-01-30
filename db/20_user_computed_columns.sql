CREATE or replace FUNCTION is_narrator(users)
RETURNS boolean AS $$
  SELECT exists(
    SELECT id FROM posts where narrator = $1.id
  )
$$ LANGUAGE SQL;