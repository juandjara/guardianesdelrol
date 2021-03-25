-- TRIGGER ON INSERT
-- 1. inserts a row into public.users
CREATE OR REPLACE function public.handle_new_user() 
returns trigger as $$
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
$$ language plpgsql security definer;

-- 2. trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
CREATE trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TRIGGER ON UPDATE
-- 1. updates public.users with last sign in time info
CREATE OR REPLACE function public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  update public.users 
  set last_sign_in_at = NEW.last_sign_in_at,
      email = md5(NEW.email),
      role = NEW.role
  where id = NEW.id;
  return NEW;
END;
$$ language plpgsql security definer;

-- 2. triggers the function every time auth.users is updated
DROP TRIGGER IF EXISTS on_auth_user_updated on auth.users;
CREATE trigger on_auth_user_updated
  BEFORE UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();

-- TRIGGER ON DELETE
-- 1. deletes a row from public.users
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.users WHERE OLD.id = id;
END;
$$ LANGUAGE plpgsql security definer;

-- 2. trigger the function every time a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_delete_user();
