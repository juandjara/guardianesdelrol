ALTER DATABASE postgres SET default_text_search_config = 'spanish';

DROP INDEX posts_name_idx;
CREATE INDEX posts_name_idx on posts USING to_tsvector(name);

DROP INDEX games_name_idx;
CREATE INDEX games_name_idx on games USING to_tsvector(name);

ALTER TEXT SEARCH CONFIGURATION spanish
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent;
