--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-1.pgdg18.04+1)
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: moddatetime; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;


--
-- Name: EXTENSION moddatetime; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION moddatetime IS 'functions for tracking last modification time';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: post_type__; Type: TYPE; Schema: public; Owner: supabase_admin
--

CREATE TYPE public.post_type__ AS ENUM (
    'presential',
    'online',
    'presencial'
);


ALTER TYPE public.post_type__ OWNER TO supabase_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type text,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	users uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		current_setting('request.jwt.claim.email', true),
		(current_setting('request.jwt.claims', true)::jsonb ->> 'email')
	)::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		current_setting('request.jwt.claim.role', true),
		(current_setting('request.jwt.claims', true)::jsonb ->> 'role')
	)::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select
  nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: notify_api_restart(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.notify_api_restart() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
     BEGIN
       NOTIFY ddl_command_end;
     END;
     $$;


ALTER FUNCTION extensions.notify_api_restart() OWNER TO postgres;

--
-- Name: FUNCTION notify_api_restart(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.notify_api_restart() IS 'Sends a notification to the API to restart. If your database schema has changed, this is required so that Supabase can rebuild the relationships.';


--
-- Name: edit_role(uuid, text); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.edit_role(uuid uuid, new_role text) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    updated_role text;
  BEGIN
    UPDATE auth.users
    SET role = new_role
    WHERE id = uuid;

    SELECT role INTO updated_role
    FROM auth.users WHERE id = uuid;

    RETURN updated_role;
  END;
$$;


ALTER FUNCTION public.edit_role(uuid uuid, new_role text) OWNER TO supabase_admin;

--
-- Name: get_landing_aggs(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.get_landing_aggs() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.get_landing_aggs() OWNER TO supabase_admin;

--
-- Name: handle_delete_user(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.handle_delete_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  DELETE FROM public.users WHERE OLD.id = id;
END;
$$;


ALTER FUNCTION public.handle_delete_user() OWNER TO supabase_admin;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email, name, role)
  values (
    NEW.id,
    md5(NEW.email),
    (regexp_split_to_array(NEW.email, '@'))[1],
    NEW.role
  )
  on CONFLICT do NOTHING;
  return NEW;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO supabase_admin;

--
-- Name: handle_user_update(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.handle_user_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  update public.users 
  set last_sign_in_at = NEW.last_sign_in_at,
      email = md5(NEW.email),
      role = NEW.role
  where id = NEW.id;
  return NEW;
END;
$$;


ALTER FUNCTION public.handle_user_update() OWNER TO supabase_admin;

--
-- Name: slugify(text); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.slugify(value text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- remove single and double quotes
  "removed_quotes" AS (
    SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- transform '&' to 'n'
  "transform_and_symbol" AS (
    SELECT regexp_replace("value", '&+', 'n', 'gi') AS "value"
    FROM "removed_quotes"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
    FROM "transform_and_symbol"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') AS "value"
    FROM "hyphenated"
  )
  SELECT "value" FROM "trimmed";
$_$;


ALTER FUNCTION public.slugify(value text) OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.posts (
    id bigint NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    slug text GENERATED ALWAYS AS (public.slugify(name)) STORED,
    description text,
    tags text[] NOT NULL,
    seats integer,
    section integer,
    date date NOT NULL,
    place text,
    place_link text,
    image character varying,
    game integer,
    narrator_id uuid,
    "time" character varying,
    image_position character varying,
    is_draft boolean DEFAULT false NOT NULL,
    dates_with_labels jsonb[] DEFAULT '{}'::jsonb[] NOT NULL
);


ALTER TABLE public.posts OWNER TO supabase_admin;

--
-- Name: has_free_seats(public.posts); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.has_free_seats(public.posts) RETURNS boolean
    LANGUAGE sql
    AS $_$
  SELECT seats > coalesce(array_length(players(p.*), 1), 0) FROM posts p where id = $1.id
$_$;


ALTER FUNCTION public.has_free_seats(public.posts) OWNER TO supabase_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    challengeable boolean DEFAULT false NOT NULL,
    bio text,
    last_sign_in_at timestamp without time zone,
    role character varying DEFAULT 'authenticated'::character varying NOT NULL,
    avatar character varying
);


ALTER TABLE public.users OWNER TO supabase_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.users IS 'User profile table';


--
-- Name: COLUMN users.challengeable; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.users.challengeable IS 'Available for challange';


--
-- Name: is_narrator(public.users); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.is_narrator(public.users) RETURNS boolean
    LANGUAGE sql
    AS $_$
  SELECT exists(
    SELECT id FROM posts where narrator_id = $1.id
  )
$_$;


ALTER FUNCTION public.is_narrator(public.users) OWNER TO supabase_admin;

--
-- Name: narrator(public.posts); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.narrator(public.posts) RETURNS jsonb
    LANGUAGE sql
    AS $_$
    select jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'avatar', u.avatar
    )
    from posts p
    left join users u on u.id = p.narrator_id
    where p.id = $1.id
$_$;


ALTER FUNCTION public.narrator(public.posts) OWNER TO supabase_admin;

--
-- Name: players(public.posts); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.players(public.posts) RETURNS jsonb[]
    LANGUAGE sql
    AS $_$

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

$_$;


ALTER FUNCTION public.players(public.posts) OWNER TO supabase_admin;

--
-- Name: games; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.games (
    id bigint NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    slug text GENERATED ALWAYS AS (public.slugify(name)) STORED,
    description text,
    tags text[] DEFAULT '{}'::text[],
    image_position real,
    image character varying
);


ALTER TABLE public.games OWNER TO supabase_admin;

--
-- Name: post_count(public.games); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.post_count(public.games) RETURNS bigint
    LANGUAGE sql
    AS $_$
    SELECT COUNT(*) FROM posts p WHERE p.game = $1.id
$_$;


ALTER FUNCTION public.post_count(public.games) OWNER TO supabase_admin;

--
-- Name: posts_from_user(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.posts_from_user(userid uuid) RETURNS jsonb[]
    LANGUAGE sql
    AS $$
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
$$;


ALTER FUNCTION public.posts_from_user(userid uuid) OWNER TO postgres;

--
-- Name: update_players(bigint, uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_players(postid bigint, players uuid[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
  DECLARE
    player uuid;
  BEGIN
    DELETE FROM players WHERE post_id = postid;
    FOREACH player IN ARRAY players
    LOOP
      INSERT INTO players (user_id, post_id) VALUES (player, postid);
    END LOOP;
  END
$$;


ALTER FUNCTION public.update_players(postid bigint, players uuid[]) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
    declare
      -- Regclass of the table e.g. public.notes
      entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

      -- I, U, D, T: insert, update ...
      action realtime.action = (
        case wal ->> 'action'
          when 'I' then 'INSERT'
          when 'U' then 'UPDATE'
          when 'D' then 'DELETE'
          when 'T' then 'TRUNCATE'
          else 'ERROR'
        end
      );

      -- Is row level security enabled for the table
      is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

      -- Subscription vars
      user_id uuid;
      email varchar(255);
      user_has_access bool;
      is_visible_to_user boolean;
      visible_to_user_ids uuid[] = '{}';

      -- user subscriptions to the wal record's table
      subscriptions realtime.subscription[] =
        array_agg(sub)
        from
          realtime.subscription sub
        where
          sub.entity = entity_;

      -- structured info for wal's columns
      columns realtime.wal_column[] =
        array_agg(
          (
            x->>'name',
            x->>'type',
            realtime.cast((x->'value') #>> '{}', (x->>'type')::regtype),
            (pks ->> 'name') is not null,
            pg_catalog.has_column_privilege('authenticated', entity_, x->>'name', 'SELECT')
          )::realtime.wal_column
        )
        from
          jsonb_array_elements(wal -> 'columns') x
          left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

      -- previous identity values for update/delete
      old_columns realtime.wal_column[] =
        array_agg(
          (
            x->>'name',
            x->>'type',
            realtime.cast((x->'value') #>> '{}', (x->>'type')::regtype),
            (pks ->> 'name') is not null,
            pg_catalog.has_column_privilege('authenticated', entity_, x->>'name', 'SELECT')
          )::realtime.wal_column
        )
        from
          jsonb_array_elements(wal -> 'identity') x
          left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

      output jsonb;

      -- Error states
      error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;
      error_unauthorized boolean = not pg_catalog.has_any_column_privilege('authenticated', entity_, 'SELECT');

      errors text[] = case
        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
        else '{}'::text[]
      end;
    begin

      -- The 'authenticated' user does not have SELECT permission on any of the columns for the entity_
      if error_unauthorized is true then
        return (
          null,
          null,
          visible_to_user_ids,
          array['Error 401: Unauthorized']
        )::realtime.wal_rls;
      end if;

      -------------------------------
      -- Build Output JSONB Object --
      -------------------------------
      output = jsonb_build_object(
        'schema', wal ->> 'schema',
        'table', wal ->> 'table',
        'type', action,
        'commit_timestamp', (wal ->> 'timestamp')::text::timestamp with time zone,
        'columns', (
          select
            jsonb_agg(
              jsonb_build_object(
                'name', pa.attname,
                'type', pt.typname
              )
              order by pa.attnum asc
            )
            from
              pg_attribute pa
              join pg_type pt
                on pa.atttypid = pt.oid
            where
              attrelid = entity_
              and attnum > 0
              and pg_catalog.has_column_privilege('authenticated', entity_, pa.attname, 'SELECT')
        )
      )
      -- Add "record" key for insert and update
      || case
        when error_record_exceeds_max_size then jsonb_build_object('record', '{}'::jsonb)
        when action in ('INSERT', 'UPDATE') then
          jsonb_build_object(
            'record',
            (select jsonb_object_agg((c).name, (c).value) from unnest(columns) c where (c).is_selectable)
          )
        else '{}'::jsonb
      end
      -- Add "old_record" key for update and delete
      || case
        when error_record_exceeds_max_size then jsonb_build_object('old_record', '{}'::jsonb)
        when action in ('UPDATE', 'DELETE') then
          jsonb_build_object(
            'old_record',
            (select jsonb_object_agg((c).name, (c).value) from unnest(old_columns) c where (c).is_selectable)
          )
        else '{}'::jsonb
      end;

      if action in ('TRUNCATE', 'DELETE') then
        visible_to_user_ids = array_agg(s.user_id) from unnest(subscriptions) s;
      else
        -- If RLS is on and someone is subscribed to the table prep
        if is_rls_enabled and array_length(subscriptions, 1) > 0 then
          perform set_config('role', 'authenticated', true);
          if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
            deallocate walrus_rls_stmt;
          end if;
          execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);

        end if;

        -- For each subscribed user
        for user_id, email, is_visible_to_user in (
          select
            subs.user_id,
            subs.email,
            realtime.is_visible_through_filters(columns, subs.filters)
          from
            unnest(subscriptions) subs
        )
        loop
          if is_visible_to_user then
            -- If RLS is off, add to visible users
            if not is_rls_enabled then
              visible_to_user_ids = visible_to_user_ids || user_id;
            else
              -- Check if RLS allows the user to see the record
              perform
                set_config(
                  'request.jwt.claims',
                  jsonb_build_object(
                    'sub', user_id::text,
                    'email', email::text,
                    'role', 'authenticated'
                  )::text,
                  true
                );
              execute 'execute walrus_rls_stmt' into user_has_access;

              if user_has_access then
                visible_to_user_ids = visible_to_user_ids || user_id;
              end if;

              end if;
            end if;
        end loop;

        perform (
          set_config('role', null, true)
        );

    end if;

    return (
      output,
      is_rls_enabled,
      visible_to_user_ids,
      errors
    )::realtime.wal_rls;
  end;
  $$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
    /*
    Builds a sql string that, if executed, creates a prepared statement to
    tests retrive a row from *entity* by its primary key columns.

    Example
      select realtime.build_prepared_statment_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
    */
      select
    'prepare ' || prepared_statement_name || ' as
      select
        exists(
          select
            1
          from
            ' || entity || '
          where
            ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
        )'
      from
        unnest(columns) pkc
      where
        pkc.is_pkey
      group by
        entity
    $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    /*
    Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
    */
    declare
      op_symbol text = (
        case
          when op = 'eq' then '='
          when op = 'neq' then '!='
          when op = 'lt' then '<'
          when op = 'lte' then '<='
          when op = 'gt' then '>'
          when op = 'gte' then '>='
          else 'UNKNOWN OP'
        end
      );
      res boolean;
    begin
      execute format('select %L::'|| type_::text || ' ' || op_symbol || ' %L::'|| type_::text, val_1, val_2) into res;
      return res;
    end;
    $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
    select
      -- Default to allowed when no filters present
      coalesce(
        sum(
          realtime.check_equality_op(
            op:=f.op,
            type_:=col.type::regtype,
            -- cast jsonb to text
            val_1:=col.value #>> '{}',
            val_2:=f.value
          )::int
        ) = count(1),
        true
      )
    from
      unnest(filters) f
      join unnest(columns) col
          on f.column_name = col.name;
    $$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that 'authenticated' may access
    - values are coercable to the correct column type
    */
    declare
      col_names text[] = coalesce(
        array_agg(c.column_name order by c.ordinal_position),
        '{}'::text[]
      )
        from
          information_schema.columns c
        where
          (quote_ident(c.table_schema) || '.' || quote_ident(c.table_name))::regclass = new.entity
          and pg_catalog.has_column_privilege('authenticated', new.entity, c.column_name, 'SELECT');
      filter realtime.user_defined_filter;
      col_type regtype;
    begin
      for filter in select * from unnest(new.filters) loop
        -- Filtered column is valid
        if not filter.column_name = any(col_names) then
          raise exception 'invalid column for filter %', filter.column_name;
        end if;

        -- Type is sanitized and safe for string interpolation
        col_type = (
          select atttypid::regtype
          from pg_catalog.pg_attribute
          where attrelid = new.entity
            and attname = filter.column_name
        );
        if col_type is null then
          raise exception 'failed to lookup type for column %', filter.column_name;
        end if;
        -- raises an exception if value is not coercable to type
        perform realtime.cast(filter.value, col_type);
      end loop;

      -- Apply consistent order to filters so the unique constraint on
      -- (user_id, entity, filters) can't be tricked by a different filter order
      new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value),
        '{}'
      ) from unnest(new.filters) f;

      return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
      DECLARE
      _parts text[];
      _filename text;
      BEGIN
        select string_to_array(name, '/') into _parts;
        select _parts[array_length(_parts,1)] into _filename;
        -- @todo return the last part instead of 2
        return split_part(_filename, '.', 2);
      END
      $$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
      DECLARE
      _parts text[];
      BEGIN
        select string_to_array(name, '/') into _parts;
        return _parts[array_length(_parts,1)];
      END
      $$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
      DECLARE
      _parts text[];
      BEGIN
        select string_to_array(name, '/') into _parts;
        return _parts[1:array_length(_parts,1)-1];
      END
      $$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
	return query 
		with files_folders as (
			select path_tokens[levels] as folder
			from storage.objects
			where objects.name ilike prefix || '%'
			and bucket_id = bucketname
			GROUP by folder
			limit limits
			offset offsets
		) 
		select files_folders.folder as name, objects.id, objects.updated_at, objects.created_at, objects.last_accessed_at, objects.metadata from files_folders 
		left join storage.objects
		on prefix || files_folders.folder = objects.name and objects.bucket_id=bucketname;
END
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(15) DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(15) DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.games ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: guest_players; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.guest_players (
    id bigint NOT NULL,
    inserted_at timestamp with time zone,
    post_id integer,
    name character varying NOT NULL
);


ALTER TABLE public.guest_players OWNER TO supabase_admin;

--
-- Name: TABLE guest_players; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.guest_players IS 'This is a duplicate copy of players';


--
-- Name: guest_players_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.guest_players ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.guest_players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: players; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.players (
    id bigint NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid,
    post_id integer
);


ALTER TABLE public.players OWNER TO supabase_admin;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.players ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.posts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sections; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.sections (
    id bigint NOT NULL,
    inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    description text,
    image character varying,
    image_position real
);


ALTER TABLE public.sections OWNER TO supabase_admin;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.sections ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.sections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    email character varying(255),
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (provider, id);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: guest_players guest_players_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.guest_players
    ADD CONSTRAINT guest_players_pkey PRIMARY KEY (id);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: subscription subscription_entity_user_id_filters_key; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT subscription_entity_user_id_filters_key UNIQUE (entity, user_id, filters);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, email);


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING hash (entity);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: users on_auth_user_deleted; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_deleted BEFORE DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user();


--
-- Name: users on_auth_user_updated; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_updated BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();


--
-- Name: games handle_updated_at; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');


--
-- Name: posts handle_updated_at; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_parent_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_parent_fkey FOREIGN KEY (parent) REFERENCES auth.refresh_tokens(token);


--
-- Name: players players_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: players players_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: posts posts_game_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_game_fkey FOREIGN KEY (game) REFERENCES public.games(id);


--
-- Name: posts posts_narrator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_narrator_fkey FOREIGN KEY (narrator_id) REFERENCES public.users(id);


--
-- Name: posts posts_section_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_section_fkey FOREIGN KEY (section) REFERENCES public.sections(id);


--
-- Name: buckets buckets_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: objects objects_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_policy; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY users_policy ON public.users USING ((auth.role() = ANY (ARRAY['anon'::text, 'superadmin'::text, 'admin'::text, 'authenticated'::text]))) WITH CHECK (((auth.uid() = id) OR (auth.role() = 'superadmin'::text)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime FOR ALL TABLES WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO superadmin;
GRANT ALL ON SCHEMA auth TO dashboard_user;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO superadmin;
GRANT USAGE ON SCHEMA public TO admin;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO authenticated;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION gtrgm_in(cstring); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_in(cstring) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_out(extensions.gtrgm); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_out(extensions.gtrgm) TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) TO dashboard_user;


--
-- Name: FUNCTION gin_extract_value_trgm(text, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_extract_value_trgm(text, internal) TO dashboard_user;


--
-- Name: FUNCTION gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal) TO dashboard_user;


--
-- Name: FUNCTION gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_compress(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_compress(internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_consistent(internal, text, smallint, oid, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_consistent(internal, text, smallint, oid, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_decompress(internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_decompress(internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_distance(internal, text, smallint, oid, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_distance(internal, text, smallint, oid, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_penalty(internal, internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_penalty(internal, internal, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_picksplit(internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_picksplit(internal, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_same(extensions.gtrgm, extensions.gtrgm, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_same(extensions.gtrgm, extensions.gtrgm, internal) TO dashboard_user;


--
-- Name: FUNCTION gtrgm_union(internal, internal); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gtrgm_union(internal, internal) TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION moddatetime(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.moddatetime() TO dashboard_user;


--
-- Name: FUNCTION notify_api_restart(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.notify_api_restart() TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT queryid bigint, OUT query text, OUT calls bigint, OUT total_time double precision, OUT min_time double precision, OUT max_time double precision, OUT mean_time double precision, OUT stddev_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT queryid bigint, OUT query text, OUT calls bigint, OUT total_time double precision, OUT min_time double precision, OUT max_time double precision, OUT mean_time double precision, OUT stddev_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION set_limit(real); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_limit(real) TO dashboard_user;


--
-- Name: FUNCTION show_limit(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.show_limit() TO dashboard_user;


--
-- Name: FUNCTION show_trgm(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.show_trgm(text) TO dashboard_user;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION similarity(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.similarity(text, text) TO dashboard_user;


--
-- Name: FUNCTION similarity_dist(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.similarity_dist(text, text) TO dashboard_user;


--
-- Name: FUNCTION similarity_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.similarity_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION strict_word_similarity(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strict_word_similarity(text, text) TO dashboard_user;


--
-- Name: FUNCTION strict_word_similarity_commutator_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strict_word_similarity_commutator_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION strict_word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strict_word_similarity_dist_commutator_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION strict_word_similarity_dist_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strict_word_similarity_dist_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION strict_word_similarity_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.strict_word_similarity_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION word_similarity(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.word_similarity(text, text) TO dashboard_user;


--
-- Name: FUNCTION word_similarity_commutator_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.word_similarity_commutator_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION word_similarity_dist_commutator_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.word_similarity_dist_commutator_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION word_similarity_dist_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.word_similarity_dist_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION word_similarity_op(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.word_similarity_op(text, text) TO dashboard_user;


--
-- Name: FUNCTION edit_role(uuid uuid, new_role text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.edit_role(uuid uuid, new_role text) TO postgres;
GRANT ALL ON FUNCTION public.edit_role(uuid uuid, new_role text) TO anon;
GRANT ALL ON FUNCTION public.edit_role(uuid uuid, new_role text) TO authenticated;
GRANT ALL ON FUNCTION public.edit_role(uuid uuid, new_role text) TO service_role;


--
-- Name: FUNCTION get_landing_aggs(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.get_landing_aggs() TO postgres;
GRANT ALL ON FUNCTION public.get_landing_aggs() TO anon;
GRANT ALL ON FUNCTION public.get_landing_aggs() TO authenticated;
GRANT ALL ON FUNCTION public.get_landing_aggs() TO service_role;


--
-- Name: FUNCTION handle_delete_user(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.handle_delete_user() TO postgres;
GRANT ALL ON FUNCTION public.handle_delete_user() TO anon;
GRANT ALL ON FUNCTION public.handle_delete_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_delete_user() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.handle_new_user() TO postgres;
GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION handle_user_update(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.handle_user_update() TO postgres;
GRANT ALL ON FUNCTION public.handle_user_update() TO anon;
GRANT ALL ON FUNCTION public.handle_user_update() TO authenticated;
GRANT ALL ON FUNCTION public.handle_user_update() TO service_role;


--
-- Name: FUNCTION slugify(value text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.slugify(value text) TO postgres;
GRANT ALL ON FUNCTION public.slugify(value text) TO anon;
GRANT ALL ON FUNCTION public.slugify(value text) TO authenticated;
GRANT ALL ON FUNCTION public.slugify(value text) TO service_role;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.posts TO postgres;
GRANT ALL ON TABLE public.posts TO anon;
GRANT ALL ON TABLE public.posts TO authenticated;
GRANT ALL ON TABLE public.posts TO service_role;
GRANT ALL ON TABLE public.posts TO superadmin;
GRANT ALL ON TABLE public.posts TO admin;


--
-- Name: FUNCTION has_free_seats(public.posts); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.has_free_seats(public.posts) TO postgres;
GRANT ALL ON FUNCTION public.has_free_seats(public.posts) TO anon;
GRANT ALL ON FUNCTION public.has_free_seats(public.posts) TO authenticated;
GRANT ALL ON FUNCTION public.has_free_seats(public.posts) TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;
GRANT ALL ON TABLE public.users TO superadmin;
GRANT ALL ON TABLE public.users TO admin;


--
-- Name: FUNCTION is_narrator(public.users); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.is_narrator(public.users) TO postgres;
GRANT ALL ON FUNCTION public.is_narrator(public.users) TO anon;
GRANT ALL ON FUNCTION public.is_narrator(public.users) TO authenticated;
GRANT ALL ON FUNCTION public.is_narrator(public.users) TO service_role;


--
-- Name: FUNCTION narrator(public.posts); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.narrator(public.posts) TO postgres;
GRANT ALL ON FUNCTION public.narrator(public.posts) TO anon;
GRANT ALL ON FUNCTION public.narrator(public.posts) TO authenticated;
GRANT ALL ON FUNCTION public.narrator(public.posts) TO service_role;


--
-- Name: FUNCTION players(public.posts); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.players(public.posts) TO postgres;
GRANT ALL ON FUNCTION public.players(public.posts) TO anon;
GRANT ALL ON FUNCTION public.players(public.posts) TO authenticated;
GRANT ALL ON FUNCTION public.players(public.posts) TO service_role;


--
-- Name: TABLE games; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.games TO postgres;
GRANT ALL ON TABLE public.games TO anon;
GRANT ALL ON TABLE public.games TO authenticated;
GRANT ALL ON TABLE public.games TO service_role;
GRANT ALL ON TABLE public.games TO superadmin;
GRANT ALL ON TABLE public.games TO admin;


--
-- Name: FUNCTION post_count(public.games); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.post_count(public.games) TO postgres;
GRANT ALL ON FUNCTION public.post_count(public.games) TO anon;
GRANT ALL ON FUNCTION public.post_count(public.games) TO authenticated;
GRANT ALL ON FUNCTION public.post_count(public.games) TO service_role;


--
-- Name: FUNCTION posts_from_user(userid uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.posts_from_user(userid uuid) TO anon;
GRANT ALL ON FUNCTION public.posts_from_user(userid uuid) TO authenticated;
GRANT ALL ON FUNCTION public.posts_from_user(userid uuid) TO service_role;


--
-- Name: FUNCTION unaccent(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent(text) TO postgres;
GRANT ALL ON FUNCTION public.unaccent(text) TO anon;
GRANT ALL ON FUNCTION public.unaccent(text) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent(text) TO service_role;


--
-- Name: FUNCTION unaccent(regdictionary, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO postgres;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO anon;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent(regdictionary, text) TO service_role;


--
-- Name: FUNCTION unaccent_init(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent_init(internal) TO postgres;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO anon;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent_init(internal) TO service_role;


--
-- Name: FUNCTION unaccent_lexize(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.unaccent_lexize(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION update_players(postid bigint, players uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_players(postid bigint, players uuid[]) TO anon;
GRANT ALL ON FUNCTION public.update_players(postid bigint, players uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.update_players(postid bigint, players uuid[]) TO service_role;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;
GRANT ALL ON FUNCTION storage.extension(name text) TO anon;
GRANT ALL ON FUNCTION storage.extension(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.extension(name text) TO service_role;
GRANT ALL ON FUNCTION storage.extension(name text) TO dashboard_user;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;
GRANT ALL ON FUNCTION storage.filename(name text) TO anon;
GRANT ALL ON FUNCTION storage.filename(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.filename(name text) TO service_role;
GRANT ALL ON FUNCTION storage.filename(name text) TO dashboard_user;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;
GRANT ALL ON FUNCTION storage.foldername(name text) TO anon;
GRANT ALL ON FUNCTION storage.foldername(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.foldername(name text) TO service_role;
GRANT ALL ON FUNCTION storage.foldername(name text) TO dashboard_user;


--
-- Name: FUNCTION get_size_by_bucket(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.get_size_by_bucket() TO dashboard_user;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO postgres;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO anon;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO authenticated;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO service_role;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO dashboard_user;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO postgres;
GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO postgres;
GRANT ALL ON TABLE auth.instances TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO postgres;
GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO postgres;
GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,UPDATE ON TABLE auth.users TO superadmin;
GRANT ALL ON TABLE auth.users TO postgres;
GRANT ALL ON TABLE auth.users TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: SEQUENCE games_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.games_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.games_id_seq TO anon;
GRANT ALL ON SEQUENCE public.games_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.games_id_seq TO service_role;
GRANT ALL ON SEQUENCE public.games_id_seq TO superadmin;
GRANT ALL ON SEQUENCE public.games_id_seq TO admin;


--
-- Name: TABLE guest_players; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.guest_players TO postgres;
GRANT ALL ON TABLE public.guest_players TO anon;
GRANT ALL ON TABLE public.guest_players TO authenticated;
GRANT ALL ON TABLE public.guest_players TO service_role;
GRANT ALL ON TABLE public.guest_players TO superadmin;
GRANT ALL ON TABLE public.guest_players TO admin;


--
-- Name: SEQUENCE guest_players_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.guest_players_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.guest_players_id_seq TO anon;
GRANT ALL ON SEQUENCE public.guest_players_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.guest_players_id_seq TO service_role;


--
-- Name: TABLE players; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.players TO postgres;
GRANT ALL ON TABLE public.players TO anon;
GRANT ALL ON TABLE public.players TO authenticated;
GRANT ALL ON TABLE public.players TO service_role;
GRANT ALL ON TABLE public.players TO superadmin;
GRANT ALL ON TABLE public.players TO admin;


--
-- Name: SEQUENCE players_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.players_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.players_id_seq TO anon;
GRANT ALL ON SEQUENCE public.players_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.players_id_seq TO service_role;
GRANT ALL ON SEQUENCE public.players_id_seq TO superadmin;
GRANT ALL ON SEQUENCE public.players_id_seq TO admin;


--
-- Name: SEQUENCE posts_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.posts_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.posts_id_seq TO anon;
GRANT ALL ON SEQUENCE public.posts_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.posts_id_seq TO service_role;
GRANT ALL ON SEQUENCE public.posts_id_seq TO superadmin;
GRANT ALL ON SEQUENCE public.posts_id_seq TO admin;


--
-- Name: TABLE sections; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.sections TO postgres;
GRANT ALL ON TABLE public.sections TO anon;
GRANT ALL ON TABLE public.sections TO authenticated;
GRANT ALL ON TABLE public.sections TO service_role;
GRANT ALL ON TABLE public.sections TO superadmin;
GRANT ALL ON TABLE public.sections TO admin;


--
-- Name: SEQUENCE sections_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.sections_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.sections_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sections_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sections_id_seq TO service_role;
GRANT ALL ON SEQUENCE public.sections_id_seq TO superadmin;
GRANT ALL ON SEQUENCE public.sections_id_seq TO admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO postgres;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO postgres;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: api_restart; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER api_restart ON ddl_command_end
   EXECUTE FUNCTION extensions.notify_api_restart();


ALTER EVENT TRIGGER api_restart OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

