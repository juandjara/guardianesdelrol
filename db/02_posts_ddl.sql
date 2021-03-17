CREATE TABLE posts (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text not null,
  slug text generated always as (slugify(name)) stored,
  description text,
  tags text[] NOT NULL,
  seats int,
  section int REFERENCES sections(id),
  date date,
  time varchar,
  place text,
  place_link text,
  image varchar,
  image_position varchar,
  game int REFERENCES games(id)
  narrator_id uuid REFERENCES users(id)
);

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- this trigger will set the "updated_at" column to the current timestamp for every update
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
