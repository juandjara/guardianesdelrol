-- TRIGGER ON INSERT
-- 1. inserts a row into public.users
CREATE OR REPLACE function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, '')
  on CONFLICT do NOTHING;
  return new;
end;
$$ language plpgsql security definer;

-- 2. trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
CREATE trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
