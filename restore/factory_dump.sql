--
-- PostgreSQL database dump
--

\restrict 4D0mNVeRbgsUv0QKh2B3WoI0Ei9zn9SjH4UTosHIlncqnyVRj82d0d6o25cZ3To

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

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
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

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
    'gte',
    'in'
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
	type_name text,
	type_oid oid,
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
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, last_seen)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Novo Usuário'),
    new.email,
    now()
  )
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email; -- Atualiza email se já existir o perfil
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: increment_user_metrics(uuid, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_sessions = total_sessions + 1,
    total_minutes_active = total_minutes_active + inc_minutes,
    last_seen = NOW()
  WHERE id = user_id;
END;
$$;


ALTER FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision) OWNER TO postgres;

--
-- Name: increment_user_metrics(uuid, double precision, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer DEFAULT 0) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    total_sessions = total_sessions + 1,
    total_minutes_active = total_minutes_active + inc_minutes,
    daily_minutes_used = daily_minutes_used + CAST(inc_minutes AS INTEGER), -- Increment daily usage
    total_words_spoken = total_words_spoken + inc_words,
    last_seen = NOW()
  WHERE id = user_id;
END;
$$;


ALTER FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer) OWNER TO postgres;

--
-- Name: is_super_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_super_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_system_admin = TRUE
  );
END;
$$;


ALTER FUNCTION public.is_super_admin() OWNER TO postgres;

--
-- Name: protect_profile_columns(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.protect_profile_columns() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Se for Super Admin, permitir qualquer alteração (Bypass do bloqueio)
  IF is_super_admin() THEN
    RETURN NEW;
  END IF;

  -- Se for um usuário comum (authenticated), bloquear alteração de is_premium
  IF (OLD.is_premium IS DISTINCT FROM NEW.is_premium) AND (current_setting('role', true) = 'authenticated') THEN
    NEW.is_premium := OLD.is_premium;
  END IF;

  -- Se for um usuário comum (authenticated), bloquear alteração de daily_minutes_used
  IF (OLD.daily_minutes_used IS DISTINCT FROM NEW.daily_minutes_used) AND (current_setting('role', true) = 'authenticated') THEN
     NEW.daily_minutes_used := OLD.daily_minutes_used; 
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.protect_profile_columns() OWNER TO postgres;

--
-- Name: redeem_coupon(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.redeem_coupon(p_code text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_benefit_days INTEGER;
    v_user_id UUID;
    v_current_premium_until TIMESTAMPTZ;
BEGIN
    -- Get current user ID
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Usuário não autenticado');
    END IF;

    -- Check if coupon exists and is not used
    SELECT benefit_days INTO v_benefit_days
    FROM coupons
    WHERE code = p_code AND is_used = FALSE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Cupom inválido ou já utilizado');
    END IF;

    -- Get current premium_until
    SELECT premium_until INTO v_current_premium_until
    FROM profiles
    WHERE id = v_user_id;

    -- Update profile: Set is_premium to true and extend premium_until
    -- If current premium_until is in the future, add to it. Otherwise, add from now.
    UPDATE profiles
    SET 
        is_premium = TRUE,
        premium_until = CASE 
            WHEN v_current_premium_until > NOW() THEN v_current_premium_until + (v_benefit_days || ' days')::INTERVAL
            ELSE NOW() + (v_benefit_days || ' days')::INTERVAL
        END
    WHERE id = v_user_id;

    -- Mark coupon as used
    UPDATE coupons
    SET 
        is_used = TRUE,
        used_by = v_user_id,
        used_at = NOW()
    WHERE code = p_code;

    RETURN jsonb_build_object('success', true, 'message', 'Cupom resgatado com sucesso! ' || v_benefit_days || ' dias adicionais de Premium.');
END;
$$;


ALTER FUNCTION public.redeem_coupon(p_code text) OWNER TO postgres;

--
-- Name: reset_daily_usage(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reset_daily_usage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.last_usage_reset_date IS NULL OR NEW.last_usage_reset_date < CURRENT_DATE THEN
    NEW.daily_minutes_used = 0;
    NEW.last_usage_reset_date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.reset_daily_usage() OWNER TO postgres;

--
-- Name: sync_user_usage(double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_user_usage(p_minutes double precision) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE profiles 
  SET daily_minutes_used = daily_minutes_used + p_minutes,
      last_seen = now()
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION public.sync_user_usage(p_minutes double precision) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
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
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
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
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

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
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
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
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

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
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
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
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
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

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
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
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


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
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

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
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


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
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    company_name text,
    message_type text DEFAULT 'support'::text NOT NULL,
    subject text,
    message text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    code text NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    benefit_days integer DEFAULT 7,
    used_by uuid,
    used_at timestamp with time zone,
    description text,
    discount_percentage integer DEFAULT 0,
    influencer_name text,
    max_uses integer DEFAULT 100,
    uses_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expires_at timestamp with time zone
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    current_session_id text,
    last_seen timestamp with time zone,
    full_name text,
    phone_number text,
    last_language text,
    last_level text,
    last_teacher_id text,
    last_topic_id text,
    is_premium boolean DEFAULT false,
    daily_minutes_used integer DEFAULT 0,
    last_usage_reset_date date DEFAULT CURRENT_DATE,
    is_kids_mode boolean DEFAULT false,
    streak_count integer DEFAULT 0,
    has_completed_tutorial boolean DEFAULT false,
    last_streak_at date,
    total_sessions integer DEFAULT 0,
    total_minutes_active double precision DEFAULT 0,
    total_words_spoken integer DEFAULT 0,
    premium_until timestamp with time zone,
    organization_id uuid,
    org_role text DEFAULT 'member'::text,
    email text,
    is_system_admin boolean DEFAULT false,
    CONSTRAINT profiles_org_role_check CHECK ((org_role = ANY (ARRAY['admin'::text, 'member'::text])))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: transcripts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcripts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    user_id uuid,
    role text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT transcripts_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


ALTER TABLE public.transcripts OWNER TO postgres;

--
-- Name: investor_user_metrics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.investor_user_metrics WITH (security_invoker='true') AS
 SELECT id,
    full_name,
    total_sessions,
    total_minutes_active,
    total_words_spoken,
    streak_count,
    is_premium,
    ( SELECT count(*) AS count
           FROM public.transcripts t
          WHERE (t.user_id = p.id)) AS total_messages
   FROM public.profiles p;


ALTER VIEW public.investor_user_metrics OWNER TO postgres;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    plan_type text NOT NULL,
    max_seats integer DEFAULT 5,
    created_at timestamp with time zone DEFAULT now(),
    cnpj text,
    CONSTRAINT organizations_plan_type_check CHECK ((plan_type = ANY (ARRAY['team'::text, 'business'::text, 'enterprise'::text])))
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: COLUMN organizations.cnpj; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organizations.cnpj IS 'CNPJ of the organization for B2B billing/identification';


--
-- Name: sentry_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sentry_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    language text,
    level text,
    teacher_id text,
    topic_id text,
    last_activity timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.sentry_sessions OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    teacher_id text NOT NULL,
    language text NOT NULL,
    level text NOT NULL,
    topic_id text,
    score integer,
    mistakes jsonb,
    vocabulary jsonb,
    tip text,
    continuation_context text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    topic_id text NOT NULL,
    status text DEFAULT 'locked'::text,
    score integer DEFAULT 0,
    last_played_at timestamp with time zone DEFAULT now(),
    mistakes jsonb DEFAULT '[]'::jsonb,
    vocabulary jsonb DEFAULT '[]'::jsonb,
    current_level double precision DEFAULT 1.0,
    total_minutes double precision DEFAULT 0,
    tip text,
    CONSTRAINT user_progress_status_check CHECK ((status = ANY (ARRAY['locked'::text, 'unlocked'::text, 'completed'::text])))
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_02_06; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_06 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_06 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_07; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_07 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_07 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_08; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_08 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_08 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_09; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_09 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_09 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_10; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_10 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_10 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_11; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_11 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_11 OWNER TO supabase_admin;

--
-- Name: messages_2026_02_12; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_02_12 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_02_12 OWNER TO supabase_admin;

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
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
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
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

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
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: messages_2026_02_06; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_06 FOR VALUES FROM ('2026-02-06 00:00:00') TO ('2026-02-07 00:00:00');


--
-- Name: messages_2026_02_07; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_07 FOR VALUES FROM ('2026-02-07 00:00:00') TO ('2026-02-08 00:00:00');


--
-- Name: messages_2026_02_08; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_08 FOR VALUES FROM ('2026-02-08 00:00:00') TO ('2026-02-09 00:00:00');


--
-- Name: messages_2026_02_09; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_09 FOR VALUES FROM ('2026-02-09 00:00:00') TO ('2026-02-10 00:00:00');


--
-- Name: messages_2026_02_10; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_10 FOR VALUES FROM ('2026-02-10 00:00:00') TO ('2026-02-11 00:00:00');


--
-- Name: messages_2026_02_11; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_11 FOR VALUES FROM ('2026-02-11 00:00:00') TO ('2026-02-12 00:00:00');


--
-- Name: messages_2026_02_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_02_12 FOR VALUES FROM ('2026-02-12 00:00:00') TO ('2026-02-13 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	{"sub": "8cd76ab4-52be-4d0d-a761-b5b5a1bb497f", "email": "paulofernandoautomacao@gmail.com", "email_verified": true, "phone_verified": false}	email	2025-12-25 13:48:41.405789+00	2025-12-25 13:48:41.405847+00	2025-12-25 13:48:41.405847+00	05686d92-94d5-4867-8651-d5514ed427e5
eedffd24-a324-4717-a58b-a0cf1eb12fd9	eedffd24-a324-4717-a58b-a0cf1eb12fd9	{"sub": "eedffd24-a324-4717-a58b-a0cf1eb12fd9", "email": "fviudez@gmail.com", "full_name": "isaac Viudez", "phone_number": "85999170617", "email_verified": true, "phone_verified": false}	email	2025-12-29 12:59:18.183682+00	2025-12-29 12:59:18.183763+00	2025-12-29 12:59:18.183763+00	d9f2b934-1458-4b2c-a696-b5c7210d5754
5a497355-88eb-47e4-ba3a-06490e0a9938	5a497355-88eb-47e4-ba3a-06490e0a9938	{"sub": "5a497355-88eb-47e4-ba3a-06490e0a9938", "email": "franciscolima.hotmart@gmail.com", "full_name": "Francisco Lima", "phone_number": "85994443375", "email_verified": true, "phone_verified": false}	email	2025-12-29 14:16:21.784076+00	2025-12-29 14:16:21.784145+00	2025-12-29 14:16:21.784145+00	d65c5afd-80b9-4a6e-9eab-33ff87635cce
c5f3e41c-afe0-4e0b-b617-44db745be8b1	c5f3e41c-afe0-4e0b-b617-44db745be8b1	{"sub": "c5f3e41c-afe0-4e0b-b617-44db745be8b1", "email": "juliannnavc@gmail.com", "full_name": "Juliana de Vasconcelos ", "phone_number": "85986868126", "email_verified": true, "phone_verified": false}	email	2025-12-29 15:12:30.881092+00	2025-12-29 15:12:30.881168+00	2025-12-29 15:12:30.881168+00	ebfa5c67-5cca-4187-ae00-5f11dbdab4e9
58778376-29ab-41f9-98a6-7e0b2b17ccf1	58778376-29ab-41f9-98a6-7e0b2b17ccf1	{"sub": "58778376-29ab-41f9-98a6-7e0b2b17ccf1", "email": "felipeaguiar1978@hotmail.com", "full_name": "felipe", "phone_number": "85987614881", "email_verified": true, "phone_verified": false}	email	2025-12-29 22:58:29.206779+00	2025-12-29 22:58:29.206841+00	2025-12-29 22:58:29.206841+00	18561be4-26ec-4895-9643-0c4f9e37ddcb
208740b5-696e-4593-9be2-11cbd3a3d991	208740b5-696e-4593-9be2-11cbd3a3d991	{"sub": "208740b5-696e-4593-9be2-11cbd3a3d991", "email": "paulinhoemc@gmail.com", "full_name": "Fernando Lima", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	email	2026-01-02 15:57:30.333128+00	2026-01-02 15:57:30.335012+00	2026-01-02 15:57:30.335012+00	d57e74eb-1fc9-4fd0-af65-57454f1a27e8
89f64bf0-11bb-4572-b550-5987c4592709	89f64bf0-11bb-4572-b550-5987c4592709	{"sub": "89f64bf0-11bb-4572-b550-5987c4592709", "email": "pedro_hsrg@hotmail.com", "full_name": "Pedro Henrique Sales Rodrigues ", "phone_number": "31993912743", "email_verified": true, "phone_verified": false}	email	2026-01-03 00:07:57.35956+00	2026-01-03 00:07:57.359618+00	2026-01-03 00:07:57.359618+00	3cb4f80b-634e-4aa0-93e1-e31b566b2227
532bdbae-1cef-4abf-89dd-c6bbc361c8a0	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	{"sub": "532bdbae-1cef-4abf-89dd-c6bbc361c8a0", "email": "paulofernandoimagens@gmail.com", "full_name": "Paulinho Fernando", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	email	2026-01-03 14:09:45.912613+00	2026-01-03 14:09:45.912665+00	2026-01-03 14:09:45.912665+00	da65d5a6-24eb-4493-af47-e287d49d3a92
ad54ec69-19f7-4450-b8f4-1f0c56900042	ad54ec69-19f7-4450-b8f4-1f0c56900042	{"sub": "ad54ec69-19f7-4450-b8f4-1f0c56900042", "email": "freitasbenicio121@gmail.com", "full_name": "Paulo Freitas", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	email	2026-01-03 22:50:34.516397+00	2026-01-03 22:50:34.516472+00	2026-01-03 22:50:34.516472+00	63a125e0-f3bb-43e4-8127-f215bd752348
030ff676-214e-4c7f-9445-45dd8a88c9b5	030ff676-214e-4c7f-9445-45dd8a88c9b5	{"sub": "030ff676-214e-4c7f-9445-45dd8a88c9b5", "email": "paulinhos2aman@gmail.com", "full_name": "Jose de Vasconcelos ", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	email	2026-01-03 22:55:52.032969+00	2026-01-03 22:55:52.033038+00	2026-01-03 22:55:52.033038+00	56144506-f033-4941-8820-a56b81f5849c
b5fcd18b-ab56-472c-a1bf-171af25a938e	b5fcd18b-ab56-472c-a1bf-171af25a938e	{"sub": "b5fcd18b-ab56-472c-a1bf-171af25a938e", "email": "jonatha_gouv@hotmail.com", "full_name": "Jônathas Gouveia", "phone_number": "82999151406", "email_verified": false, "phone_verified": false}	email	2026-01-03 23:40:05.333977+00	2026-01-03 23:40:05.334034+00	2026-01-03 23:40:05.334034+00	bb4a886e-5122-44e3-be06-1dcc69ad294d
bcdff724-5628-4f32-965b-47f2f6e9beb7	bcdff724-5628-4f32-965b-47f2f6e9beb7	{"sub": "bcdff724-5628-4f32-965b-47f2f6e9beb7", "email": "mapicolini@gmail.com", "full_name": "Marcelo Picolini", "phone_number": "11976283939", "email_verified": true, "phone_verified": false}	email	2026-01-03 23:42:07.894093+00	2026-01-03 23:42:07.894152+00	2026-01-03 23:42:07.894152+00	cb17ff1e-a7d0-4971-968b-eb9c86c1f0c2
0af615a6-67dd-4a8a-a51f-6d1b84dcd707	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	{"sub": "0af615a6-67dd-4a8a-a51f-6d1b84dcd707", "email": "fagner.lima.88@hotmail.com", "full_name": "Fagner lima ", "phone_number": "81997175879", "email_verified": true, "phone_verified": false}	email	2026-01-03 23:37:13.035348+00	2026-01-03 23:37:13.036565+00	2026-01-03 23:37:13.036565+00	a0a77862-f415-4bf4-bb29-08fa6085271a
7c112274-673e-4a5a-ae87-b22881970934	7c112274-673e-4a5a-ae87-b22881970934	{"sub": "7c112274-673e-4a5a-ae87-b22881970934", "email": "diogoross360@gmail.com", "full_name": "Diogo", "phone_number": "415787490", "email_verified": true, "phone_verified": false}	email	2026-01-04 00:06:53.85083+00	2026-01-04 00:06:53.850899+00	2026-01-04 00:06:53.850899+00	28fd846f-4685-4f54-85ba-b242ec3f7eab
2627631a-7169-4971-a11f-991d72becbeb	2627631a-7169-4971-a11f-991d72becbeb	{"sub": "2627631a-7169-4971-a11f-991d72becbeb", "email": "diealvesouza@gmail.com", "full_name": "Diego Alves de Souza ", "phone_number": "33991588370", "email_verified": true, "phone_verified": false}	email	2026-01-04 00:51:49.464821+00	2026-01-04 00:51:49.464882+00	2026-01-04 00:51:49.464882+00	d828ccd0-1be4-4c86-97bd-558453e6ebb1
588090c1-2cba-4d44-ad80-c01a62b1ef00	588090c1-2cba-4d44-ad80-c01a62b1ef00	{"sub": "588090c1-2cba-4d44-ad80-c01a62b1ef00", "email": "renan.abreu11@hotmail.com", "full_name": "Renan", "phone_number": "31971130086", "email_verified": true, "phone_verified": false}	email	2026-01-04 01:14:45.858173+00	2026-01-04 01:14:45.858232+00	2026-01-04 01:14:45.858232+00	f1b86667-3f41-4dbd-a14c-ea85346c728a
f48b38bf-8f0f-4a94-b404-972763f815c1	f48b38bf-8f0f-4a94-b404-972763f815c1	{"sub": "f48b38bf-8f0f-4a94-b404-972763f815c1", "email": "dtmarcelomauricio@gmail.com", "full_name": "Marcelo Siqueira ", "phone_number": "41995099504", "email_verified": true, "phone_verified": false}	email	2026-01-04 01:25:49.321922+00	2026-01-04 01:25:49.322586+00	2026-01-04 01:25:49.322586+00	ffed6d0a-c150-4323-82aa-40669bdf379b
961a25f7-11e2-40e3-88c0-dc37934ff968	961a25f7-11e2-40e3-88c0-dc37934ff968	{"sub": "961a25f7-11e2-40e3-88c0-dc37934ff968", "email": "kabalawilhelm@gmail.com", "full_name": "Kabala", "phone_number": "7799999999", "email_verified": true, "phone_verified": false}	email	2026-01-04 01:32:27.603182+00	2026-01-04 01:32:27.603234+00	2026-01-04 01:32:27.603234+00	89aef546-75f4-4520-b0eb-4f3ad437c293
06673f07-c5de-4df5-b626-02f13b944503	06673f07-c5de-4df5-b626-02f13b944503	{"sub": "06673f07-c5de-4df5-b626-02f13b944503", "email": "igorribeiro.rodrigues@gmail.com", "full_name": "Igor Ribeiro Rodrigues ", "phone_number": "95981255673", "email_verified": true, "phone_verified": false}	email	2026-01-04 01:41:55.081691+00	2026-01-04 01:41:55.081743+00	2026-01-04 01:41:55.081743+00	85f6aa42-e554-4a62-89d3-26fe3d71f227
6c359332-a058-4a93-bcd0-b819134e10a5	6c359332-a058-4a93-bcd0-b819134e10a5	{"sub": "6c359332-a058-4a93-bcd0-b819134e10a5", "email": "nanda_chavess@yahoo.com.br", "full_name": "Fernanda Chaves Pereira ", "phone_number": "11982198040", "email_verified": true, "phone_verified": false}	email	2026-01-04 02:47:18.052721+00	2026-01-04 02:47:18.05278+00	2026-01-04 02:47:18.05278+00	3f3c663d-1f2d-4f45-80d8-4228c5ccb8b5
5fe1ca1b-7328-4d10-a01f-411b3b030bbc	5fe1ca1b-7328-4d10-a01f-411b3b030bbc	{"sub": "5fe1ca1b-7328-4d10-a01f-411b3b030bbc", "email": "zinho.prt@hotmail.com", "full_name": "Raul Rodrigues ", "phone_number": "21974862599", "email_verified": true, "phone_verified": false}	email	2026-01-04 03:27:02.408607+00	2026-01-04 03:27:02.409859+00	2026-01-04 03:27:02.409859+00	e0c8ee1a-68e1-4ff5-8029-803a94dc035a
883709a8-f09c-4750-80f2-2cfc9a1a76c0	883709a8-f09c-4750-80f2-2cfc9a1a76c0	{"sub": "883709a8-f09c-4750-80f2-2cfc9a1a76c0", "email": "resumoem@gmail.com", "full_name": "S", "phone_number": "85989598824", "email_verified": true, "phone_verified": false}	email	2026-01-04 10:57:46.101999+00	2026-01-04 10:57:46.102061+00	2026-01-04 10:57:46.102061+00	9dade36a-8686-4cd8-a775-fb656ffcb2db
35f90550-8355-4cac-ae39-cd6f5bbb4842	35f90550-8355-4cac-ae39-cd6f5bbb4842	{"sub": "35f90550-8355-4cac-ae39-cd6f5bbb4842", "email": "cmatheuzz@gmail.com", "full_name": "Ciro Matheus Nascimento ", "phone_number": "22997878856", "email_verified": true, "phone_verified": false}	email	2026-01-04 11:01:34.684047+00	2026-01-04 11:01:34.684106+00	2026-01-04 11:01:34.684106+00	2f07043d-8c92-4e53-9c5e-8ceea8421ff0
e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	{"sub": "e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79", "email": "andersonbr855@gmail.com", "full_name": "Anderson Silva", "phone_number": "85991558984", "email_verified": true, "phone_verified": false}	email	2026-01-04 12:49:25.652168+00	2026-01-04 12:49:25.652226+00	2026-01-04 12:49:25.652226+00	3e26cf0d-1688-4a9b-8527-2ef4f32797d2
e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	{"sub": "e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf", "email": "iago.ig@gmail.com", "full_name": "Iago Pereira", "phone_number": "73999557575", "email_verified": true, "phone_verified": false}	email	2026-01-04 14:00:11.054139+00	2026-01-04 14:00:11.054204+00	2026-01-04 14:00:11.054204+00	16f6c452-107d-4362-b681-704e3c5b5467
89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850	89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850	{"sub": "89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850", "email": "lauromsoares19@yahoo.com.br", "full_name": "Lauro Machado Soares Silva", "phone_number": "32999191993", "email_verified": false, "phone_verified": false}	email	2026-01-04 14:04:51.679272+00	2026-01-04 14:04:51.679348+00	2026-01-04 14:04:51.679348+00	b145fbf9-1e4e-4e5f-8fee-25cb09ee317d
6c2460e1-2f58-4de1-aa08-84ae33f9f461	6c2460e1-2f58-4de1-aa08-84ae33f9f461	{"sub": "6c2460e1-2f58-4de1-aa08-84ae33f9f461", "email": "leidyr2_6@hotmail.com", "full_name": "Celeide Rabelo ", "phone_number": "37999121529", "email_verified": false, "phone_verified": false}	email	2026-01-04 14:16:42.912219+00	2026-01-04 14:16:42.915204+00	2026-01-04 14:16:42.915204+00	27b09107-d744-4dfd-a0a8-0f00d090069f
04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	{"sub": "04005b6d-5b7d-4166-9b7b-d0dfbc440c2a", "email": "marcelodeduca@outlook.com", "full_name": "Marcelo mello", "phone_number": "22998396515", "email_verified": true, "phone_verified": false}	email	2026-01-04 14:28:01.846044+00	2026-01-04 14:28:01.846102+00	2026-01-04 14:28:01.846102+00	4fbe8690-ea2f-40e5-87b1-bc3f4227ebab
bf16411b-7e8e-4146-8a2c-82de2a895cbf	bf16411b-7e8e-4146-8a2c-82de2a895cbf	{"sub": "bf16411b-7e8e-4146-8a2c-82de2a895cbf", "email": "pedro2003srodrigues@gmail.com", "full_name": "Pedro Henrique Sales Rodrigues ", "phone_number": "31993912743", "email_verified": true, "phone_verified": false}	email	2026-01-04 15:51:27.029293+00	2026-01-04 15:51:27.029349+00	2026-01-04 15:51:27.029349+00	b364a85a-bc6d-4e43-8ee6-43b891415570
80e9c6e5-b970-432f-89c4-78910541a0c6	80e9c6e5-b970-432f-89c4-78910541a0c6	{"sub": "80e9c6e5-b970-432f-89c4-78910541a0c6", "email": "flsoncin@gmail.com", "full_name": "Fernando Soncin", "phone_number": "17997672187", "email_verified": true, "phone_verified": false}	email	2026-01-04 21:03:07.280857+00	2026-01-04 21:03:07.280922+00	2026-01-04 21:03:07.280922+00	9018f1e4-49c1-4108-962f-51bf679f1b39
99c2b8c0-c474-4e1b-8920-be058fc3ef64	99c2b8c0-c474-4e1b-8920-be058fc3ef64	{"sub": "99c2b8c0-c474-4e1b-8920-be058fc3ef64", "email": "edson.bfr@hotmail.com", "full_name": "EDSON FRANCA DE OLIVEIRA RIBEIRO", "phone_number": "21979230709", "email_verified": true, "phone_verified": false}	email	2026-01-05 00:39:20.301464+00	2026-01-05 00:39:20.302607+00	2026-01-05 00:39:20.302607+00	d85aede1-f546-4d01-a69c-342963b455d2
26205e3f-8d32-4b28-9bf4-90d79923dd7f	26205e3f-8d32-4b28-9bf4-90d79923dd7f	{"sub": "26205e3f-8d32-4b28-9bf4-90d79923dd7f", "email": "ggabriel@email.com", "full_name": "Gabriel silva arruda", "phone_number": "21960002000", "email_verified": true, "phone_verified": false}	email	2026-01-05 01:00:09.921174+00	2026-01-05 01:00:09.921822+00	2026-01-05 01:00:09.921822+00	941db372-5469-4563-b75b-e641aa7d307f
4706a11b-cd01-415f-8c0c-3c72f4b91c77	4706a11b-cd01-415f-8c0c-3c72f4b91c77	{"sub": "4706a11b-cd01-415f-8c0c-3c72f4b91c77", "email": "edu.aps@hotmail.com", "full_name": "Eduardo Alirio", "phone_number": "34991996753", "email_verified": true, "phone_verified": false}	email	2026-01-05 03:08:21.577318+00	2026-01-05 03:08:21.577377+00	2026-01-05 03:08:21.577377+00	959afb25-43e8-4f71-9571-01ff9a647416
aa91b8cd-0b82-452d-94a2-85336f80f5e3	aa91b8cd-0b82-452d-94a2-85336f80f5e3	{"sub": "aa91b8cd-0b82-452d-94a2-85336f80f5e3", "email": "marcosdiego.aluno@gmail.com", "full_name": "Marcos Diego", "phone_number": "65974002989", "email_verified": true, "phone_verified": false}	email	2026-01-05 14:23:18.522163+00	2026-01-05 14:23:18.522228+00	2026-01-05 14:23:18.522228+00	19b10076-0d3a-4eaa-b163-3828fde139cc
da15034b-dc8e-48c4-90bb-ff1e917f3a4a	da15034b-dc8e-48c4-90bb-ff1e917f3a4a	{"sub": "da15034b-dc8e-48c4-90bb-ff1e917f3a4a", "email": "franciscorodriguessilva.bsb@gmail.com", "full_name": "Francisco Rodrigues da Silva", "phone_number": "61982419854", "email_verified": false, "phone_verified": false}	email	2026-01-06 17:55:05.71925+00	2026-01-06 17:55:05.719303+00	2026-01-06 17:55:05.719303+00	b276e18b-4c8d-47e4-bf1d-2952cc847b15
29436920-6e90-4334-93e3-0377a18e98a8	29436920-6e90-4334-93e3-0377a18e98a8	{"sub": "29436920-6e90-4334-93e3-0377a18e98a8", "email": "andersonnascimento19226@gmail.com", "full_name": "Francisco Anderson Nascimento Barros", "phone_number": "85984025591", "email_verified": true, "phone_verified": false}	email	2026-01-07 17:04:00.815643+00	2026-01-07 17:04:00.816289+00	2026-01-07 17:04:00.816289+00	2c218871-d422-4948-b786-2104835e344c
c37ef344-ed5d-4a2d-b807-7e1e17618696	c37ef344-ed5d-4a2d-b807-7e1e17618696	{"sub": "c37ef344-ed5d-4a2d-b807-7e1e17618696", "email": "suzisebas92@gmail.com", "full_name": "T", "phone_number": "85987428070", "email_verified": true, "phone_verified": false}	email	2026-01-07 22:31:07.805787+00	2026-01-07 22:31:07.805841+00	2026-01-07 22:31:07.805841+00	4857d6e8-2eb7-4db1-a190-a9f456b54005
0be8f5a6-185c-40e1-a0db-4934b902cb78	0be8f5a6-185c-40e1-a0db-4934b902cb78	{"sub": "0be8f5a6-185c-40e1-a0db-4934b902cb78", "email": "jmjfb@hotmail.com", "full_name": "José Morais Junior ", "phone_number": "27998287044", "email_verified": true, "phone_verified": false}	email	2026-01-10 03:00:53.257436+00	2026-01-10 03:00:53.25749+00	2026-01-10 03:00:53.25749+00	edb44b16-d79e-4372-99a4-a0b56fb7f383
e62d2951-6f04-47c5-a83b-98bd0b357fa9	e62d2951-6f04-47c5-a83b-98bd0b357fa9	{"sub": "e62d2951-6f04-47c5-a83b-98bd0b357fa9", "email": "fabricio.franca4@gmail.com", "full_name": "FABRICIO NASCIMENTO DE FRANCA", "phone_number": "22981041444", "email_verified": true, "phone_verified": false}	email	2026-01-10 14:21:14.916281+00	2026-01-10 14:21:14.916332+00	2026-01-10 14:21:14.916332+00	f5176f11-e485-44e7-b3ae-c46bfc78cf55
b218f9a5-9c76-4258-acb1-1fa23b39b37f	b218f9a5-9c76-4258-acb1-1fa23b39b37f	{"sub": "b218f9a5-9c76-4258-acb1-1fa23b39b37f", "email": "avenide_martibs@live.com", "full_name": "Avenide pedraca martins", "phone_number": "92982386440", "email_verified": false, "phone_verified": false}	email	2026-01-21 11:43:25.398555+00	2026-01-21 11:43:25.398613+00	2026-01-21 11:43:25.398613+00	3315322f-ec82-4983-a665-d6a8e3b717d1
112224858409078770392	d3ade8b5-7116-4c23-b7d0-3c71e3f9b728	{"iss": "https://accounts.google.com", "sub": "112224858409078770392", "name": "João Gomes", "email": "jpegrj@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocK0_a-qbLURycGDWnEpxfZ4Y8-0tKFS0tQqpWGax2pLagrnHpY9hg=s96-c", "full_name": "João Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK0_a-qbLURycGDWnEpxfZ4Y8-0tKFS0tQqpWGax2pLagrnHpY9hg=s96-c", "provider_id": "112224858409078770392", "email_verified": true, "phone_verified": false}	google	2026-01-21 23:37:58.264095+00	2026-01-21 23:37:58.264146+00	2026-01-21 23:37:58.264146+00	f8402a77-7507-4e26-82cf-4e86aaf5cd01
112208404728969795276	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	{"iss": "https://accounts.google.com", "sub": "112208404728969795276", "name": "João Gomes", "email": "joao@mcistore.com.br", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLEE0QoPG0GDi3TxxXEQxjXeDB4xGO7sxb7w630z56nmYKzaTl3=s96-c", "full_name": "João Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLEE0QoPG0GDi3TxxXEQxjXeDB4xGO7sxb7w630z56nmYKzaTl3=s96-c", "provider_id": "112208404728969795276", "custom_claims": {"hd": "mcistore.com.br"}, "email_verified": true, "phone_verified": false}	google	2026-01-21 23:31:54.681247+00	2026-01-21 23:31:54.682418+00	2026-01-23 11:46:32.684596+00	9c7a57df-cfe1-458e-8669-f6d657671750
a3fed3b5-0726-4f12-816c-2700928fa967	a3fed3b5-0726-4f12-816c-2700928fa967	{"sub": "a3fed3b5-0726-4f12-816c-2700928fa967", "email": "johnwayneflt@gmail.com", "full_name": "John ", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	email	2026-01-30 22:30:13.986807+00	2026-01-30 22:30:13.986871+00	2026-01-30 22:30:13.986871+00	09f00db1-e8b6-40c5-99da-1febd3103cf6
110474261650981561867	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	{"iss": "https://accounts.google.com", "sub": "110474261650981561867", "name": "Paulo Fernando Lima de Freitas", "email": "paulofernandoimagens@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJMIUr6fudwBiYNUJeYtBfBmfDsbLXkEM2aDIGzQ92FS2Ap-Q=s96-c", "full_name": "Paulo Fernando Lima de Freitas", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJMIUr6fudwBiYNUJeYtBfBmfDsbLXkEM2aDIGzQ92FS2Ap-Q=s96-c", "provider_id": "110474261650981561867", "email_verified": true, "phone_verified": false}	google	2026-01-24 13:02:07.359251+00	2026-01-24 13:02:07.359313+00	2026-01-24 13:08:21.631279+00	7c958232-e723-474a-9b27-41441d66bd74
ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	{"sub": "ac779d4a-4b1c-46d4-b5a4-14e30247f7d7", "email": "pietrojesus850@gmail.com", "full_name": "Pietro de Jesus Felix ", "phone_number": "11965426154", "email_verified": true, "phone_verified": false}	email	2026-01-28 13:12:24.796806+00	2026-01-28 13:12:24.796855+00	2026-01-28 13:12:24.796855+00	392c1409-f640-4188-ada8-0ce69967c270
cd19309f-fd7c-4e12-97c6-ee441aefc542	cd19309f-fd7c-4e12-97c6-ee441aefc542	{"sub": "cd19309f-fd7c-4e12-97c6-ee441aefc542", "email": "joaovcardoso033@gmail.com", "full_name": "Joao vitor mateus cardoso", "phone_number": "11958057277", "email_verified": true, "phone_verified": false}	email	2026-01-28 13:15:08.169668+00	2026-01-28 13:15:08.169719+00	2026-01-28 13:15:08.169719+00	5cf85222-67ba-4508-96f3-3a160f7b8b5a
111418490672517185641	b79f267a-23c7-4424-b147-de0eecccedf2	{"iss": "https://accounts.google.com", "sub": "111418490672517185641", "name": "Joao pneu", "email": "y0uje6pa7cusp7@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLcgJ0zJSTDyXwCdlOOeIsdr_CvS58PQbH6l0QaADhSNd8O8Q=s96-c", "full_name": "Joao pneu", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLcgJ0zJSTDyXwCdlOOeIsdr_CvS58PQbH6l0QaADhSNd8O8Q=s96-c", "provider_id": "111418490672517185641", "email_verified": true, "phone_verified": false}	google	2026-01-29 20:15:12.3311+00	2026-01-29 20:15:12.331156+00	2026-01-29 20:16:44.516713+00	77ed7b12-2479-4919-ad70-dcb9410c5786
117247629742865453355	be865072-952b-449d-bc0e-d6bb25976951	{"iss": "https://accounts.google.com", "sub": "117247629742865453355", "name": "paulo fernando lima de freitas", "email": "mcicrm121@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKZ_UFDmp2SUS2T-i06BHQl5OxzLeyZISWxd-PY0ErVl_824w=s96-c", "full_name": "paulo fernando lima de freitas", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKZ_UFDmp2SUS2T-i06BHQl5OxzLeyZISWxd-PY0ErVl_824w=s96-c", "provider_id": "117247629742865453355", "email_verified": true, "phone_verified": false}	google	2026-01-29 20:22:54.324247+00	2026-01-29 20:22:54.324299+00	2026-01-29 20:23:20.230518+00	4e5a0111-6103-45c7-892d-eb7169a20395
108505383277292284385	7d05bc1f-1133-4176-9922-d4eea819c48d	{"iss": "https://accounts.google.com", "sub": "108505383277292284385", "name": "JotaV.", "email": "jotavpublicidade@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocIoMafi-bedYCnAcJbc1zzC23Q-E27iYPi_5PaLLN2ktskBjzcD=s96-c", "full_name": "JotaV.", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocIoMafi-bedYCnAcJbc1zzC23Q-E27iYPi_5PaLLN2ktskBjzcD=s96-c", "provider_id": "108505383277292284385", "email_verified": true, "phone_verified": false}	google	2026-02-03 01:12:45.110795+00	2026-02-03 01:12:45.11085+00	2026-02-03 01:30:12.031663+00	334dc4cc-3a1f-4c9f-82b1-21328336b5f5
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
7920d022-9628-49e1-bc7c-afb47479802f	2026-01-10 14:23:16.804877+00	2026-01-10 14:23:16.804877+00	password	9f6057b9-f6af-46f0-b77c-59eff4af4fbb
13a6d147-6efd-4c57-870b-2209b94fb5ff	2026-01-22 17:11:29.525909+00	2026-01-22 17:11:29.525909+00	password	5f771e6a-6fef-4749-969a-a2e8951bec61
b6391eeb-acde-4e75-88de-bf65e3932998	2026-01-23 11:46:32.748089+00	2026-01-23 11:46:32.748089+00	oauth	c6d36804-ddcf-4747-b0b9-82291b128ea8
9770ae2e-907e-4bf3-bf4a-95b7df51d3b0	2026-01-24 13:08:21.637589+00	2026-01-24 13:08:21.637589+00	oauth	8495640c-b022-412c-8036-4c0ddb5ce4ea
8e541986-e80f-4cad-bab4-1efcd77b42fc	2026-01-28 13:15:37.292034+00	2026-01-28 13:15:37.292034+00	otp	31be19ab-da87-4318-a880-a7be3e1729c0
e5bdbc54-7aaa-4230-8ac7-c880969b6a53	2026-01-03 00:08:39.113494+00	2026-01-03 00:08:39.113494+00	otp	8620eaad-72d1-4dec-a545-a828f082a2b4
c4c159a9-85c9-4d89-adfc-06c9e6d7a911	2026-01-03 00:33:18.881392+00	2026-01-03 00:33:18.881392+00	password	185a9e3e-dcef-4d3c-b00b-94059ca24395
6b6597a1-1dce-4102-b2ff-a1cb4f31b057	2026-01-03 00:34:35.614925+00	2026-01-03 00:34:35.614925+00	password	966a83de-83f4-408f-9edd-185b80c995a0
7d28e4e2-2141-49ad-ae08-9b67df0872a1	2026-01-28 13:54:21.44626+00	2026-01-28 13:54:21.44626+00	password	33153f90-3cd2-4919-84dc-16f93300027f
ba97988a-b90a-4225-b5b8-5a451af52c49	2026-01-29 20:22:54.367566+00	2026-01-29 20:22:54.367566+00	oauth	5a31d11f-aa98-446c-8915-45bc5f14341b
ee5ed604-c8cd-49c4-9357-82a2db541b8d	2025-12-29 14:34:54.08019+00	2025-12-29 14:34:54.08019+00	password	1520ed0f-40ef-4b48-9022-448f56ae5713
9a6ebafd-2365-46d0-81c1-893e729a8a6d	2025-12-29 14:37:49.127195+00	2025-12-29 14:37:49.127195+00	password	4549224b-e624-47fe-8470-93a855ff202c
f885473b-a15c-4037-a780-ad96848fc495	2026-01-29 20:23:20.236435+00	2026-01-29 20:23:20.236435+00	oauth	81b0043d-45a0-4db8-b446-2631cbe81158
9671b7ec-1be0-4c8f-a986-c51ef31e580d	2025-12-29 14:47:47.400401+00	2025-12-29 14:47:47.400401+00	password	58fbb025-0a85-4df0-a48d-a6096f627aaf
af6578da-e389-4c1d-a676-f479e7ffa65d	2025-12-29 15:11:28.848334+00	2025-12-29 15:11:28.848334+00	password	2b6ed8c5-ed79-4be6-98b4-2b2b025ef067
742ad55b-f683-4f03-8139-99784772b5f5	2025-12-29 15:12:49.0236+00	2025-12-29 15:12:49.0236+00	otp	0e494561-0a96-4b0c-b4a8-d4091fdd178b
205d70b7-4942-4876-b928-8cc84379e385	2025-12-29 15:19:21.504925+00	2025-12-29 15:19:21.504925+00	password	415ae52a-07c9-4c85-92da-92d4fdb31474
b5d1738a-7556-4ddb-8d81-e902ed0526fb	2025-12-29 15:33:33.307254+00	2025-12-29 15:33:33.307254+00	password	a1cebe95-ae1e-474c-a0a1-878184bf2e4e
de7af0d9-85bc-4800-bf66-ce0fdb6404b2	2025-12-29 16:35:46.462141+00	2025-12-29 16:35:46.462141+00	password	b9332fa2-a045-4651-8714-16e3ec936a40
2f91ff6a-664d-4b0f-918d-d157e2cbe5fc	2026-01-03 22:56:17.427915+00	2026-01-03 22:56:17.427915+00	otp	62c6c214-3013-41a7-aba5-574d197601c1
e94dc472-3971-4f9f-9c92-e0907f5d59b4	2026-01-03 23:42:23.673116+00	2026-01-03 23:42:23.673116+00	otp	2a00a8f1-9551-45ed-a7fa-c9f1ce795c28
64f73db1-d3f7-416e-ae42-d835cc91ca9d	2026-01-03 23:48:32.760541+00	2026-01-03 23:48:32.760541+00	otp	20f0e278-7832-4144-8adc-afe64779645d
bcd23631-88de-436a-8301-f486d182552e	2026-01-04 00:07:10.452696+00	2026-01-04 00:07:10.452696+00	otp	c010a940-fbdb-4410-9883-5efe738a23e8
fe40752a-b28d-4acf-9c0a-9e17f876cc5a	2026-01-04 00:52:25.786138+00	2026-01-04 00:52:25.786138+00	otp	cbdb1588-019c-499d-98f5-4f9f70fe65c2
5dabacd3-526f-466c-90ef-80a037901861	2026-01-04 01:04:08.331366+00	2026-01-04 01:04:08.331366+00	password	7d1ae2c3-69d5-486b-8c90-a42eefa43ac1
78a2974b-8ca3-41cb-933d-ca9c3da0a999	2026-01-04 01:15:10.636663+00	2026-01-04 01:15:10.636663+00	otp	4636bc5f-964f-4b28-beef-44f732056902
9bd93f66-cb8b-44aa-a56b-7ca36d6c237d	2026-01-04 01:26:02.046037+00	2026-01-04 01:26:02.046037+00	otp	40e814ed-917e-4393-823b-2c125f113da0
337fa618-971b-4103-b0d8-9dffac6dde93	2026-01-04 01:28:51.102145+00	2026-01-04 01:28:51.102145+00	password	28f62709-13c2-495c-ba2a-08a01b6ede61
f8fe7027-2c02-4a61-bba8-716edb8a4ba0	2026-01-04 01:37:21.731217+00	2026-01-04 01:37:21.731217+00	password	3b9338aa-6a36-4447-bc8c-5bb8a3700823
0c7faee6-6867-448b-969f-c8f760951337	2026-01-04 01:42:20.687883+00	2026-01-04 01:42:20.687883+00	otp	789e63e7-1ab7-480d-80cb-2e20047f9e76
e18d5d55-b7b0-4b66-a7b5-5122a6928847	2026-01-04 02:47:54.549418+00	2026-01-04 02:47:54.549418+00	otp	b9431587-2b5e-43ca-8001-ab8bed92993a
7d4410c4-4813-4415-928a-8ec9c79e7658	2026-01-04 02:51:52.917897+00	2026-01-04 02:51:52.917897+00	password	1b2d6b3f-06f8-4719-8ab4-2b623ba63ef8
44ad3c82-542e-4ed1-b2ec-46c6fe542b55	2026-01-04 03:27:30.312633+00	2026-01-04 03:27:30.312633+00	otp	9d81efea-eab2-4447-8222-680e96d24e72
c87c06c3-5add-4548-9793-901accb9df0c	2026-01-04 10:58:14.976469+00	2026-01-04 10:58:14.976469+00	otp	11b38190-3f4a-4227-9414-2b845c2fe405
934a5ca4-ebdc-40fc-9cdd-bab9f7b3d1f7	2026-01-04 11:01:50.258949+00	2026-01-04 11:01:50.258949+00	otp	801f38fe-d59e-4132-9454-82fd3fce8c0d
a04dff92-42af-4304-8a87-1165eb4ed1b8	2026-01-04 12:49:43.308519+00	2026-01-04 12:49:43.308519+00	otp	1474572c-59bf-4671-b814-135875db2b14
c513e6ad-5f2d-4dc3-8208-0f4d80dd676b	2026-01-04 14:00:43.656771+00	2026-01-04 14:00:43.656771+00	otp	0708cf2d-bddb-4316-a337-d965c7cc8d84
75b86c34-e3b6-4301-8094-187229514b01	2026-01-04 14:30:11.871578+00	2026-01-04 14:30:11.871578+00	otp	d25cd597-e4e9-4927-a7bb-800e822aa92d
2962fd22-016b-4af5-a9c5-eb9e1b47fef9	2026-01-04 15:51:40.68159+00	2026-01-04 15:51:40.68159+00	otp	c7f5cdc0-03a3-4227-932f-9b7eabdd6e3d
8271b7be-e6d0-4a2a-97da-047d13f9e661	2026-01-04 21:03:33.970371+00	2026-01-04 21:03:33.970371+00	otp	97a93dc5-ad63-4fe5-a8e4-cdb8296770cf
ce0aea2e-041a-4d5a-ac62-7167f4dfa424	2026-01-30 22:56:55.09646+00	2026-01-30 22:56:55.09646+00	password	28d912b9-036c-466d-a509-8670d627c873
e9d0c289-45b8-43f0-86bb-edbdd2e2f552	2026-01-05 00:39:41.743518+00	2026-01-05 00:39:41.743518+00	otp	79a3127d-33fe-450a-a504-69f7e6d8e620
2cbb4455-a19f-40af-9953-0118b9bd1dc3	2026-01-05 01:01:17.683726+00	2026-01-05 01:01:17.683726+00	otp	ce516830-b461-4f3b-b9a7-b2fea6ec6275
a0572e91-c370-4037-b9e6-2cb53bc3da50	2026-01-05 03:11:07.49778+00	2026-01-05 03:11:07.49778+00	otp	1b417485-7173-4f56-a79d-aaaf61d066c2
53112e4e-a977-4de4-96e3-aee4d873e8cd	2026-01-05 14:23:36.840192+00	2026-01-05 14:23:36.840192+00	otp	58596633-7542-4a63-9777-113d3073c4ca
8a12175b-bb06-4670-831b-b0721b52e77e	2026-02-03 01:12:45.16389+00	2026-02-03 01:12:45.16389+00	oauth	5a533602-8a9e-44a3-b0ce-2473ca79d968
5de6db7a-49df-4a07-954a-6362a74ebb8b	2026-02-03 01:15:30.274083+00	2026-02-03 01:15:30.274083+00	oauth	97b1eee2-4a27-461e-8efb-c25bc5491d8d
28098a85-2da4-46a7-8350-7267bd562845	2026-01-07 17:04:21.368264+00	2026-01-07 17:04:21.368264+00	otp	205f54d2-2c1e-4869-8f29-9c2790991752
a620dd02-cbd1-4fa6-8a4d-af39efbc7973	2026-01-07 22:31:26.405744+00	2026-01-07 22:31:26.405744+00	otp	9bc85f0d-123d-47f0-9429-1576f41f092c
c137213b-4b77-4a0b-9a0c-48fdd9b4c3c5	2026-01-07 22:33:43.373541+00	2026-01-07 22:33:43.373541+00	password	b1dfc8fe-b846-4cbe-b41a-66b3d962a399
e1ccd8d2-11c3-4614-9386-c5535be57d1f	2026-01-07 22:36:13.080007+00	2026-01-07 22:36:13.080007+00	password	e289cfd6-4694-439d-8ba4-a97ba50ff441
37e01464-84dc-4987-9d35-6eb6ed4ea3de	2026-01-07 22:43:58.804973+00	2026-01-07 22:43:58.804973+00	password	2790914f-eeae-42c8-a6f4-90fc8198eeaa
7b7ee80d-ad3c-4cc3-8785-1bc51d2b5124	2026-02-03 01:30:12.099232+00	2026-02-03 01:30:12.099232+00	oauth	df9eab5c-aabf-4787-bd27-c0f983a7491b
e965aeee-9ad7-429b-be95-344ffa1ff91a	2026-02-08 23:55:54.45898+00	2026-02-08 23:55:54.45898+00	password	32450e1a-2c40-4111-bdab-267b22e5ee8c
92b88d81-7b0d-4897-845a-7a15cd46360c	2026-01-10 03:02:00.39721+00	2026-01-10 03:02:00.39721+00	password	c0fe6993-0b05-40fc-9e24-e3edde686cbf
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
0f56ffae-5a00-4459-b22d-4f5597de15b2	b5fcd18b-ab56-472c-a1bf-171af25a938e	confirmation_token	d66555bb6e6ece76e971d354e3b53164675432a96364a98f28552cfa	jonatha_gouv@hotmail.com	2026-01-03 23:40:05.588614	2026-01-03 23:40:05.588614
a4d602a0-842e-47c8-b253-269693f28fbb	89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850	confirmation_token	fef54b39d441d689227207d48f33336360802373f5b1a8c8c5ff12f1	lauromsoares19@yahoo.com.br	2026-01-04 14:04:51.977038	2026-01-04 14:04:51.977038
7c83f945-2d6b-48d1-ab44-6bc8121d7b41	6c2460e1-2f58-4de1-aa08-84ae33f9f461	confirmation_token	fc640bd7d085ed0c281905b91678961f1d67ae635b357a2b671af89c	leidyr2_6@hotmail.com	2026-01-04 14:16:43.294324	2026-01-04 14:16:43.294324
b0f22b2d-8a72-4931-9a5c-7a22525aab8c	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	recovery_token	29e43ee8a888f77951b87f340d4968e6571dc4192d906013c287bf79	paulofernandoimagens@gmail.com	2026-01-04 22:31:58.516308	2026-01-04 22:31:58.516308
7db844a8-aff6-4616-90d6-5705fa4d707d	da15034b-dc8e-48c4-90bb-ff1e917f3a4a	confirmation_token	2882530696211b61eccd1aed0c54f9f1729f7eddc0bca3a3e9a4a097	franciscorodriguessilva.bsb@gmail.com	2026-01-06 17:55:06.253169	2026-01-06 17:55:06.253169
ad261466-80aa-466f-a4c0-2b623456839b	b218f9a5-9c76-4258-acb1-1fa23b39b37f	confirmation_token	192f7f66a5d363ec34e3190808b0edad17e2a41e959366be1faba988	avenide_martibs@live.com	2026-01-21 11:43:25.855549	2026-01-21 11:43:25.855549
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	410	2cjapinvq7is	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	f	2026-02-08 23:55:54.43418+00	2026-02-08 23:55:54.43418+00	\N	e965aeee-9ad7-429b-be95-344ffa1ff91a
00000000-0000-0000-0000-000000000000	367	5w66wwa2kqme	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	f	2026-01-28 13:54:21.433378+00	2026-01-28 13:54:21.433378+00	\N	7d28e4e2-2141-49ad-ae08-9b67df0872a1
00000000-0000-0000-0000-000000000000	370	egxed6cl464j	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-28 17:28:03.125107+00	2026-01-29 11:41:26.976988+00	vyfxvcshkhdk	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	373	swhvzzfnfcui	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-29 11:41:26.980753+00	2026-01-29 17:58:18.52007+00	egxed6cl464j	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	161	4gk5zqef3iy5	030ff676-214e-4c7f-9445-45dd8a88c9b5	f	2026-01-03 22:56:17.420362+00	2026-01-03 22:56:17.420362+00	\N	2f91ff6a-664d-4b0f-918d-d157e2cbe5fc
00000000-0000-0000-0000-000000000000	162	gobaaluxnacz	bcdff724-5628-4f32-965b-47f2f6e9beb7	f	2026-01-03 23:42:23.64883+00	2026-01-03 23:42:23.64883+00	\N	e94dc472-3971-4f9f-9c92-e0907f5d59b4
00000000-0000-0000-0000-000000000000	289	cbjpg4papb2j	0be8f5a6-185c-40e1-a0db-4934b902cb78	f	2026-01-10 03:02:00.395968+00	2026-01-10 03:02:00.395968+00	\N	92b88d81-7b0d-4897-845a-7a15cd46360c
00000000-0000-0000-0000-000000000000	163	mjymyzb46xmc	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	t	2026-01-03 23:48:32.746295+00	2026-01-04 00:53:16.361083+00	\N	64f73db1-d3f7-416e-ae42-d835cc91ca9d
00000000-0000-0000-0000-000000000000	168	vpv343ml2kpj	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	f	2026-01-04 00:53:16.382605+00	2026-01-04 00:53:16.382605+00	mjymyzb46xmc	64f73db1-d3f7-416e-ae42-d835cc91ca9d
00000000-0000-0000-0000-000000000000	169	kaue46elm2ee	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	f	2026-01-04 01:04:08.297861+00	2026-01-04 01:04:08.297861+00	\N	5dabacd3-526f-466c-90ef-80a037901861
00000000-0000-0000-0000-000000000000	386	6ihyzcur7cjh	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-30 11:52:55.799313+00	2026-01-30 12:53:02.249451+00	d5mihzg2m7ik	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	342	rakljl27457u	58778376-29ab-41f9-98a6-7e0b2b17ccf1	t	2026-01-22 17:11:29.523486+00	2026-01-22 18:33:01.088342+00	\N	13a6d147-6efd-4c57-870b-2209b94fb5ff
00000000-0000-0000-0000-000000000000	345	smwrublfiyet	58778376-29ab-41f9-98a6-7e0b2b17ccf1	f	2026-01-22 18:33:01.107929+00	2026-01-22 18:33:01.107929+00	rakljl27457u	13a6d147-6efd-4c57-870b-2209b94fb5ff
00000000-0000-0000-0000-000000000000	174	6qswlhves3kc	961a25f7-11e2-40e3-88c0-dc37934ff968	f	2026-01-04 01:37:21.71639+00	2026-01-04 01:37:21.71639+00	\N	f8fe7027-2c02-4a61-bba8-716edb8a4ba0
00000000-0000-0000-0000-000000000000	167	cnm6cglbxmrg	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 00:52:25.779432+00	2026-01-04 02:10:54.835913+00	\N	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	392	545udfvbna3m	a3fed3b5-0726-4f12-816c-2700928fa967	f	2026-01-30 22:56:55.086825+00	2026-01-30 22:56:55.086825+00	\N	ce0aea2e-041a-4d5a-ac62-7167f4dfa424
00000000-0000-0000-0000-000000000000	402	cqplb4m424px	7d05bc1f-1133-4176-9922-d4eea819c48d	f	2026-02-03 01:30:12.074685+00	2026-02-03 01:30:12.074685+00	\N	7b7ee80d-ad3c-4cc3-8785-1bc51d2b5124
00000000-0000-0000-0000-000000000000	178	4eqc5uvwoszj	6c359332-a058-4a93-bcd0-b819134e10a5	f	2026-01-04 02:47:54.520567+00	2026-01-04 02:47:54.520567+00	\N	e18d5d55-b7b0-4b66-a7b5-5122a6928847
00000000-0000-0000-0000-000000000000	75	s2xo4e2uegaz	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 14:34:54.076355+00	2025-12-29 14:34:54.076355+00	\N	ee5ed604-c8cd-49c4-9357-82a2db541b8d
00000000-0000-0000-0000-000000000000	78	kcgvkxiguxkx	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 14:47:47.396691+00	2025-12-29 14:47:47.396691+00	\N	9671b7ec-1be0-4c8f-a986-c51ef31e580d
00000000-0000-0000-0000-000000000000	79	nenl2mbtxfsa	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 15:11:28.832569+00	2025-12-29 15:11:28.832569+00	\N	af6578da-e389-4c1d-a676-f479e7ffa65d
00000000-0000-0000-0000-000000000000	80	62hefzdchh32	c5f3e41c-afe0-4e0b-b617-44db745be8b1	f	2025-12-29 15:12:49.020504+00	2025-12-29 15:12:49.020504+00	\N	742ad55b-f683-4f03-8139-99784772b5f5
00000000-0000-0000-0000-000000000000	81	b6wmq3qhhqrf	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 15:19:21.500478+00	2025-12-29 15:19:21.500478+00	\N	205d70b7-4942-4876-b928-8cc84379e385
00000000-0000-0000-0000-000000000000	82	eul6jmbw3dyl	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 15:33:33.271438+00	2025-12-29 15:33:33.271438+00	\N	b5d1738a-7556-4ddb-8d81-e902ed0526fb
00000000-0000-0000-0000-000000000000	84	ud7esqdom45u	5a497355-88eb-47e4-ba3a-06490e0a9938	f	2025-12-29 16:35:46.421478+00	2025-12-29 16:35:46.421478+00	\N	de7af0d9-85bc-4800-bf66-ce0fdb6404b2
00000000-0000-0000-0000-000000000000	182	73qqsybcquud	5fe1ca1b-7328-4d10-a01f-411b3b030bbc	f	2026-01-04 03:27:30.295211+00	2026-01-04 03:27:30.295211+00	\N	44ad3c82-542e-4ed1-b2ec-46c6fe542b55
00000000-0000-0000-0000-000000000000	170	to4qh7zvujxq	588090c1-2cba-4d44-ad80-c01a62b1ef00	t	2026-01-04 01:15:10.628201+00	2026-01-04 12:26:31.78648+00	\N	78a2974b-8ca3-41cb-933d-ca9c3da0a999
00000000-0000-0000-0000-000000000000	176	5umhmdmdjibc	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 02:10:54.860026+00	2026-01-04 13:51:45.974608+00	cnm6cglbxmrg	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	76	3c2popmuv2u2	eedffd24-a324-4717-a58b-a0cf1eb12fd9	t	2025-12-29 14:37:49.124958+00	2025-12-29 18:35:32.886461+00	\N	9a6ebafd-2365-46d0-81c1-893e729a8a6d
00000000-0000-0000-0000-000000000000	90	xbwpjovyxicr	eedffd24-a324-4717-a58b-a0cf1eb12fd9	f	2025-12-29 18:35:32.907076+00	2025-12-29 18:35:32.907076+00	3c2popmuv2u2	9a6ebafd-2365-46d0-81c1-893e729a8a6d
00000000-0000-0000-0000-000000000000	171	xbqvfje4vawm	f48b38bf-8f0f-4a94-b404-972763f815c1	t	2026-01-04 01:26:02.036196+00	2026-01-04 16:25:54.515134+00	\N	9bd93f66-cb8b-44aa-a56b-7ca36d6c237d
00000000-0000-0000-0000-000000000000	179	ecp764p7gy3y	6c359332-a058-4a93-bcd0-b819134e10a5	t	2026-01-04 02:51:52.914388+00	2026-01-04 18:39:47.77316+00	\N	7d4410c4-4813-4415-928a-8ec9c79e7658
00000000-0000-0000-0000-000000000000	175	lcwddtlreeyx	06673f07-c5de-4df5-b626-02f13b944503	t	2026-01-04 01:42:20.684351+00	2026-01-04 20:46:48.055068+00	\N	0c7faee6-6867-448b-969f-c8f760951337
00000000-0000-0000-0000-000000000000	172	xskqsyld2rom	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	t	2026-01-04 01:28:51.099512+00	2026-01-05 00:51:16.70084+00	\N	337fa618-971b-4103-b0d8-9dffac6dde93
00000000-0000-0000-0000-000000000000	164	vhorviuzsyqp	7c112274-673e-4a5a-ae87-b22881970934	t	2026-01-04 00:07:10.424013+00	2026-01-05 04:51:11.618263+00	\N	bcd23631-88de-436a-8301-f486d182552e
00000000-0000-0000-0000-000000000000	143	673bvu3ahmwe	89f64bf0-11bb-4572-b550-5987c4592709	f	2026-01-03 00:08:39.082317+00	2026-01-03 00:08:39.082317+00	\N	e5bdbc54-7aaa-4230-8ac7-c880969b6a53
00000000-0000-0000-0000-000000000000	144	ozollwag3fxz	89f64bf0-11bb-4572-b550-5987c4592709	f	2026-01-03 00:33:18.867205+00	2026-01-03 00:33:18.867205+00	\N	c4c159a9-85c9-4d89-adfc-06c9e6d7a911
00000000-0000-0000-0000-000000000000	145	ek3ojnstmlyl	89f64bf0-11bb-4572-b550-5987c4592709	f	2026-01-03 00:34:35.6011+00	2026-01-03 00:34:35.6011+00	\N	6b6597a1-1dce-4102-b2ff-a1cb4f31b057
00000000-0000-0000-0000-000000000000	184	2bpc225gg44h	883709a8-f09c-4750-80f2-2cfc9a1a76c0	f	2026-01-04 10:58:14.950735+00	2026-01-04 10:58:14.950735+00	\N	c87c06c3-5add-4548-9793-901accb9df0c
00000000-0000-0000-0000-000000000000	185	uqe3egjdb5bq	35f90550-8355-4cac-ae39-cd6f5bbb4842	f	2026-01-04 11:01:50.23878+00	2026-01-04 11:01:50.23878+00	\N	934a5ca4-ebdc-40fc-9cdd-bab9f7b3d1f7
00000000-0000-0000-0000-000000000000	218	y7p6yrltwd7y	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-05 02:10:25.185985+00	2026-01-16 23:17:33.2163+00	4n4ud4azqqha	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	188	ynnrle2t55fk	e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	t	2026-01-04 12:49:43.294971+00	2026-01-04 13:52:13.101297+00	\N	a04dff92-42af-4304-8a87-1165eb4ed1b8
00000000-0000-0000-0000-000000000000	190	dhof72cwyykd	e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	f	2026-01-04 13:52:13.102409+00	2026-01-04 13:52:13.102409+00	ynnrle2t55fk	a04dff92-42af-4304-8a87-1165eb4ed1b8
00000000-0000-0000-0000-000000000000	191	fa7ubqcnyo7z	e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	f	2026-01-04 14:00:43.646052+00	2026-01-04 14:00:43.646052+00	\N	c513e6ad-5f2d-4dc3-8208-0f4d80dd676b
00000000-0000-0000-0000-000000000000	365	g46ysel4ekva	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-28 13:15:37.27811+00	2026-01-28 14:12:34.354424+00	\N	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	368	vyfxvcshkhdk	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-28 14:12:34.361223+00	2026-01-28 17:28:03.103136+00	g46ysel4ekva	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	189	2o2p74t7zsl7	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 13:51:46.002957+00	2026-01-04 15:35:42.882696+00	5umhmdmdjibc	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	197	klusrfxzqbqj	bf16411b-7e8e-4146-8a2c-82de2a895cbf	f	2026-01-04 15:51:40.6775+00	2026-01-04 15:51:40.6775+00	\N	2962fd22-016b-4af5-a9c5-eb9e1b47fef9
00000000-0000-0000-0000-000000000000	198	hua62oe4uukv	f48b38bf-8f0f-4a94-b404-972763f815c1	f	2026-01-04 16:25:54.535951+00	2026-01-04 16:25:54.535951+00	xbqvfje4vawm	9bd93f66-cb8b-44aa-a56b-7ca36d6c237d
00000000-0000-0000-0000-000000000000	192	fyjgxdgidqe4	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	t	2026-01-04 14:30:11.847751+00	2026-01-04 17:12:00.168502+00	\N	75b86c34-e3b6-4301-8094-187229514b01
00000000-0000-0000-0000-000000000000	195	ani6hd4bkglu	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 15:35:42.89666+00	2026-01-04 18:17:15.341978+00	2o2p74t7zsl7	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	203	cziggxvvfaif	6c359332-a058-4a93-bcd0-b819134e10a5	f	2026-01-04 18:39:47.78534+00	2026-01-04 18:39:47.78534+00	ecp764p7gy3y	7d4410c4-4813-4415-928a-8ec9c79e7658
00000000-0000-0000-0000-000000000000	202	7dvnjasm6kui	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 18:17:15.351799+00	2026-01-04 19:56:24.938354+00	ani6hd4bkglu	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	187	a4s4kjsafztn	588090c1-2cba-4d44-ad80-c01a62b1ef00	t	2026-01-04 12:26:31.816271+00	2026-01-04 19:56:29.855685+00	to4qh7zvujxq	78a2974b-8ca3-41cb-933d-ca9c3da0a999
00000000-0000-0000-0000-000000000000	206	ndyr44pkzv4s	06673f07-c5de-4df5-b626-02f13b944503	f	2026-01-04 20:46:48.073555+00	2026-01-04 20:46:48.073555+00	lcwddtlreeyx	0c7faee6-6867-448b-969f-c8f760951337
00000000-0000-0000-0000-000000000000	207	b3uxulafb2u6	80e9c6e5-b970-432f-89c4-78910541a0c6	t	2026-01-04 21:03:33.960852+00	2026-01-04 23:36:05.606076+00	\N	8271b7be-e6d0-4a2a-97da-047d13f9e661
00000000-0000-0000-0000-000000000000	211	s3zttbv7djdp	80e9c6e5-b970-432f-89c4-78910541a0c6	f	2026-01-04 23:36:05.628115+00	2026-01-04 23:36:05.628115+00	b3uxulafb2u6	8271b7be-e6d0-4a2a-97da-047d13f9e661
00000000-0000-0000-0000-000000000000	204	us4xaf6k74xv	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 19:56:24.959959+00	2026-01-04 23:48:42.083179+00	7dvnjasm6kui	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	213	sdklvmwcdsme	99c2b8c0-c474-4e1b-8920-be058fc3ef64	f	2026-01-05 00:39:41.72354+00	2026-01-05 00:39:41.72354+00	\N	e9d0c289-45b8-43f0-86bb-edbdd2e2f552
00000000-0000-0000-0000-000000000000	399	iqehcdhhxtpc	7d05bc1f-1133-4176-9922-d4eea819c48d	f	2026-02-03 01:12:45.145326+00	2026-02-03 01:12:45.145326+00	\N	8a12175b-bb06-4670-831b-b0721b52e77e
00000000-0000-0000-0000-000000000000	216	35xndmcplk7r	26205e3f-8d32-4b28-9bf4-90d79923dd7f	f	2026-01-05 01:01:17.675143+00	2026-01-05 01:01:17.675143+00	\N	2cbb4455-a19f-40af-9953-0118b9bd1dc3
00000000-0000-0000-0000-000000000000	205	yzvzuimsmn2a	588090c1-2cba-4d44-ad80-c01a62b1ef00	t	2026-01-04 19:56:29.857435+00	2026-01-05 01:04:01.681986+00	a4s4kjsafztn	78a2974b-8ca3-41cb-933d-ca9c3da0a999
00000000-0000-0000-0000-000000000000	217	2meaymsyxmjl	588090c1-2cba-4d44-ad80-c01a62b1ef00	f	2026-01-05 01:04:01.690102+00	2026-01-05 01:04:01.690102+00	yzvzuimsmn2a	78a2974b-8ca3-41cb-933d-ca9c3da0a999
00000000-0000-0000-0000-000000000000	212	4n4ud4azqqha	2627631a-7169-4971-a11f-991d72becbeb	t	2026-01-04 23:48:42.095787+00	2026-01-05 02:10:25.162359+00	us4xaf6k74xv	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	215	owjj72idwvd5	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	t	2026-01-05 00:51:16.703209+00	2026-01-05 02:55:06.719278+00	xskqsyld2rom	337fa618-971b-4103-b0d8-9dffac6dde93
00000000-0000-0000-0000-000000000000	219	hngjrvu5n2yj	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	f	2026-01-05 02:55:06.74159+00	2026-01-05 02:55:06.74159+00	owjj72idwvd5	337fa618-971b-4103-b0d8-9dffac6dde93
00000000-0000-0000-0000-000000000000	220	4f7anzubbhyr	4706a11b-cd01-415f-8c0c-3c72f4b91c77	f	2026-01-05 03:11:07.482834+00	2026-01-05 03:11:07.482834+00	\N	a0572e91-c370-4037-b9e6-2cb53bc3da50
00000000-0000-0000-0000-000000000000	221	xw5mqxgbl4k2	7c112274-673e-4a5a-ae87-b22881970934	f	2026-01-05 04:51:11.64414+00	2026-01-05 04:51:11.64414+00	vhorviuzsyqp	bcd23631-88de-436a-8301-f486d182552e
00000000-0000-0000-0000-000000000000	224	47ij7f43f6xp	aa91b8cd-0b82-452d-94a2-85336f80f5e3	f	2026-01-05 14:23:36.809779+00	2026-01-05 14:23:36.809779+00	\N	53112e4e-a977-4de4-96e3-aee4d873e8cd
00000000-0000-0000-0000-000000000000	200	gflobd4nrixa	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	t	2026-01-04 17:12:00.175829+00	2026-01-06 20:11:53.536875+00	fyjgxdgidqe4	75b86c34-e3b6-4301-8094-187229514b01
00000000-0000-0000-0000-000000000000	358	tonivfuk3dn5	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	f	2026-01-24 13:08:21.635303+00	2026-01-24 13:08:21.635303+00	\N	9770ae2e-907e-4bf3-bf4a-95b7df51d3b0
00000000-0000-0000-0000-000000000000	239	6oh7wprvim5y	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	t	2026-01-06 20:11:53.563743+00	2026-01-07 17:47:25.356204+00	gflobd4nrixa	75b86c34-e3b6-4301-8094-187229514b01
00000000-0000-0000-0000-000000000000	315	ga4agb3bfkr2	2627631a-7169-4971-a11f-991d72becbeb	f	2026-01-16 23:17:33.231347+00	2026-01-16 23:17:33.231347+00	y7p6yrltwd7y	fe40752a-b28d-4acf-9c0a-9e17f876cc5a
00000000-0000-0000-0000-000000000000	249	egcnhetbc6as	29436920-6e90-4334-93e3-0377a18e98a8	t	2026-01-07 17:04:21.353161+00	2026-01-07 19:31:43.400017+00	\N	28098a85-2da4-46a7-8350-7267bd562845
00000000-0000-0000-0000-000000000000	251	oh5zbkmksl23	29436920-6e90-4334-93e3-0377a18e98a8	t	2026-01-07 19:31:43.433411+00	2026-01-08 03:23:40.785672+00	egcnhetbc6as	28098a85-2da4-46a7-8350-7267bd562845
00000000-0000-0000-0000-000000000000	252	oad552ugb7up	c37ef344-ed5d-4a2d-b807-7e1e17618696	f	2026-01-07 22:31:26.373212+00	2026-01-07 22:31:26.373212+00	\N	a620dd02-cbd1-4fa6-8a4d-af39efbc7973
00000000-0000-0000-0000-000000000000	272	skj366ddpu6b	29436920-6e90-4334-93e3-0377a18e98a8	f	2026-01-08 03:23:40.810505+00	2026-01-08 03:23:40.810505+00	oh5zbkmksl23	28098a85-2da4-46a7-8350-7267bd562845
00000000-0000-0000-0000-000000000000	253	nfwixsifz3yn	c37ef344-ed5d-4a2d-b807-7e1e17618696	f	2026-01-07 22:33:43.352479+00	2026-01-07 22:33:43.352479+00	\N	c137213b-4b77-4a0b-9a0c-48fdd9b4c3c5
00000000-0000-0000-0000-000000000000	250	agk7djnrajz5	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	t	2026-01-07 17:47:25.373389+00	2026-01-08 15:40:50.907379+00	6oh7wprvim5y	75b86c34-e3b6-4301-8094-187229514b01
00000000-0000-0000-0000-000000000000	254	tjc3kesfucko	c37ef344-ed5d-4a2d-b807-7e1e17618696	f	2026-01-07 22:36:13.071276+00	2026-01-07 22:36:13.071276+00	\N	e1ccd8d2-11c3-4614-9386-c5535be57d1f
00000000-0000-0000-0000-000000000000	278	uob6hsg3wu4d	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	f	2026-01-08 15:40:50.932277+00	2026-01-08 15:40:50.932277+00	agk7djnrajz5	75b86c34-e3b6-4301-8094-187229514b01
00000000-0000-0000-0000-000000000000	378	2myhbvkp7sss	be865072-952b-449d-bc0e-d6bb25976951	f	2026-01-29 20:22:54.354301+00	2026-01-29 20:22:54.354301+00	\N	ba97988a-b90a-4225-b5b8-5a451af52c49
00000000-0000-0000-0000-000000000000	379	muzcfkp2yu7u	be865072-952b-449d-bc0e-d6bb25976951	f	2026-01-29 20:23:20.235098+00	2026-01-29 20:23:20.235098+00	\N	f885473b-a15c-4037-a780-ad96848fc495
00000000-0000-0000-0000-000000000000	375	d5mihzg2m7ik	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-29 17:58:18.542859+00	2026-01-30 11:52:55.774697+00	swhvzzfnfcui	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	347	jo3hz22rxdur	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	t	2026-01-23 11:46:32.732739+00	2026-01-23 23:12:19.616126+00	\N	b6391eeb-acde-4e75-88de-bf65e3932998
00000000-0000-0000-0000-000000000000	350	k3pu5kb3qfik	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	f	2026-01-23 23:12:19.643684+00	2026-01-23 23:12:19.643684+00	jo3hz22rxdur	b6391eeb-acde-4e75-88de-bf65e3932998
00000000-0000-0000-0000-000000000000	255	splmba23cvpr	c37ef344-ed5d-4a2d-b807-7e1e17618696	t	2026-01-07 22:43:58.787551+00	2026-01-08 00:13:02.520935+00	\N	37e01464-84dc-4987-9d35-6eb6ed4ea3de
00000000-0000-0000-0000-000000000000	260	zoqqanqg3fua	c37ef344-ed5d-4a2d-b807-7e1e17618696	f	2026-01-08 00:13:02.535734+00	2026-01-08 00:13:02.535734+00	splmba23cvpr	37e01464-84dc-4987-9d35-6eb6ed4ea3de
00000000-0000-0000-0000-000000000000	298	y5ah4v5r2x2m	e62d2951-6f04-47c5-a83b-98bd0b357fa9	t	2026-01-10 14:23:16.803743+00	2026-01-11 03:01:45.553612+00	\N	7920d022-9628-49e1-bc7c-afb47479802f
00000000-0000-0000-0000-000000000000	304	d74whsdm63gk	e62d2951-6f04-47c5-a83b-98bd0b357fa9	f	2026-01-11 03:01:45.581761+00	2026-01-11 03:01:45.581761+00	y5ah4v5r2x2m	7920d022-9628-49e1-bc7c-afb47479802f
00000000-0000-0000-0000-000000000000	400	dlm26rdqypz3	7d05bc1f-1133-4176-9922-d4eea819c48d	f	2026-02-03 01:15:30.255441+00	2026-02-03 01:15:30.255441+00	\N	5de6db7a-49df-4a07-954a-6362a74ebb8b
00000000-0000-0000-0000-000000000000	388	of6c4hzu4ccm	cd19309f-fd7c-4e12-97c6-ee441aefc542	t	2026-01-30 12:53:02.268182+00	2026-02-04 11:50:33.313075+00	6ihyzcur7cjh	8e541986-e80f-4cad-bab4-1efcd77b42fc
00000000-0000-0000-0000-000000000000	404	3ivjdeykd62c	cd19309f-fd7c-4e12-97c6-ee441aefc542	f	2026-02-04 11:50:33.32646+00	2026-02-04 11:50:33.32646+00	of6c4hzu4ccm	8e541986-e80f-4cad-bab4-1efcd77b42fc
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
af6578da-e389-4c1d-a676-f479e7ffa65d	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 15:11:28.817399+00	2025-12-29 15:11:28.817399+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.151 Mobile/15E148 Safari/604.1	191.247.15.186	\N	\N	\N	\N	\N
742ad55b-f683-4f03-8139-99784772b5f5	c5f3e41c-afe0-4e0b-b617-44db745be8b1	2025-12-29 15:12:49.018074+00	2025-12-29 15:12:49.018074+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 16_7_12 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/399.2.845414227 Mobile/15E148 Safari/604.1	138.122.83.89	\N	\N	\N	\N	\N
205d70b7-4942-4876-b928-8cc84379e385	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 15:19:21.498572+00	2025-12-29 15:19:21.498572+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	191.247.15.186	\N	\N	\N	\N	\N
b5d1738a-7556-4ddb-8d81-e902ed0526fb	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 15:33:33.227966+00	2025-12-29 15:33:33.227966+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	191.247.15.186	\N	\N	\N	\N	\N
de7af0d9-85bc-4800-bf66-ce0fdb6404b2	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 16:35:46.361852+00	2025-12-29 16:35:46.361852+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	177.100.120.206	\N	\N	\N	\N	\N
fe40752a-b28d-4acf-9c0a-9e17f876cc5a	2627631a-7169-4971-a11f-991d72becbeb	2026-01-04 00:52:25.76494+00	2026-01-16 23:17:33.263394+00	\N	aal1	\N	2026-01-16 23:17:33.262711	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	179.241.253.1	\N	\N	\N	\N	\N
ba97988a-b90a-4225-b5b8-5a451af52c49	be865072-952b-449d-bc0e-d6bb25976951	2026-01-29 20:22:54.343652+00	2026-01-29 20:22:54.343652+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	191.247.15.64	\N	\N	\N	\N	\N
9a6ebafd-2365-46d0-81c1-893e729a8a6d	eedffd24-a324-4717-a58b-a0cf1eb12fd9	2025-12-29 14:37:49.121012+00	2025-12-29 18:35:32.933679+00	\N	aal1	\N	2025-12-29 18:35:32.932359	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	104.28.63.121	\N	\N	\N	\N	\N
f885473b-a15c-4037-a780-ad96848fc495	be865072-952b-449d-bc0e-d6bb25976951	2026-01-29 20:23:20.233919+00	2026-01-29 20:23:20.233919+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	191.247.15.64	\N	\N	\N	\N	\N
8a12175b-bb06-4670-831b-b0721b52e77e	7d05bc1f-1133-4176-9922-d4eea819c48d	2026-02-03 01:12:45.130816+00	2026-02-03 01:12:45.130816+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	138.117.36.72	\N	\N	\N	\N	\N
7b7ee80d-ad3c-4cc3-8785-1bc51d2b5124	7d05bc1f-1133-4176-9922-d4eea819c48d	2026-02-03 01:30:12.051241+00	2026-02-03 01:30:12.051241+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	138.117.36.72	\N	\N	\N	\N	\N
e965aeee-9ad7-429b-be95-344ffa1ff91a	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	2026-02-08 23:55:54.40167+00	2026-02-08 23:55:54.40167+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 YaBrowser/25.12.0.0 Safari/537.36	138.122.83.242	\N	\N	\N	\N	\N
e5bdbc54-7aaa-4230-8ac7-c880969b6a53	89f64bf0-11bb-4572-b550-5987c4592709	2026-01-03 00:08:39.067808+00	2026-01-03 00:08:39.067808+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	152.237.27.167	\N	\N	\N	\N	\N
c4c159a9-85c9-4d89-adfc-06c9e6d7a911	89f64bf0-11bb-4572-b550-5987c4592709	2026-01-03 00:33:18.847997+00	2026-01-03 00:33:18.847997+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	152.237.27.167	\N	\N	\N	\N	\N
ee5ed604-c8cd-49c4-9357-82a2db541b8d	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 14:34:54.066638+00	2025-12-29 14:34:54.066638+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143 Version/11.1.1 Safari/605.1.15	191.247.2.126	\N	\N	\N	\N	\N
9671b7ec-1be0-4c8f-a986-c51ef31e580d	5a497355-88eb-47e4-ba3a-06490e0a9938	2025-12-29 14:47:47.394133+00	2025-12-29 14:47:47.394133+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.151 Mobile/15E148 Safari/604.1	177.100.120.206	\N	\N	\N	\N	\N
6b6597a1-1dce-4102-b2ff-a1cb4f31b057	89f64bf0-11bb-4572-b550-5987c4592709	2026-01-03 00:34:35.588208+00	2026-01-03 00:34:35.588208+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	152.237.27.167	\N	\N	\N	\N	\N
2f91ff6a-664d-4b0f-918d-d157e2cbe5fc	030ff676-214e-4c7f-9445-45dd8a88c9b5	2026-01-03 22:56:17.417348+00	2026-01-03 22:56:17.417348+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	138.122.83.251	\N	\N	\N	\N	\N
e94dc472-3971-4f9f-9c92-e0907f5d59b4	bcdff724-5628-4f32-965b-47f2f6e9beb7	2026-01-03 23:42:23.636743+00	2026-01-03 23:42:23.636743+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0	179.208.108.116	\N	\N	\N	\N	\N
bcd23631-88de-436a-8301-f486d182552e	7c112274-673e-4a5a-ae87-b22881970934	2026-01-04 00:07:10.409988+00	2026-01-05 04:51:11.685678+00	\N	aal1	\N	2026-01-05 04:51:11.684929	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.151 Mobile/15E148 Safari/604.1	84.226.101.154	\N	\N	\N	\N	\N
64f73db1-d3f7-416e-ae42-d835cc91ca9d	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	2026-01-03 23:48:32.736945+00	2026-01-04 00:53:16.400214+00	\N	aal1	\N	2026-01-04 00:53:16.40009	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	200.124.165.41	\N	\N	\N	\N	\N
5dabacd3-526f-466c-90ef-80a037901861	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	2026-01-04 01:04:08.265588+00	2026-01-04 01:04:08.265588+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	200.124.165.41	\N	\N	\N	\N	\N
f8fe7027-2c02-4a61-bba8-716edb8a4ba0	961a25f7-11e2-40e3-88c0-dc37934ff968	2026-01-04 01:37:21.709129+00	2026-01-04 01:37:21.709129+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36 ABB/133.0.6943.51	177.234.190.15	\N	\N	\N	\N	\N
9bd93f66-cb8b-44aa-a56b-7ca36d6c237d	f48b38bf-8f0f-4a94-b404-972763f815c1	2026-01-04 01:26:02.027955+00	2026-01-04 16:25:54.56801+00	\N	aal1	\N	2026-01-04 16:25:54.567884	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	187.121.115.79	\N	\N	\N	\N	\N
e18d5d55-b7b0-4b66-a7b5-5122a6928847	6c359332-a058-4a93-bcd0-b819134e10a5	2026-01-04 02:47:54.50029+00	2026-01-04 02:47:54.50029+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	191.183.37.30	\N	\N	\N	\N	\N
44ad3c82-542e-4ed1-b2ec-46c6fe542b55	5fe1ca1b-7328-4d10-a01f-411b3b030bbc	2026-01-04 03:27:30.273569+00	2026-01-04 03:27:30.273569+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	177.192.19.83	\N	\N	\N	\N	\N
337fa618-971b-4103-b0d8-9dffac6dde93	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	2026-01-04 01:28:51.096792+00	2026-01-05 02:55:06.771606+00	\N	aal1	\N	2026-01-05 02:55:06.771465	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	200.124.165.41	\N	\N	\N	\N	\N
7d4410c4-4813-4415-928a-8ec9c79e7658	6c359332-a058-4a93-bcd0-b819134e10a5	2026-01-04 02:51:52.909979+00	2026-01-04 18:39:48.255421+00	\N	aal1	\N	2026-01-04 18:39:48.25531	Mozilla/5.0 (iPhone; CPU iPhone OS 26_1_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.108 Mobile/15E148 Safari/604.1	191.183.37.30	\N	\N	\N	\N	\N
0c7faee6-6867-448b-969f-c8f760951337	06673f07-c5de-4df5-b626-02f13b944503	2026-01-04 01:42:20.682183+00	2026-01-04 20:47:00.507382+00	\N	aal1	\N	2026-01-04 20:47:00.50618	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	177.26.94.240	\N	\N	\N	\N	\N
78a2974b-8ca3-41cb-933d-ca9c3da0a999	588090c1-2cba-4d44-ad80-c01a62b1ef00	2026-01-04 01:15:10.622591+00	2026-01-05 01:04:01.705099+00	\N	aal1	\N	2026-01-05 01:04:01.704974	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.151 Mobile/15E148 Safari/604.1	179.0.73.37	\N	\N	\N	\N	\N
c87c06c3-5add-4548-9793-901accb9df0c	883709a8-f09c-4750-80f2-2cfc9a1a76c0	2026-01-04 10:58:14.9286+00	2026-01-04 10:58:14.9286+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	45.186.133.175	\N	\N	\N	\N	\N
934a5ca4-ebdc-40fc-9cdd-bab9f7b3d1f7	35f90550-8355-4cac-ae39-cd6f5bbb4842	2026-01-04 11:01:50.222331+00	2026-01-04 11:01:50.222331+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	181.224.85.27	\N	\N	\N	\N	\N
a04dff92-42af-4304-8a87-1165eb4ed1b8	e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	2026-01-04 12:49:43.283734+00	2026-01-04 13:52:13.106781+00	\N	aal1	\N	2026-01-04 13:52:13.106113	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	177.37.137.67	\N	\N	\N	\N	\N
c513e6ad-5f2d-4dc3-8208-0f4d80dd676b	e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	2026-01-04 14:00:43.632329+00	2026-01-04 14:00:43.632329+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	179.105.129.52	\N	\N	\N	\N	\N
2962fd22-016b-4af5-a9c5-eb9e1b47fef9	bf16411b-7e8e-4146-8a2c-82de2a895cbf	2026-01-04 15:51:40.669612+00	2026-01-04 15:51:40.669612+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	152.237.27.167	\N	\N	\N	\N	\N
7d28e4e2-2141-49ad-ae08-9b67df0872a1	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	2026-01-28 13:54:21.420461+00	2026-01-28 13:54:21.420461+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	179.209.47.9	\N	\N	\N	\N	\N
8271b7be-e6d0-4a2a-97da-047d13f9e661	80e9c6e5-b970-432f-89c4-78910541a0c6	2026-01-04 21:03:33.950708+00	2026-01-04 23:36:05.666128+00	\N	aal1	\N	2026-01-04 23:36:05.666004	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1	104.28.47.100	\N	\N	\N	\N	\N
e9d0c289-45b8-43f0-86bb-edbdd2e2f552	99c2b8c0-c474-4e1b-8920-be058fc3ef64	2026-01-05 00:39:41.704022+00	2026-01-05 00:39:41.704022+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	45.165.118.97	\N	\N	\N	\N	\N
2cbb4455-a19f-40af-9953-0118b9bd1dc3	26205e3f-8d32-4b28-9bf4-90d79923dd7f	2026-01-05 01:01:17.664688+00	2026-01-05 01:01:17.664688+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	168.232.66.189	\N	\N	\N	\N	\N
a0572e91-c370-4037-b9e6-2cb53bc3da50	4706a11b-cd01-415f-8c0c-3c72f4b91c77	2026-01-05 03:11:07.470179+00	2026-01-05 03:11:07.470179+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	201.71.42.171	\N	\N	\N	\N	\N
53112e4e-a977-4de4-96e3-aee4d873e8cd	aa91b8cd-0b82-452d-94a2-85336f80f5e3	2026-01-05 14:23:36.79137+00	2026-01-05 14:23:36.79137+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	170.80.60.123	\N	\N	\N	\N	\N
8e541986-e80f-4cad-bab4-1efcd77b42fc	cd19309f-fd7c-4e12-97c6-ee441aefc542	2026-01-28 13:15:37.265983+00	2026-02-04 11:50:33.353788+00	\N	aal1	\N	2026-02-04 11:50:33.352451	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	179.209.47.9	\N	\N	\N	\N	\N
a620dd02-cbd1-4fa6-8a4d-af39efbc7973	c37ef344-ed5d-4a2d-b807-7e1e17618696	2026-01-07 22:31:26.358101+00	2026-01-07 22:31:26.358101+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	177.25.148.128	\N	\N	\N	\N	\N
c137213b-4b77-4a0b-9a0c-48fdd9b4c3c5	c37ef344-ed5d-4a2d-b807-7e1e17618696	2026-01-07 22:33:43.329679+00	2026-01-07 22:33:43.329679+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	177.25.148.128	\N	\N	\N	\N	\N
e1ccd8d2-11c3-4614-9386-c5535be57d1f	c37ef344-ed5d-4a2d-b807-7e1e17618696	2026-01-07 22:36:13.061126+00	2026-01-07 22:36:13.061126+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	177.25.148.128	\N	\N	\N	\N	\N
28098a85-2da4-46a7-8350-7267bd562845	29436920-6e90-4334-93e3-0377a18e98a8	2026-01-07 17:04:21.340655+00	2026-01-08 03:23:40.84831+00	\N	aal1	\N	2026-01-08 03:23:40.847633	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36	177.37.153.118	\N	\N	\N	\N	\N
92b88d81-7b0d-4897-845a-7a15cd46360c	0be8f5a6-185c-40e1-a0db-4934b902cb78	2026-01-10 03:02:00.394949+00	2026-01-10 03:02:00.394949+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	189.84.221.95	\N	\N	\N	\N	\N
75b86c34-e3b6-4301-8094-187229514b01	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	2026-01-04 14:30:11.832297+00	2026-01-08 15:40:50.974561+00	\N	aal1	\N	2026-01-08 15:40:50.974426	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	168.205.173.239	\N	\N	\N	\N	\N
5de6db7a-49df-4a07-954a-6362a74ebb8b	7d05bc1f-1133-4176-9922-d4eea819c48d	2026-02-03 01:15:30.231799+00	2026-02-03 01:15:30.231799+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.95 Mobile/15E148 Safari/604.1	138.117.36.72	\N	\N	\N	\N	\N
37e01464-84dc-4987-9d35-6eb6ed4ea3de	c37ef344-ed5d-4a2d-b807-7e1e17618696	2026-01-07 22:43:58.770195+00	2026-01-08 00:13:02.557095+00	\N	aal1	\N	2026-01-08 00:13:02.556311	Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1	179.224.181.214	\N	\N	\N	\N	\N
ce0aea2e-041a-4d5a-ac62-7167f4dfa424	a3fed3b5-0726-4f12-816c-2700928fa967	2026-01-30 22:56:55.068614+00	2026-01-30 22:56:55.068614+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	45.164.88.188	\N	\N	\N	\N	\N
7920d022-9628-49e1-bc7c-afb47479802f	e62d2951-6f04-47c5-a83b-98bd0b357fa9	2026-01-10 14:23:16.802845+00	2026-01-11 03:01:45.621379+00	\N	aal1	\N	2026-01-11 03:01:45.621275	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	179.144.166.4	\N	\N	\N	\N	\N
13a6d147-6efd-4c57-870b-2209b94fb5ff	58778376-29ab-41f9-98a6-7e0b2b17ccf1	2026-01-22 17:11:29.519944+00	2026-01-22 18:33:01.137507+00	\N	aal1	\N	2026-01-22 18:33:01.13674	Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/144.0.7559.85 Mobile/15E148 Safari/604.1	177.25.113.129	\N	\N	\N	\N	\N
b6391eeb-acde-4e75-88de-bf65e3932998	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	2026-01-23 11:46:32.713691+00	2026-01-23 23:12:19.690912+00	\N	aal1	\N	2026-01-23 23:12:19.688149	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36	200.192.29.83	\N	\N	\N	\N	\N
9770ae2e-907e-4bf3-bf4a-95b7df51d3b0	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	2026-01-24 13:08:21.633995+00	2026-01-24 13:08:21.633995+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	138.122.83.132	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	58778376-29ab-41f9-98a6-7e0b2b17ccf1	authenticated	authenticated	felipeaguiar1978@hotmail.com	$2a$10$gLAOqBrXSRTJjbmQ97GqiOSz/saaLZeNeRh70jfNYM3EZn/hLZTxi	2025-12-29 22:58:48.469693+00	\N		2025-12-29 22:58:29.232136+00		\N			\N	2026-01-22 17:11:29.519811+00	{"provider": "email", "providers": ["email"]}	{"sub": "58778376-29ab-41f9-98a6-7e0b2b17ccf1", "email": "felipeaguiar1978@hotmail.com", "full_name": "felipe", "phone_number": "85987614881", "email_verified": true, "phone_verified": false}	\N	2025-12-29 22:58:29.143716+00	2026-01-22 18:33:01.124149+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c5f3e41c-afe0-4e0b-b617-44db745be8b1	authenticated	authenticated	juliannnavc@gmail.com	$2a$10$fi4iE63xiHBaMcp/jsNEO.eRUg7ftFI3z0Je4W9HF6xk17Voefhdm	2025-12-29 15:12:49.01148+00	\N		2025-12-29 15:12:30.888154+00		\N			\N	2025-12-29 15:12:49.017969+00	{"provider": "email", "providers": ["email"]}	{"sub": "c5f3e41c-afe0-4e0b-b617-44db745be8b1", "email": "juliannnavc@gmail.com", "full_name": "Juliana de Vasconcelos ", "phone_number": "85986868126", "email_verified": true, "phone_verified": false}	\N	2025-12-29 15:12:30.859506+00	2025-12-29 15:12:49.022978+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	authenticated	authenticated	paulofernandoautomacao@gmail.com	$2a$10$wsB9phRyFUWSKZhgT5gBzOwqSVRyCkt2qt.ae0OpBpyCgJhQgjvYW	2025-12-25 13:48:52.169308+00	\N		2025-12-25 13:48:41.429243+00		\N			\N	2026-02-08 23:55:54.401544+00	{"provider": "email", "providers": ["email"]}	{"sub": "8cd76ab4-52be-4d0d-a761-b5b5a1bb497f", "email": "paulofernandoautomacao@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-12-25 13:48:41.34224+00	2026-02-08 23:55:54.456313+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	208740b5-696e-4593-9be2-11cbd3a3d991	authenticated	authenticated	paulinhoemc@gmail.com	$2a$10$bF2wRhZHrzt/37AAZg709etuylTl9xzXAe9xchT2v/8q4ZOmXxW7q	2026-01-02 15:57:49.569706+00	\N		2026-01-02 15:57:30.344743+00		\N			\N	2026-01-08 00:58:37.092187+00	{"provider": "email", "providers": ["email"]}	{"sub": "208740b5-696e-4593-9be2-11cbd3a3d991", "email": "paulinhoemc@gmail.com", "full_name": "Fernando Lima", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	\N	2026-01-02 15:57:30.304055+00	2026-01-09 20:44:01.916881+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	eedffd24-a324-4717-a58b-a0cf1eb12fd9	authenticated	authenticated	fviudez@gmail.com	$2a$10$Y2uxaXW08Jjq9X/yx4JsK.gSrtzJYPY07W.nR6LHY8h1vil6T6oPq	2025-12-29 12:59:50.696975+00	\N		2025-12-29 12:59:18.195867+00		\N			\N	2025-12-29 14:37:49.120914+00	{"provider": "email", "providers": ["email"]}	{"sub": "eedffd24-a324-4717-a58b-a0cf1eb12fd9", "email": "fviudez@gmail.com", "full_name": "isaac Viudez", "phone_number": "85999170617", "email_verified": true, "phone_verified": false}	\N	2025-12-29 12:59:18.152115+00	2025-12-29 18:35:32.918995+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	89f64bf0-11bb-4572-b550-5987c4592709	authenticated	authenticated	pedro_hsrg@hotmail.com	$2a$10$TFM/kfgXG/LsJAmPk49/AOyqqdU21nmKpX.V538DqH3RgZAXLv2ca	2026-01-03 00:08:39.059109+00	\N		2026-01-03 00:07:57.384867+00		\N			\N	2026-01-03 00:34:35.587477+00	{"provider": "email", "providers": ["email"]}	{"sub": "89f64bf0-11bb-4572-b550-5987c4592709", "email": "pedro_hsrg@hotmail.com", "full_name": "Pedro Henrique Sales Rodrigues ", "phone_number": "31993912743", "email_verified": true, "phone_verified": false}	\N	2026-01-03 00:07:57.314163+00	2026-01-03 00:34:35.613071+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	0af615a6-67dd-4a8a-a51f-6d1b84dcd707	authenticated	authenticated	fagner.lima.88@hotmail.com	$2a$10$jefeloBnV4ilINFhukEhTeCw7XcHWSSBkGTG//bzmeqopz.p4JmkK	2026-01-03 23:48:32.721722+00	\N		2026-01-03 23:47:58.826545+00		\N			\N	2026-01-04 01:28:51.09669+00	{"provider": "email", "providers": ["email"]}	{"sub": "0af615a6-67dd-4a8a-a51f-6d1b84dcd707", "email": "fagner.lima.88@hotmail.com", "full_name": "Fagner lima ", "phone_number": "81997175879", "email_verified": true, "phone_verified": false}	\N	2026-01-03 23:37:12.997786+00	2026-01-05 02:55:06.757762+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	5a497355-88eb-47e4-ba3a-06490e0a9938	authenticated	authenticated	franciscolima.hotmart@gmail.com	$2a$10$V6CgRvJdgbL9.lLL06oMWuIRgu.oZgvdeN1R7toi/fC4Wdiy3Kk5a	2025-12-29 14:16:43.922009+00	\N		2025-12-29 14:16:21.799433+00		\N			\N	2025-12-29 16:35:46.360547+00	{"provider": "email", "providers": ["email"]}	{"sub": "5a497355-88eb-47e4-ba3a-06490e0a9938", "email": "franciscolima.hotmart@gmail.com", "full_name": "Francisco Lima", "phone_number": "85994443375", "email_verified": true, "phone_verified": false}	\N	2025-12-29 14:16:21.748189+00	2025-12-29 16:35:46.457784+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ad54ec69-19f7-4450-b8f4-1f0c56900042	authenticated	authenticated	freitasbenicio121@gmail.com	$2a$10$bbwvF0foe95EMMHFQYIjiuxRCyVrDhYb4c16ZHNJUTHLdztonzmJS	2026-01-03 22:50:48.786373+00	\N		2026-01-03 22:50:34.532562+00		\N			\N	2026-01-03 22:50:48.794248+00	{"provider": "email", "providers": ["email"]}	{"sub": "ad54ec69-19f7-4450-b8f4-1f0c56900042", "email": "freitasbenicio121@gmail.com", "full_name": "Paulo Freitas", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	\N	2026-01-03 22:50:34.493643+00	2026-01-03 22:50:48.81138+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	030ff676-214e-4c7f-9445-45dd8a88c9b5	authenticated	authenticated	paulinhos2aman@gmail.com	$2a$10$jmLrx/gQOHHQneZCTRjjaeo/xbxwh7L1TDbO5jsbruMhYMfQ75Ali	2026-01-03 22:56:17.410817+00	\N		2026-01-03 22:55:52.042159+00		\N			\N	2026-01-03 22:56:17.417228+00	{"provider": "email", "providers": ["email"]}	{"sub": "030ff676-214e-4c7f-9445-45dd8a88c9b5", "email": "paulinhos2aman@gmail.com", "full_name": "Jose de Vasconcelos ", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	\N	2026-01-03 22:55:52.011264+00	2026-01-03 22:56:17.427311+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b5fcd18b-ab56-472c-a1bf-171af25a938e	authenticated	authenticated	jonatha_gouv@hotmail.com	$2a$10$sfGRMTyz0mHuMGDkHZJwzuwJ9J12CliSrHAV5TkwEuIGPdoobMYae	\N	\N	d66555bb6e6ece76e971d354e3b53164675432a96364a98f28552cfa	2026-01-03 23:40:05.343869+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "b5fcd18b-ab56-472c-a1bf-171af25a938e", "email": "jonatha_gouv@hotmail.com", "full_name": "Jônathas Gouveia", "phone_number": "82999151406", "email_verified": false, "phone_verified": false}	\N	2026-01-03 23:40:05.322186+00	2026-01-03 23:40:05.578369+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	5fe1ca1b-7328-4d10-a01f-411b3b030bbc	authenticated	authenticated	zinho.prt@hotmail.com	$2a$10$YBUs9llk3Lj1os4ATF7Jpu/5Q9IUJEateyyUf7mhooay1XrAQS8ZW	2026-01-04 03:27:30.26689+00	\N		2026-01-04 03:27:02.434438+00		\N			\N	2026-01-04 03:27:30.273458+00	{"provider": "email", "providers": ["email"]}	{"sub": "5fe1ca1b-7328-4d10-a01f-411b3b030bbc", "email": "zinho.prt@hotmail.com", "full_name": "Raul Rodrigues ", "phone_number": "21974862599", "email_verified": true, "phone_verified": false}	\N	2026-01-04 03:27:02.372751+00	2026-01-04 03:27:30.311293+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bcdff724-5628-4f32-965b-47f2f6e9beb7	authenticated	authenticated	mapicolini@gmail.com	$2a$10$lOUPhudf7Eex4V7gkhC5MONwTrgY6Y9Hr17a2ocKSAYpjVJLGs3e2	2026-01-03 23:42:23.630978+00	\N		2026-01-03 23:42:07.897294+00		\N			\N	2026-01-03 23:42:23.636636+00	{"provider": "email", "providers": ["email"]}	{"sub": "bcdff724-5628-4f32-965b-47f2f6e9beb7", "email": "mapicolini@gmail.com", "full_name": "Marcelo Picolini", "phone_number": "11976283939", "email_verified": true, "phone_verified": false}	\N	2026-01-03 23:42:07.888788+00	2026-01-03 23:42:23.672487+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7c112274-673e-4a5a-ae87-b22881970934	authenticated	authenticated	diogoross360@gmail.com	$2a$10$t3oDGOXtGUT/I8QuK9y3c.r.8SaRrjnDlIqsxU9iGHMc5r9d4Edl6	2026-01-04 00:07:10.39996+00	\N		2026-01-04 00:06:53.870159+00		\N			\N	2026-01-04 00:07:10.409857+00	{"provider": "email", "providers": ["email"]}	{"sub": "7c112274-673e-4a5a-ae87-b22881970934", "email": "diogoross360@gmail.com", "full_name": "Diogo", "phone_number": "415787490", "email_verified": true, "phone_verified": false}	\N	2026-01-04 00:06:53.808876+00	2026-01-05 04:51:11.66876+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f48b38bf-8f0f-4a94-b404-972763f815c1	authenticated	authenticated	dtmarcelomauricio@gmail.com	$2a$10$uVRDBu0dnGAlwMzj7xOPoO6ZwUfhh/KjF.Y01OyKgL3hJxPlQLxkS	2026-01-04 01:26:02.023203+00	\N		2026-01-04 01:25:49.330958+00		\N			\N	2026-01-04 01:26:02.027859+00	{"provider": "email", "providers": ["email"]}	{"sub": "f48b38bf-8f0f-4a94-b404-972763f815c1", "email": "dtmarcelomauricio@gmail.com", "full_name": "Marcelo Siqueira ", "phone_number": "41995099504", "email_verified": true, "phone_verified": false}	\N	2026-01-04 01:25:49.30513+00	2026-01-04 16:25:54.551377+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	961a25f7-11e2-40e3-88c0-dc37934ff968	authenticated	authenticated	kabalawilhelm@gmail.com	$2a$10$XLhBV230u5c6fXk9v0fATe0fIustbZd7Ti8NyuVUz.D7fv2g8jTAS	2026-01-04 01:32:37.194821+00	\N		2026-01-04 01:32:27.606219+00		\N			\N	2026-01-04 01:37:21.709026+00	{"provider": "email", "providers": ["email"]}	{"sub": "961a25f7-11e2-40e3-88c0-dc37934ff968", "email": "kabalawilhelm@gmail.com", "full_name": "Kabala", "phone_number": "7799999999", "email_verified": true, "phone_verified": false}	\N	2026-01-04 01:32:27.598229+00	2026-01-04 01:37:21.728602+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2627631a-7169-4971-a11f-991d72becbeb	authenticated	authenticated	diealvesouza@gmail.com	$2a$10$jEy2JkVpKYk2h8FNWeijLeg6feao1.qT2cuBBTTnp4ws1PK2aLGu.	2026-01-04 00:52:25.758251+00	\N		2026-01-04 00:51:49.475509+00		\N			\N	2026-01-04 00:52:25.764845+00	{"provider": "email", "providers": ["email"]}	{"sub": "2627631a-7169-4971-a11f-991d72becbeb", "email": "diealvesouza@gmail.com", "full_name": "Diego Alves de Souza ", "phone_number": "33991588370", "email_verified": true, "phone_verified": false}	\N	2026-01-04 00:51:49.447447+00	2026-01-16 23:17:33.244427+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	883709a8-f09c-4750-80f2-2cfc9a1a76c0	authenticated	authenticated	resumoem@gmail.com	$2a$10$TIqsnnr93lp6a0gxvCvFsOYcJlpZGjnkrhRKL6sRQMO.BH2alzSFW	2026-01-04 10:58:14.909785+00	\N		2026-01-04 10:57:46.133405+00		\N			\N	2026-01-04 10:58:14.927869+00	{"provider": "email", "providers": ["email"]}	{"sub": "883709a8-f09c-4750-80f2-2cfc9a1a76c0", "email": "resumoem@gmail.com", "full_name": "S", "phone_number": "85989598824", "email_verified": true, "phone_verified": false}	\N	2026-01-04 10:57:46.038821+00	2026-01-04 10:58:14.975816+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	588090c1-2cba-4d44-ad80-c01a62b1ef00	authenticated	authenticated	renan.abreu11@hotmail.com	$2a$10$SL7sPO4w7KF43wa7y0W2/OtJ3HSS8tWUVarL2.9qLEhZ9jRpZrehy	2026-01-04 01:15:10.615439+00	\N		2026-01-04 01:14:45.8711+00		\N			\N	2026-01-04 01:15:10.622477+00	{"provider": "email", "providers": ["email"]}	{"sub": "588090c1-2cba-4d44-ad80-c01a62b1ef00", "email": "renan.abreu11@hotmail.com", "full_name": "Renan", "phone_number": "31971130086", "email_verified": true, "phone_verified": false}	\N	2026-01-04 01:14:45.83655+00	2026-01-05 01:04:01.699248+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	06673f07-c5de-4df5-b626-02f13b944503	authenticated	authenticated	igorribeiro.rodrigues@gmail.com	$2a$10$bdz6cKvl.7H5mB/G1fccOuU3Uxcedyli3sOgKHDiJqu36NoHndKTK	2026-01-04 01:42:20.677025+00	\N		2026-01-04 01:41:55.089139+00		\N			\N	2026-01-04 01:42:20.682084+00	{"provider": "email", "providers": ["email"]}	{"sub": "06673f07-c5de-4df5-b626-02f13b944503", "email": "igorribeiro.rodrigues@gmail.com", "full_name": "Igor Ribeiro Rodrigues ", "phone_number": "95981255673", "email_verified": true, "phone_verified": false}	\N	2026-01-04 01:41:55.072823+00	2026-01-04 20:46:48.090482+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6c359332-a058-4a93-bcd0-b819134e10a5	authenticated	authenticated	nanda_chavess@yahoo.com.br	$2a$10$UsjtHkfqvUC6hSp8.OKf1.1XcENMyH8lp2cbiHsibsHfSnxlPifje	2026-01-04 02:47:54.49332+00	\N		2026-01-04 02:47:18.071084+00		\N			\N	2026-01-04 02:51:52.909871+00	{"provider": "email", "providers": ["email"]}	{"sub": "6c359332-a058-4a93-bcd0-b819134e10a5", "email": "nanda_chavess@yahoo.com.br", "full_name": "Fernanda Chaves Pereira ", "phone_number": "11982198040", "email_verified": true, "phone_verified": false}	\N	2026-01-04 02:47:18.008185+00	2026-01-04 18:39:47.796844+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	35f90550-8355-4cac-ae39-cd6f5bbb4842	authenticated	authenticated	cmatheuzz@gmail.com	$2a$10$jWuP4em5Q8IyzCptEDri3OAv.vAbMrHZ8rq..aKaCeK0L/SlpV.p6	2026-01-04 11:01:50.212486+00	\N		2026-01-04 11:01:34.69979+00		\N			\N	2026-01-04 11:01:50.222219+00	{"provider": "email", "providers": ["email"]}	{"sub": "35f90550-8355-4cac-ae39-cd6f5bbb4842", "email": "cmatheuzz@gmail.com", "full_name": "Ciro Matheus Nascimento ", "phone_number": "22997878856", "email_verified": true, "phone_verified": false}	\N	2026-01-04 11:01:34.6556+00	2026-01-04 11:01:50.255626+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	authenticated	authenticated	iago.ig@gmail.com	$2a$10$1/yGo5/XNQKV/d0FvfHBoO0z6nVd7lU2Jj9Yu1u86LD7vSr4W3H0.	2026-01-04 14:00:43.623499+00	\N		2026-01-04 14:00:11.067475+00		\N			\N	2026-01-04 14:00:43.631163+00	{"provider": "email", "providers": ["email"]}	{"sub": "e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf", "email": "iago.ig@gmail.com", "full_name": "Iago Pereira", "phone_number": "73999557575", "email_verified": true, "phone_verified": false}	\N	2026-01-04 14:00:11.023348+00	2026-01-04 14:00:43.65613+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	authenticated	authenticated	andersonbr855@gmail.com	$2a$10$1EJRET0xxJ35gHfBGZAMy.0IkhQbLE03TChQ7fYR6WogCob0p5HK.	2026-01-04 12:49:43.272021+00	\N		2026-01-04 12:49:25.672519+00		\N			\N	2026-01-04 12:49:43.283618+00	{"provider": "email", "providers": ["email"]}	{"sub": "e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79", "email": "andersonbr855@gmail.com", "full_name": "Anderson Silva", "phone_number": "85991558984", "email_verified": true, "phone_verified": false}	\N	2026-01-04 12:49:25.608711+00	2026-01-04 13:52:13.104139+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6c2460e1-2f58-4de1-aa08-84ae33f9f461	authenticated	authenticated	leidyr2_6@hotmail.com	$2a$10$jkRQDebtkIBWfv1v2Sy4BOWsiV5FlyTBi.2MaK.b/E8GyMzdPjeeW	\N	\N	fc640bd7d085ed0c281905b91678961f1d67ae635b357a2b671af89c	2026-01-04 14:16:42.930436+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "6c2460e1-2f58-4de1-aa08-84ae33f9f461", "email": "leidyr2_6@hotmail.com", "full_name": "Celeide Rabelo ", "phone_number": "37999121529", "email_verified": false, "phone_verified": false}	\N	2026-01-04 14:16:42.888856+00	2026-01-04 14:16:43.281716+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850	authenticated	authenticated	lauromsoares19@yahoo.com.br	$2a$10$c7M2aDzOCNOFEdtRAm8ty.diCrdsmg7ID/4Da7LfFJqdhW/tDw9a6	\N	\N	fef54b39d441d689227207d48f33336360802373f5b1a8c8c5ff12f1	2026-01-04 14:04:51.689604+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850", "email": "lauromsoares19@yahoo.com.br", "full_name": "Lauro Machado Soares Silva", "phone_number": "32999191993", "email_verified": false, "phone_verified": false}	\N	2026-01-04 14:04:51.662748+00	2026-01-04 14:04:51.963583+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	99c2b8c0-c474-4e1b-8920-be058fc3ef64	authenticated	authenticated	edson.bfr@hotmail.com	$2a$10$lKriDq/xQ4r1jTgufq3Qvu6qvGss0wTIwuuPyt3T1kNT4bD/ceqk2	2026-01-05 00:39:41.695405+00	\N		2026-01-05 00:39:20.328159+00		\N			\N	2026-01-05 00:39:41.703305+00	{"provider": "email", "providers": ["email"]}	{"sub": "99c2b8c0-c474-4e1b-8920-be058fc3ef64", "email": "edson.bfr@hotmail.com", "full_name": "EDSON FRANCA DE OLIVEIRA RIBEIRO", "phone_number": "21979230709", "email_verified": true, "phone_verified": false}	\N	2026-01-05 00:39:20.239885+00	2026-01-05 00:39:41.742823+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	80e9c6e5-b970-432f-89c4-78910541a0c6	authenticated	authenticated	flsoncin@gmail.com	$2a$10$N9.vEGGonnYH5UotTtAG8e6nwewhqKLPeuHP8wJIW3/1SveoUAJQW	2026-01-04 21:03:33.94315+00	\N		2026-01-04 21:03:07.306747+00		\N			\N	2026-01-04 21:03:33.950601+00	{"provider": "email", "providers": ["email"]}	{"sub": "80e9c6e5-b970-432f-89c4-78910541a0c6", "email": "flsoncin@gmail.com", "full_name": "Fernando Soncin", "phone_number": "17997672187", "email_verified": true, "phone_verified": false}	\N	2026-01-04 21:03:07.248921+00	2026-01-04 23:36:05.642804+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	bf16411b-7e8e-4146-8a2c-82de2a895cbf	authenticated	authenticated	pedro2003srodrigues@gmail.com	$2a$10$.9NsEPV/cnIi9QJb3tVI5ONs.ah5QzAc2pouDQCm6YJ5hWnu8qXEi	2026-01-04 15:51:40.661905+00	\N		2026-01-04 15:51:27.038947+00		\N			\N	2026-01-04 15:51:40.668913+00	{"provider": "email", "providers": ["email"]}	{"sub": "bf16411b-7e8e-4146-8a2c-82de2a895cbf", "email": "pedro2003srodrigues@gmail.com", "full_name": "Pedro Henrique Sales Rodrigues ", "phone_number": "31993912743", "email_verified": true, "phone_verified": false}	\N	2026-01-04 15:51:27.012966+00	2026-01-04 15:51:40.680375+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	26205e3f-8d32-4b28-9bf4-90d79923dd7f	authenticated	authenticated	ggabriel@email.com	$2a$10$73kgNhLUsE68r9Iz0XHOeOC1lAIC/Ql7d1Am0Qt.5KiKCPhFjMdUK	2026-01-05 01:01:17.654626+00	\N		2026-01-05 01:00:09.943248+00		\N			\N	2026-01-05 01:01:17.664581+00	{"provider": "email", "providers": ["email"]}	{"sub": "26205e3f-8d32-4b28-9bf4-90d79923dd7f", "email": "ggabriel@email.com", "full_name": "Gabriel silva arruda", "phone_number": "21960002000", "email_verified": true, "phone_verified": false}	\N	2026-01-05 01:00:09.89189+00	2026-01-05 01:01:17.683147+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	4706a11b-cd01-415f-8c0c-3c72f4b91c77	authenticated	authenticated	edu.aps@hotmail.com	$2a$10$8EhFFkz8H8ATporHnGglNOE1bU0FjA5IJGfdWBrqrRRR5gHMDr/OK	2026-01-05 03:11:07.462328+00	\N		2026-01-05 03:08:21.59844+00		\N			\N	2026-01-05 03:11:07.470087+00	{"provider": "email", "providers": ["email"]}	{"sub": "4706a11b-cd01-415f-8c0c-3c72f4b91c77", "email": "edu.aps@hotmail.com", "full_name": "Eduardo Alirio", "phone_number": "34991996753", "email_verified": true, "phone_verified": false}	\N	2026-01-05 03:08:21.531453+00	2026-01-05 03:11:07.497254+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	authenticated	authenticated	marcelodeduca@outlook.com	$2a$10$DDZXvunMKa7nZoc0JJKWDOKUPk2q3mwBnDpwuGKRYhaAmNHW2FYEC	2026-01-04 14:30:11.824757+00	\N		2026-01-04 14:28:01.872743+00		\N			\N	2026-01-04 14:30:11.831553+00	{"provider": "email", "providers": ["email"]}	{"sub": "04005b6d-5b7d-4166-9b7b-d0dfbc440c2a", "email": "marcelodeduca@outlook.com", "full_name": "Marcelo mello", "phone_number": "22998396515", "email_verified": true, "phone_verified": false}	\N	2026-01-04 14:28:01.810881+00	2026-01-08 15:40:50.954718+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	aa91b8cd-0b82-452d-94a2-85336f80f5e3	authenticated	authenticated	marcosdiego.aluno@gmail.com	$2a$10$HpNN6nppMYwuLr0jfh2WueFXDEX7RM9Dgh50lgDlfFRqHTiblocHq	2026-01-05 14:23:36.784996+00	\N		2026-01-05 14:23:18.540945+00		\N			\N	2026-01-05 14:23:36.791262+00	{"provider": "email", "providers": ["email"]}	{"sub": "aa91b8cd-0b82-452d-94a2-85336f80f5e3", "email": "marcosdiego.aluno@gmail.com", "full_name": "Marcos Diego", "phone_number": "65974002989", "email_verified": true, "phone_verified": false}	\N	2026-01-05 14:23:18.478826+00	2026-01-05 14:23:36.835586+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	da15034b-dc8e-48c4-90bb-ff1e917f3a4a	authenticated	authenticated	franciscorodriguessilva.bsb@gmail.com	$2a$10$7TWL9dFJBdFaK4ckslRQk.3TM8bi.IctSekVBWOvZd16LdWy4fEvK	\N	\N	2882530696211b61eccd1aed0c54f9f1729f7eddc0bca3a3e9a4a097	2026-01-06 17:55:05.748148+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "da15034b-dc8e-48c4-90bb-ff1e917f3a4a", "email": "franciscorodriguessilva.bsb@gmail.com", "full_name": "Francisco Rodrigues da Silva", "phone_number": "61982419854", "email_verified": false, "phone_verified": false}	\N	2026-01-06 17:55:05.657832+00	2026-01-06 17:55:06.229964+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	532bdbae-1cef-4abf-89dd-c6bbc361c8a0	authenticated	authenticated	paulofernandoimagens@gmail.com	$2a$10$pRt8e9T1/W/VEdDGjHKO.eWIwukrf2u2bTGmcCCZ41qv2pHdZO0gW	2026-01-03 14:10:06.354329+00	\N		2026-01-03 14:09:45.919975+00	29e43ee8a888f77951b87f340d4968e6571dc4192d906013c287bf79	2026-01-04 22:31:58.215577+00			\N	2026-01-24 13:08:21.633904+00	{"provider": "email", "providers": ["email", "google"]}	{"iss": "https://accounts.google.com", "sub": "110474261650981561867", "name": "Paulo Fernando Lima de Freitas", "email": "paulofernandoimagens@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJMIUr6fudwBiYNUJeYtBfBmfDsbLXkEM2aDIGzQ92FS2Ap-Q=s96-c", "full_name": "Paulo Fernando Lima de Freitas", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJMIUr6fudwBiYNUJeYtBfBmfDsbLXkEM2aDIGzQ92FS2Ap-Q=s96-c", "provider_id": "110474261650981561867", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	\N	2026-01-03 14:09:45.891965+00	2026-01-24 13:08:21.637145+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c37ef344-ed5d-4a2d-b807-7e1e17618696	authenticated	authenticated	suzisebas92@gmail.com	$2a$10$.gLrgFn.wMjLOPPZogQqYOqGWVXUP34PINqO0Kd3xqrfJFK8aJuOO	2026-01-07 22:31:26.351074+00	\N		2026-01-07 22:31:07.831979+00		\N			\N	2026-01-07 22:43:58.77009+00	{"provider": "email", "providers": ["email"]}	{"sub": "c37ef344-ed5d-4a2d-b807-7e1e17618696", "email": "suzisebas92@gmail.com", "full_name": "T", "phone_number": "85987428070", "email_verified": true, "phone_verified": false}	\N	2026-01-07 22:31:07.747032+00	2026-01-08 00:13:02.547853+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	29436920-6e90-4334-93e3-0377a18e98a8	authenticated	authenticated	andersonnascimento19226@gmail.com	$2a$10$558Kk79pjnarp93QOXaUV.KVRJuZsrMgi9Z/UAqt1p9GW.EraQpKu	2026-01-07 17:04:21.334754+00	\N		2026-01-07 17:04:00.847771+00		\N			\N	2026-01-07 17:04:21.340564+00	{"provider": "email", "providers": ["email"]}	{"sub": "29436920-6e90-4334-93e3-0377a18e98a8", "email": "andersonnascimento19226@gmail.com", "full_name": "Francisco Anderson Nascimento Barros", "phone_number": "85984025591", "email_verified": true, "phone_verified": false}	\N	2026-01-07 17:04:00.772031+00	2026-01-08 03:23:40.83136+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a3fed3b5-0726-4f12-816c-2700928fa967	authenticated	authenticated	johnwayneflt@gmail.com	$2a$10$G8hFZnuf6IJrJkg3.ZuzxucpVAd4SF7e5atlqTW5KJVydFJ8xCJZm	2026-01-30 22:34:41.619769+00	\N		2026-01-30 22:30:13.996112+00		\N			\N	2026-01-30 22:56:55.067332+00	{"provider": "email", "providers": ["email"]}	{"sub": "a3fed3b5-0726-4f12-816c-2700928fa967", "email": "johnwayneflt@gmail.com", "full_name": "John ", "phone_number": "85988171944", "email_verified": true, "phone_verified": false}	\N	2026-01-30 22:30:13.960586+00	2026-01-30 22:56:55.095036+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	0be8f5a6-185c-40e1-a0db-4934b902cb78	authenticated	authenticated	jmjfb@hotmail.com	$2a$10$TdG0NQpiIMr3DP2ATI9Tw.pJLtAInqe74H1eR7SQbTsuLp0kXULwi	2026-01-10 03:01:15.337704+00	\N		2026-01-10 03:00:53.278678+00		\N			\N	2026-01-10 03:02:00.394858+00	{"provider": "email", "providers": ["email"]}	{"sub": "0be8f5a6-185c-40e1-a0db-4934b902cb78", "email": "jmjfb@hotmail.com", "full_name": "José Morais Junior ", "phone_number": "27998287044", "email_verified": true, "phone_verified": false}	\N	2026-01-10 03:00:53.165638+00	2026-01-10 03:02:00.396895+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cd19309f-fd7c-4e12-97c6-ee441aefc542	authenticated	authenticated	joaovcardoso033@gmail.com	$2a$10$Hx.GCxgr8q4C6L2B4ITLPuH4rwlyI53O4RQTsYNz9QQbuXWgHnR8S	2026-01-28 13:15:37.256605+00	\N		2026-01-28 13:15:08.173652+00		\N			\N	2026-01-28 13:15:37.26425+00	{"provider": "email", "providers": ["email"]}	{"sub": "cd19309f-fd7c-4e12-97c6-ee441aefc542", "email": "joaovcardoso033@gmail.com", "full_name": "Joao vitor mateus cardoso", "phone_number": "11958057277", "email_verified": true, "phone_verified": false}	\N	2026-01-28 13:15:08.157389+00	2026-02-04 11:50:33.337424+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	e62d2951-6f04-47c5-a83b-98bd0b357fa9	authenticated	authenticated	fabricio.franca4@gmail.com	$2a$10$fqCVVYWGL.wFhlFqqxFJwequg3qc.wKLkgiRG5sWn5gerTE/AFn6W	2026-01-10 14:21:27.331243+00	\N		2026-01-10 14:21:14.942814+00		\N			\N	2026-01-10 14:23:16.80275+00	{"provider": "email", "providers": ["email"]}	{"sub": "e62d2951-6f04-47c5-a83b-98bd0b357fa9", "email": "fabricio.franca4@gmail.com", "full_name": "FABRICIO NASCIMENTO DE FRANCA", "phone_number": "22981041444", "email_verified": true, "phone_verified": false}	\N	2026-01-10 14:21:14.880035+00	2026-01-11 03:01:45.602722+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b218f9a5-9c76-4258-acb1-1fa23b39b37f	authenticated	authenticated	avenide_martibs@live.com	$2a$10$lyu9E4UhAhdFoo9soWEge.XJSq/F8xNWocUgvLx7EEjTEXu1pDK6W	\N	\N	192f7f66a5d363ec34e3190808b0edad17e2a41e959366be1faba988	2026-01-21 11:43:25.416169+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "b218f9a5-9c76-4258-acb1-1fa23b39b37f", "email": "avenide_martibs@live.com", "full_name": "Avenide pedraca martins", "phone_number": "92982386440", "email_verified": false, "phone_verified": false}	\N	2026-01-21 11:43:25.274174+00	2026-01-21 11:43:25.821362+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d3ade8b5-7116-4c23-b7d0-3c71e3f9b728	authenticated	authenticated	jpegrj@gmail.com	\N	2026-01-21 23:37:58.270236+00	\N		\N		\N			\N	2026-01-21 23:37:58.272064+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112224858409078770392", "name": "João Gomes", "email": "jpegrj@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocK0_a-qbLURycGDWnEpxfZ4Y8-0tKFS0tQqpWGax2pLagrnHpY9hg=s96-c", "full_name": "João Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocK0_a-qbLURycGDWnEpxfZ4Y8-0tKFS0tQqpWGax2pLagrnHpY9hg=s96-c", "provider_id": "112224858409078770392", "email_verified": true, "phone_verified": false}	\N	2026-01-21 23:37:58.253803+00	2026-01-21 23:37:58.277426+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b79f267a-23c7-4424-b147-de0eecccedf2	authenticated	authenticated	y0uje6pa7cusp7@gmail.com	\N	2026-01-29 20:15:12.344359+00	\N		\N		\N			\N	2026-01-29 20:16:44.52097+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "111418490672517185641", "name": "Joao pneu", "email": "y0uje6pa7cusp7@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLcgJ0zJSTDyXwCdlOOeIsdr_CvS58PQbH6l0QaADhSNd8O8Q=s96-c", "full_name": "Joao pneu", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLcgJ0zJSTDyXwCdlOOeIsdr_CvS58PQbH6l0QaADhSNd8O8Q=s96-c", "provider_id": "111418490672517185641", "email_verified": true, "phone_verified": false}	\N	2026-01-29 20:15:12.209099+00	2026-01-29 20:16:44.527588+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	authenticated	authenticated	joao@mcistore.com.br	\N	2026-01-21 23:31:54.741126+00	\N		2026-01-12 14:26:27.455746+00		\N			\N	2026-01-23 11:46:32.712728+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "112208404728969795276", "name": "João Gomes", "email": "joao@mcistore.com.br", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLEE0QoPG0GDi3TxxXEQxjXeDB4xGO7sxb7w630z56nmYKzaTl3=s96-c", "full_name": "João Gomes", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLEE0QoPG0GDi3TxxXEQxjXeDB4xGO7sxb7w630z56nmYKzaTl3=s96-c", "provider_id": "112208404728969795276", "custom_claims": {"hd": "mcistore.com.br"}, "email_verified": true, "phone_verified": false}	\N	2026-01-12 14:26:27.330615+00	2026-01-23 23:12:19.669389+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	authenticated	authenticated	pietrojesus850@gmail.com	$2a$10$PnlPbH6.kW6TX84H.HJkgeqk.btPFcXWO30JlMNjUVuV30UhAHBCq	2026-01-28 13:12:39.084881+00	\N		2026-01-28 13:12:24.80903+00		\N			\N	2026-01-28 13:54:21.418454+00	{"provider": "email", "providers": ["email"]}	{"sub": "ac779d4a-4b1c-46d4-b5a4-14e30247f7d7", "email": "pietrojesus850@gmail.com", "full_name": "Pietro de Jesus Felix ", "phone_number": "11965426154", "email_verified": true, "phone_verified": false}	\N	2026-01-28 13:12:24.773981+00	2026-01-28 13:54:21.444801+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	be865072-952b-449d-bc0e-d6bb25976951	authenticated	authenticated	mcicrm121@gmail.com	\N	2026-01-29 20:22:54.332615+00	\N		\N		\N			\N	2026-01-29 20:23:20.233827+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "117247629742865453355", "name": "paulo fernando lima de freitas", "email": "mcicrm121@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKZ_UFDmp2SUS2T-i06BHQl5OxzLeyZISWxd-PY0ErVl_824w=s96-c", "full_name": "paulo fernando lima de freitas", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKZ_UFDmp2SUS2T-i06BHQl5OxzLeyZISWxd-PY0ErVl_824w=s96-c", "provider_id": "117247629742865453355", "email_verified": true, "phone_verified": false}	\N	2026-01-29 20:22:54.268652+00	2026-01-29 20:23:20.236115+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7d05bc1f-1133-4176-9922-d4eea819c48d	authenticated	authenticated	jotavpublicidade@gmail.com	\N	2026-02-03 01:12:45.121981+00	\N		\N		\N			\N	2026-02-03 01:30:12.05114+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "108505383277292284385", "name": "JotaV.", "email": "jotavpublicidade@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocIoMafi-bedYCnAcJbc1zzC23Q-E27iYPi_5PaLLN2ktskBjzcD=s96-c", "full_name": "JotaV.", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocIoMafi-bedYCnAcJbc1zzC23Q-E27iYPi_5PaLLN2ktskBjzcD=s96-c", "provider_id": "108505383277292284385", "email_verified": true, "phone_verified": false}	\N	2026-02-03 01:12:45.077807+00	2026-02-03 01:30:12.098114+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, created_at, user_id, name, email, company_name, message_type, subject, message, status) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (code, is_used, created_at, benefit_days, used_by, used_at, description, discount_percentage, influencer_name, max_uses, uses_count, is_active, expires_at) FROM stdin;
EHWQPTXJ	t	2026-01-07 23:09:11.60855+00	7	c37ef344-ed5d-4a2d-b807-7e1e17618696	2026-01-08 00:14:37.846463+00	\N	0	\N	100	0	t	\N
MCI	f	2026-01-21 22:42:30.855868+00	7	\N	\N		100	Felipe Aguiar	1	0	t	\N
PARCERIA	f	2026-01-27 23:16:45.191046+00	7	\N	\N		100	John	1	0	t	\N
\.


--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, name, plan_type, max_seats, created_at, cnpj) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, current_session_id, last_seen, full_name, phone_number, last_language, last_level, last_teacher_id, last_topic_id, is_premium, daily_minutes_used, last_usage_reset_date, is_kids_mode, streak_count, has_completed_tutorial, last_streak_at, total_sessions, total_minutes_active, total_words_spoken, premium_until, organization_id, org_role, email, is_system_admin) FROM stdin;
b218f9a5-9c76-4258-acb1-1fa23b39b37f	\N	2026-01-21 11:43:25.270728+00	Avenide pedraca martins	\N	\N	\N	\N	\N	f	0	2026-01-21	f	0	f	\N	0	0	0	\N	\N	member	avenide_martibs@live.com	f
a3fed3b5-0726-4f12-816c-2700928fa967	8cy5t	2026-01-30 23:39:21.225+00	John 	\N	en-US	B1 (Intermediário)	malina-en	\N	t	0	2026-01-30	f	0	f	\N	0	0	0	\N	\N	member	johnwayneflt@gmail.com	f
b79f267a-23c7-4424-b147-de0eecccedf2	70edwo	2026-01-29 20:16:46.17+00	Joao pneu	\N	en-US	B1 (Intermediário)	malina-en	\N	f	0	2026-01-29	f	0	t	\N	0	0	0	\N	\N	member	y0uje6pa7cusp7@gmail.com	f
ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	g5k93u	2026-01-28 14:01:31.204+00	Pietro de Jesus Felix 	\N	en-US	B1 (Intermediário)	geremy-en	\N	t	0	2026-01-28	f	0	t	\N	0	0	0	\N	\N	member	pietrojesus850@gmail.com	f
ad54ec69-19f7-4450-b8f4-1f0c56900042	\N	\N	Paulo Freitas	\N	\N	\N	\N	\N	t	0	2026-01-30	f	0	f	\N	0	0	0	\N	\N	member	freitasbenicio121@gmail.com	f
532bdbae-1cef-4abf-89dd-c6bbc361c8a0	rt64cl	2026-01-24 13:22:58.623+00	Paulinho Fernando	\N	\N	B1 (Intermediário)	\N	\N	f	0	2026-01-24	f	0	t	\N	0	0	0	\N	\N	member	paulofernandoimagens@gmail.com	f
8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	rbu7f	2026-02-09 00:01:05.31+00	\N	\N	en-US	B1 (Intermediário)	malina-en	\N	t	0	2026-02-09	f	0	t	\N	8	9	0	\N	\N	admin	paulofernandoautomacao@gmail.com	t
c37ef344-ed5d-4a2d-b807-7e1e17618696	e4ck7	2026-01-08 00:14:54.31+00	T	\N	en-US	B1 (Intermediário)	malina-en	pronunciation	f	0	2026-01-23	f	0	f	\N	1	1	0	2026-01-15 00:14:37.846463+00	\N	member	suzisebas92@gmail.com	f
c5f3e41c-afe0-4e0b-b617-44db745be8b1	s2tshw	2025-12-29 15:13:56.031+00	\N	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	juliannnavc@gmail.com	f
e62d2951-6f04-47c5-a83b-98bd0b357fa9	kbqnde	2026-01-10 14:41:24.195+00	FABRICIO NASCIMENTO DE FRANCA	\N	en-US	B1 (Intermediário)	malina-en	\N	f	0	2026-01-17	f	0	t	\N	0	0	0	\N	\N	member	fabricio.franca4@gmail.com	f
89f64bf0-11bb-4572-b550-5987c4592709	\N	\N	Pedro Henrique Sales Rodrigues 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	pedro_hsrg@hotmail.com	f
0af615a6-67dd-4a8a-a51f-6d1b84dcd707	\N	\N	Fagner lima 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	fagner.lima.88@hotmail.com	f
030ff676-214e-4c7f-9445-45dd8a88c9b5	\N	\N	Jose de Vasconcelos 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	paulinhos2aman@gmail.com	f
b5fcd18b-ab56-472c-a1bf-171af25a938e	\N	\N	Jônathas Gouveia	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	jonatha_gouv@hotmail.com	f
5a497355-88eb-47e4-ba3a-06490e0a9938	c8csjk	2025-12-29 16:41:46.159+00	\N	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	franciscolima.hotmart@gmail.com	f
5fe1ca1b-7328-4d10-a01f-411b3b030bbc	\N	\N	Raul Rodrigues 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	zinho.prt@hotmail.com	f
bcdff724-5628-4f32-965b-47f2f6e9beb7	\N	\N	Marcelo Picolini	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	mapicolini@gmail.com	f
7c112274-673e-4a5a-ae87-b22881970934	\N	\N	Diogo	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	diogoross360@gmail.com	f
f48b38bf-8f0f-4a94-b404-972763f815c1	\N	\N	Marcelo Siqueira 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	dtmarcelomauricio@gmail.com	f
961a25f7-11e2-40e3-88c0-dc37934ff968	\N	\N	Kabala	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	kabalawilhelm@gmail.com	f
883709a8-f09c-4750-80f2-2cfc9a1a76c0	\N	\N	S	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	resumoem@gmail.com	f
588090c1-2cba-4d44-ad80-c01a62b1ef00	\N	\N	Renan	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	renan.abreu11@hotmail.com	f
06673f07-c5de-4df5-b626-02f13b944503	\N	\N	Igor Ribeiro Rodrigues 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	igorribeiro.rodrigues@gmail.com	f
2627631a-7169-4971-a11f-991d72becbeb	\N	\N	Diego Alves de Souza 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	diealvesouza@gmail.com	f
6c359332-a058-4a93-bcd0-b819134e10a5	\N	\N	Fernanda Chaves Pereira 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	nanda_chavess@yahoo.com.br	f
35f90550-8355-4cac-ae39-cd6f5bbb4842	\N	\N	Ciro Matheus Nascimento 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	cmatheuzz@gmail.com	f
e2ad3b8a-1ff9-48f7-bca4-d7ca3b906adf	\N	\N	Iago Pereira	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	iago.ig@gmail.com	f
e20a73e7-0faf-4dc0-8e48-69a8f6a8ef79	\N	\N	Anderson Silva	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	andersonbr855@gmail.com	f
6c2460e1-2f58-4de1-aa08-84ae33f9f461	\N	\N	Celeide Rabelo 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	leidyr2_6@hotmail.com	f
89c0ded0-6ff2-4ec0-8d48-0c02f4bc7850	\N	\N	Lauro Machado Soares Silva	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	lauromsoares19@yahoo.com.br	f
99c2b8c0-c474-4e1b-8920-be058fc3ef64	\N	\N	EDSON FRANCA DE OLIVEIRA RIBEIRO	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	edson.bfr@hotmail.com	f
80e9c6e5-b970-432f-89c4-78910541a0c6	\N	\N	Fernando Soncin	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	flsoncin@gmail.com	f
bf16411b-7e8e-4146-8a2c-82de2a895cbf	\N	\N	Pedro Henrique Sales Rodrigues 	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	pedro2003srodrigues@gmail.com	f
26205e3f-8d32-4b28-9bf4-90d79923dd7f	\N	\N	Gabriel silva arruda	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	ggabriel@email.com	f
4706a11b-cd01-415f-8c0c-3c72f4b91c77	\N	\N	Eduardo Alirio	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	edu.aps@hotmail.com	f
eedffd24-a324-4717-a58b-a0cf1eb12fd9	04l2a4	2025-12-29 18:35:33.088+00	\N	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	fviudez@gmail.com	f
aa91b8cd-0b82-452d-94a2-85336f80f5e3	\N	\N	Marcos Diego	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	marcosdiego.aluno@gmail.com	f
da15034b-dc8e-48c4-90bb-ff1e917f3a4a	\N	\N	Francisco Rodrigues da Silva	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	franciscorodriguessilva.bsb@gmail.com	f
0be8f5a6-185c-40e1-a0db-4934b902cb78	mpkjb2	2026-01-10 03:02:00.049+00	José Morais Junior 	\N	en-US	B1 (Intermediário)	geremy-en	\N	f	0	2026-01-17	f	0	t	\N	0	0	0	\N	\N	member	jmjfb@hotmail.com	f
208740b5-696e-4593-9be2-11cbd3a3d991	t4eerw	2026-01-09 20:44:03.481+00	Fernando Lima	\N	en-US	B1 (Intermediário)	malina-en	\N	f	0	2026-01-17	f	0	t	\N	3	4	0	\N	\N	member	paulinhoemc@gmail.com	f
04005b6d-5b7d-4166-9b7b-d0dfbc440c2a	dgvec	2026-01-08 15:40:53.099+00	Marcelo mello	\N	\N	B1 (Intermediário)	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	marcelodeduca@outlook.com	f
29436920-6e90-4334-93e3-0377a18e98a8	rq9pt	2026-01-08 03:23:41.252+00	Francisco Anderson Nascimento Barros	\N	\N	\N	\N	\N	f	0	2026-01-17	f	0	f	\N	0	0	0	\N	\N	member	andersonnascimento19226@gmail.com	f
58778376-29ab-41f9-98a6-7e0b2b17ccf1	qazwc	2026-01-22 17:21:31.348+00	\N	\N	fr-FR	B1 (Intermediário)	geremy-fr	\N	f	0	2026-01-22	f	0	t	\N	0	0	0	\N	\N	member	felipeaguiar1978@hotmail.com	f
d3ade8b5-7116-4c23-b7d0-3c71e3f9b728	bozlg	2026-01-21 23:38:00.95+00	João Gomes	\N	\N	B1 (Intermediário)	\N	\N	f	0	2026-01-21	f	0	f	\N	0	0	0	\N	\N	member	jpegrj@gmail.com	f
7d05bc1f-1133-4176-9922-d4eea819c48d	4wfhfl	2026-02-03 01:30:30.168+00	JotaV.	\N	en-US	B1 (Intermediário)	geremy-en	free-conversation	f	0	2026-02-03	f	0	t	\N	0	0	0	\N	\N	member	jotavpublicidade@gmail.com	f
cd19309f-fd7c-4e12-97c6-ee441aefc542	muanyd	2026-02-04 11:52:09.645+00	Joao vitor mateus cardoso	\N	es-ES	B2 (Intermediário Superior)	geremy-es	\N	t	0	2026-02-04	f	0	t	\N	0	0	0	\N	\N	member	joaovcardoso033@gmail.com	f
be865072-952b-449d-bc0e-d6bb25976951	2oasse	2026-01-29 20:23:39.473+00	paulo fernando lima de freitas	\N	en-US	B1 (Intermediário)	malina-en	\N	t	0	2026-01-30	f	0	t	\N	0	0	0	\N	\N	member	mcicrm121@gmail.com	f
3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	y0b0kr	2026-01-23 23:12:34.93+00	Joao Paulo Gomes	\N	en-US	B1 (Intermediário)	malina-en	\N	f	0	2026-01-23	f	0	t	\N	0	0	0	\N	\N	member	joao@mcistore.com.br	f
\.


--
-- Data for Name: sentry_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sentry_sessions (id, user_id, language, level, teacher_id, topic_id, last_activity) FROM stdin;
3fb17d6d-59bc-467d-96ef-0cc0f8db2e44	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	en-US	Beginner	geremy-en	pronunciation	2025-12-26 21:37:45.616+00
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, teacher_id, language, level, topic_id, score, mistakes, vocabulary, tip, continuation_context, created_at) FROM stdin;
\.


--
-- Data for Name: transcripts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcripts (id, session_id, user_id, role, content, created_at) FROM stdin;
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, topic_id, status, score, last_played_at, mistakes, vocabulary, current_level, total_minutes, tip) FROM stdin;
eb229833-ca3b-4c59-a447-d7c766d25530	c37ef344-ed5d-4a2d-b807-7e1e17618696	restaurant	unlocked	1	2026-01-08 00:14:22.187311+00	[]	[]	1	1	\N
f3a874ff-4981-4a15-ad73-06906af90bb6	58778376-29ab-41f9-98a6-7e0b2b17ccf1	free-conversation	unlocked	7	2026-01-21 22:30:26.273487+00	[]	[]	1	5	\N
2b11eab4-7af6-4dc1-9d9d-f5cc6b39292b	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	pronunciation	unlocked	19	2026-01-08 12:49:48.893985+00	[]	[]	1	13	\N
63d30d83-1510-46c2-8b62-d45f8c25c0a3	208740b5-696e-4593-9be2-11cbd3a3d991	school	unlocked	6	2026-01-08 00:55:16.762104+00	[]	[]	1	4	\N
c7c42b33-757a-4080-a4b9-e266c1064448	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	work	unlocked	3	2026-01-08 01:56:08.726141+00	[]	[]	1	2	\N
b8e02779-26cf-4620-9e51-17f3b93a7780	3f6d0ae5-ca52-42c4-be59-a2b9f6b15f58	free-conversation	unlocked	4	2026-01-21 23:33:56.548811+00	[]	[]	1	3	\N
2d8cfa7b-668d-440d-8b98-06523f597a6b	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	daily-life	unlocked	1	2026-01-08 01:56:28.535735+00	[]	[]	1	1	\N
b94d5565-2688-4a6d-aca7-1c584b37fc28	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	school	unlocked	23	2026-01-08 00:42:41.142957+00	[]	[]	1	16	\N
6b6a045b-41b7-4250-a4f7-a0f2b0d9b5d5	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	job-interview	unlocked	9	2026-01-08 02:11:02.954837+00	[]	[]	1	6	\N
f2f545c2-2fd2-47af-8e75-22568fe6ad41	58778376-29ab-41f9-98a6-7e0b2b17ccf1	travel	unlocked	3	2026-01-21 22:31:49.704283+00	[]	[]	1	2	\N
399844fe-2356-4ac2-b737-035f4da4e926	cd19309f-fd7c-4e12-97c6-ee441aefc542	travel	unlocked	1	2026-01-28 13:35:06.006755+00	[]	[]	1	1	\N
4190ba4b-1a7f-49b8-9e90-2e6a8759e940	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	travel	unlocked	3	2026-01-08 02:11:27.170826+00	[]	[]	1	2	\N
ebc9760d-a1bc-4bab-9f4c-2dab5c18b7a8	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	free-conversation	unlocked	37	2026-01-28 13:25:42.42789+00	[]	[]	1	26	\N
e8226900-f556-42f3-adc8-ba859ac380e1	ac779d4a-4b1c-46d4-b5a4-14e30247f7d7	pronunciation	unlocked	10	2026-01-28 14:01:29.509643+00	[]	[]	1	7	\N
63269322-0bda-4a47-83ab-7f5acafee5f3	e62d2951-6f04-47c5-a83b-98bd0b357fa9	free-conversation	unlocked	10	2026-01-10 14:30:21.878704+00	[]	[]	1	7	\N
9b2f9540-7f85-4ac4-a6dd-2e036de98750	cd19309f-fd7c-4e12-97c6-ee441aefc542	free-conversation	unlocked	39	2026-01-28 13:35:55.946248+00	[]	[]	1	27	\N
3b64679f-aecb-45bc-8bcc-9924fddeb539	a3fed3b5-0726-4f12-816c-2700928fa967	free-conversation	unlocked	6	2026-01-30 23:01:10.011289+00	[]	[]	1	4	\N
4386a3bb-3305-4d8a-809d-be4fef549e5a	7d05bc1f-1133-4176-9922-d4eea819c48d	free-conversation	unlocked	1	2026-02-03 01:13:06.41675+00	[]	[]	1	1	\N
c6f3a17e-ce0c-45f3-be85-d43bbdaf9fda	8cd76ab4-52be-4d0d-a761-b5b5a1bb497f	free-conversation	unlocked	37	2026-01-08 01:20:14.290587+00	[{"mistake": "in the moment I not go speak to you, I got to go", "correction": "I have to go right now.", "explanation": "The user's phrase was grammatically incorrect and unclear. 'I have to go right now' is the correct and natural way to say it."}]	[{"word": "Free conversation", "translation": "Conversa Livre"}]	1	26	Don't worry about perfect grammar when you need to communicate something quickly! Focus on getting the main point across. We'll practice more complex sentences next time!
\.


--
-- Data for Name: messages_2026_02_06; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_06 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_07; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_07 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_08; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_08 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_09; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_09 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_10; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_10 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_11; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_11 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_02_12; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_02_12 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-12-25 11:03:15
20211116045059	2025-12-25 11:03:18
20211116050929	2025-12-25 11:03:20
20211116051442	2025-12-25 11:03:22
20211116212300	2025-12-25 11:03:25
20211116213355	2025-12-25 11:03:27
20211116213934	2025-12-25 11:03:29
20211116214523	2025-12-25 11:03:32
20211122062447	2025-12-25 11:03:34
20211124070109	2025-12-25 11:03:36
20211202204204	2025-12-25 11:03:38
20211202204605	2025-12-25 11:03:40
20211210212804	2025-12-25 11:03:47
20211228014915	2025-12-25 11:03:49
20220107221237	2025-12-25 11:03:51
20220228202821	2025-12-25 11:03:54
20220312004840	2025-12-25 11:03:56
20220603231003	2025-12-25 11:03:59
20220603232444	2025-12-25 11:04:01
20220615214548	2025-12-25 11:04:04
20220712093339	2025-12-25 11:04:06
20220908172859	2025-12-25 11:04:08
20220916233421	2025-12-25 11:04:10
20230119133233	2025-12-25 11:04:13
20230128025114	2025-12-25 11:04:16
20230128025212	2025-12-25 11:04:18
20230227211149	2025-12-25 11:04:20
20230228184745	2025-12-25 11:04:22
20230308225145	2025-12-25 11:04:24
20230328144023	2025-12-25 11:04:26
20231018144023	2025-12-25 11:04:29
20231204144023	2025-12-25 11:04:32
20231204144024	2025-12-25 11:04:34
20231204144025	2025-12-25 11:04:36
20240108234812	2025-12-25 11:04:39
20240109165339	2025-12-25 11:04:41
20240227174441	2025-12-25 11:04:45
20240311171622	2025-12-25 11:04:48
20240321100241	2025-12-25 11:04:52
20240401105812	2025-12-25 11:04:58
20240418121054	2025-12-25 11:05:01
20240523004032	2025-12-25 11:05:09
20240618124746	2025-12-25 11:05:11
20240801235015	2025-12-25 11:05:13
20240805133720	2025-12-25 11:05:15
20240827160934	2025-12-25 11:05:17
20240919163303	2025-12-25 11:05:20
20240919163305	2025-12-25 11:05:23
20241019105805	2025-12-25 11:05:25
20241030150047	2025-12-25 11:05:33
20241108114728	2025-12-25 11:05:36
20241121104152	2025-12-25 11:05:38
20241130184212	2025-12-25 11:05:40
20241220035512	2025-12-25 11:05:43
20241220123912	2025-12-25 11:05:45
20241224161212	2025-12-25 11:05:47
20250107150512	2025-12-25 11:05:49
20250110162412	2025-12-25 11:05:51
20250123174212	2025-12-25 11:05:53
20250128220012	2025-12-25 11:05:55
20250506224012	2025-12-25 11:05:57
20250523164012	2025-12-25 11:05:59
20250714121412	2025-12-25 11:06:01
20250905041441	2025-12-25 11:06:04
20251103001201	2025-12-25 11:06:06
20251120212548	2026-02-03 22:18:57
20251120215549	2026-02-03 22:18:57
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-25 11:03:09.909547
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-25 11:03:09.942182
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-25 11:03:09.976975
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-25 11:03:10.036029
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-25 11:03:10.042301
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-25 11:03:10.0602
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-25 11:03:10.066813
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-25 11:03:10.089768
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-25 11:03:10.097765
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-25 11:03:10.104094
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-25 11:03:10.110799
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-25 11:03:10.136154
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-25 11:03:10.143612
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-25 11:03:10.151829
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-25 11:03:10.157854
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-25 11:03:10.166087
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-25 11:03:10.172691
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-25 11:03:10.181282
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-25 11:03:10.200297
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-25 11:03:10.214634
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-25 11:03:10.221304
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-25 11:03:10.228355
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-25 11:03:10.648109
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-12-25 11:03:10.729797
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-12-25 11:03:10.7379
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-12-25 11:03:10.756278
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-12-25 11:03:10.762782
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2025-12-25 11:03:10.790206
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2025-12-25 11:03:09.948348
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2025-12-25 11:03:10.049456
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2025-12-25 11:03:10.074626
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2025-12-25 11:03:10.08306
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2025-12-25 11:03:10.234791
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2025-12-25 11:03:10.250191
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2025-12-25 11:03:10.553067
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2025-12-25 11:03:10.56748
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2025-12-25 11:03:10.576369
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2025-12-25 11:03:10.584151
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2025-12-25 11:03:10.592123
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2025-12-25 11:03:10.600566
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2025-12-25 11:03:10.602893
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2025-12-25 11:03:10.610461
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2025-12-25 11:03:10.622413
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2025-12-25 11:03:10.656091
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2025-12-25 11:03:10.666495
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2025-12-25 11:03:10.673877
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2025-12-25 11:03:10.693022
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2025-12-25 11:03:10.715185
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2025-12-25 11:03:10.72289
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2025-12-25 11:03:10.770792
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-02-06 01:53:03.871801
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-02-06 01:53:04.252719
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-02-06 01:53:04.254458
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-02-06 01:53:04.370226
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-02-06 01:53:04.374337
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-02-06 01:53:04.375964
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-02-09 00:31:44.771389
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 410, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 3300, true);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


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
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


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
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (code);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: sentry_sessions sentry_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentry_sessions
    ADD CONSTRAINT sentry_sessions_pkey PRIMARY KEY (id);


--
-- Name: sentry_sessions sentry_sessions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentry_sessions
    ADD CONSTRAINT sentry_sessions_user_id_key UNIQUE (user_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: transcripts transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: user_progress user_progress_user_id_topic_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_topic_id_key UNIQUE (user_id, topic_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_06 messages_2026_02_06_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_06
    ADD CONSTRAINT messages_2026_02_06_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_07 messages_2026_02_07_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_07
    ADD CONSTRAINT messages_2026_02_07_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_08 messages_2026_02_08_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_08
    ADD CONSTRAINT messages_2026_02_08_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_09 messages_2026_02_09_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_09
    ADD CONSTRAINT messages_2026_02_09_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_10 messages_2026_02_10_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_10
    ADD CONSTRAINT messages_2026_02_10_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_11 messages_2026_02_11_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_11
    ADD CONSTRAINT messages_2026_02_11_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_02_12 messages_2026_02_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_02_12
    ADD CONSTRAINT messages_2026_02_12_pkey PRIMARY KEY (id, inserted_at);


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
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


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
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


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
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_contact_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_messages_created_at ON public.contact_messages USING btree (created_at DESC);


--
-- Name: idx_contact_messages_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_messages_status ON public.contact_messages USING btree (status);


--
-- Name: idx_contact_messages_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_messages_type ON public.contact_messages USING btree (message_type);


--
-- Name: idx_profiles_system_admin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_system_admin ON public.profiles USING btree (is_system_admin) WHERE (is_system_admin = true);


--
-- Name: sessions_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_created_at_idx ON public.sessions USING btree (created_at DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_06_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_06_inserted_at_topic_idx ON realtime.messages_2026_02_06 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_07_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_07_inserted_at_topic_idx ON realtime.messages_2026_02_07 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_08_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_08_inserted_at_topic_idx ON realtime.messages_2026_02_08 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_09_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_09_inserted_at_topic_idx ON realtime.messages_2026_02_09 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_10_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_10_inserted_at_topic_idx ON realtime.messages_2026_02_10 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_11_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_11_inserted_at_topic_idx ON realtime.messages_2026_02_11 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_02_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_02_12_inserted_at_topic_idx ON realtime.messages_2026_02_12 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: messages_2026_02_06_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_06_inserted_at_topic_idx;


--
-- Name: messages_2026_02_06_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_06_pkey;


--
-- Name: messages_2026_02_07_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_07_inserted_at_topic_idx;


--
-- Name: messages_2026_02_07_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_07_pkey;


--
-- Name: messages_2026_02_08_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_08_inserted_at_topic_idx;


--
-- Name: messages_2026_02_08_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_08_pkey;


--
-- Name: messages_2026_02_09_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_09_inserted_at_topic_idx;


--
-- Name: messages_2026_02_09_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_09_pkey;


--
-- Name: messages_2026_02_10_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_10_inserted_at_topic_idx;


--
-- Name: messages_2026_02_10_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_10_pkey;


--
-- Name: messages_2026_02_11_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_11_inserted_at_topic_idx;


--
-- Name: messages_2026_02_11_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_11_pkey;


--
-- Name: messages_2026_02_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_02_12_inserted_at_topic_idx;


--
-- Name: messages_2026_02_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_02_12_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: profiles tr_protect_profile_columns; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_protect_profile_columns BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();


--
-- Name: profiles tr_reset_daily_usage; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_reset_daily_usage BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.reset_daily_usage();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: contact_messages contact_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: coupons coupons_used_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_used_by_fkey FOREIGN KEY (used_by) REFERENCES public.profiles(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: sentry_sessions sentry_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentry_sessions
    ADD CONSTRAINT sentry_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: transcripts transcripts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- Name: transcripts transcripts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: coupons Admin can manage all coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can manage all coupons" ON public.coupons USING (((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text));


--
-- Name: profiles Admin can update all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can update all profiles" ON public.profiles FOR UPDATE USING (((auth.uid() = id) OR ((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text)));


--
-- Name: profiles Admin can view all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT USING (((auth.uid() = id) OR ((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text)));


--
-- Name: user_progress Admin can view all progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can view all progress" ON public.user_progress FOR SELECT USING (((auth.uid() = user_id) OR ((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text)));


--
-- Name: profiles Admin manage all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin manage all profiles" ON public.profiles TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: contact_messages Admins can update contact messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text));


--
-- Name: contact_messages Admins can view contact messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (((auth.jwt() ->> 'email'::text) = 'paulofernandoautomacao@gmail.com'::text));


--
-- Name: contact_messages Anyone can insert contact messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);


--
-- Name: organizations Members can view their own organization; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Members can view their own organization" ON public.organizations FOR SELECT USING ((id IN ( SELECT profiles.organization_id
   FROM public.profiles
  WHERE (profiles.id = auth.uid()))));


--
-- Name: coupons Public Read Coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);


--
-- Name: profiles Super Admin Access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super Admin Access" ON public.profiles TO authenticated USING ((public.is_super_admin() OR (auth.uid() = id)));


--
-- Name: coupons Super Admin Manage Coupons; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super Admin Manage Coupons" ON public.coupons TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: transcripts Users can insert own transcripts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own transcripts" ON public.transcripts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: sessions Users can insert their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own sessions" ON public.sessions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: sentry_sessions Users can insert/update their own session; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert/update their own session" ON public.sentry_sessions USING ((auth.uid() = user_id));


--
-- Name: user_progress Users can modify own progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can modify own progress" ON public.user_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can select their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can select their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_progress Users can update own progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own progress" ON public.user_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: sessions Users can update their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own sessions" ON public.sessions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: user_progress Users can view own progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: transcripts Users can view own transcripts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own transcripts" ON public.transcripts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: sentry_sessions Users can view their own session; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own session" ON public.sentry_sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: sessions Users can view their own sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own sessions" ON public.sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: contact_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: coupons; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: sentry_sessions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sentry_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: transcripts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

--
-- Name: user_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime profiles; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.profiles;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION increment_user_metrics(user_id uuid, inc_minutes double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision) TO anon;
GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision) TO authenticated;
GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision) TO service_role;


--
-- Name: FUNCTION increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer) TO anon;
GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer) TO authenticated;
GRANT ALL ON FUNCTION public.increment_user_metrics(user_id uuid, inc_minutes double precision, inc_words integer) TO service_role;


--
-- Name: FUNCTION is_super_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_super_admin() TO anon;
GRANT ALL ON FUNCTION public.is_super_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_super_admin() TO service_role;


--
-- Name: FUNCTION protect_profile_columns(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.protect_profile_columns() TO anon;
GRANT ALL ON FUNCTION public.protect_profile_columns() TO authenticated;
GRANT ALL ON FUNCTION public.protect_profile_columns() TO service_role;


--
-- Name: FUNCTION redeem_coupon(p_code text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.redeem_coupon(p_code text) TO anon;
GRANT ALL ON FUNCTION public.redeem_coupon(p_code text) TO authenticated;
GRANT ALL ON FUNCTION public.redeem_coupon(p_code text) TO service_role;


--
-- Name: FUNCTION reset_daily_usage(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.reset_daily_usage() TO anon;
GRANT ALL ON FUNCTION public.reset_daily_usage() TO authenticated;
GRANT ALL ON FUNCTION public.reset_daily_usage() TO service_role;


--
-- Name: FUNCTION sync_user_usage(p_minutes double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sync_user_usage(p_minutes double precision) TO anon;
GRANT ALL ON FUNCTION public.sync_user_usage(p_minutes double precision) TO authenticated;
GRANT ALL ON FUNCTION public.sync_user_usage(p_minutes double precision) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE contact_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contact_messages TO anon;
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO service_role;


--
-- Name: TABLE coupons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.coupons TO anon;
GRANT ALL ON TABLE public.coupons TO authenticated;
GRANT ALL ON TABLE public.coupons TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE transcripts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transcripts TO anon;
GRANT ALL ON TABLE public.transcripts TO authenticated;
GRANT ALL ON TABLE public.transcripts TO service_role;


--
-- Name: TABLE investor_user_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.investor_user_metrics TO anon;
GRANT ALL ON TABLE public.investor_user_metrics TO authenticated;
GRANT ALL ON TABLE public.investor_user_metrics TO service_role;


--
-- Name: TABLE organizations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.organizations TO anon;
GRANT ALL ON TABLE public.organizations TO authenticated;
GRANT ALL ON TABLE public.organizations TO service_role;


--
-- Name: TABLE sentry_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sentry_sessions TO anon;
GRANT ALL ON TABLE public.sentry_sessions TO authenticated;
GRANT ALL ON TABLE public.sentry_sessions TO service_role;


--
-- Name: TABLE sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sessions TO anon;
GRANT ALL ON TABLE public.sessions TO authenticated;
GRANT ALL ON TABLE public.sessions TO service_role;


--
-- Name: TABLE user_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_progress TO anon;
GRANT ALL ON TABLE public.user_progress TO authenticated;
GRANT ALL ON TABLE public.user_progress TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_02_06; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_06 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_06 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_07; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_07 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_07 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_08; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_08 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_08 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_09; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_09 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_09 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_10; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_10 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_10 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_11; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_11 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_11 TO dashboard_user;


--
-- Name: TABLE messages_2026_02_12; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_02_12 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_02_12 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict 4D0mNVeRbgsUv0QKh2B3WoI0Ei9zn9SjH4UTosHIlncqnyVRj82d0d6o25cZ3To

