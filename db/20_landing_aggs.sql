CREATE OR REPLACE FUNCTION get_landing_aggs()
  RETURNS jsonb AS
$$
  DECLARE
    n_games int;
    n_posts int;
    n_dm_users int;
  BEGIN
    SELECT count(id)
    INTO n_games
    FROM games;

    SELECT count(id)
    INTO n_posts
    FROM posts;

    SELECT count(distinct narrator_id)
    INTO n_dm_users
    FROM posts;

    return jsonb_build_object(
      'games', n_games,
      'posts', n_posts,
      'dms', n_dm_users
    );
  END;
$$ language plpgsql;