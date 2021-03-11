CREATE OR REPLACE FUNCTION update_players(postid bigint, players uuid[])
RETURNS void AS $$
  DECLARE
    player uuid;
  BEGIN
    DELETE FROM players WHERE post_id = postid;
    FOREACH player IN ARRAY players
    LOOP
      INSERT INTO players (user_id, post_id) VALUES (player, postid);
    END LOOP;
  END
$$ LANGUAGE plpgsql;