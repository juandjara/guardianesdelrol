-- Find an admin in the permissions table with the current id
CREATE OR REPLACE function is_admin(uid uuid)
  RETURNS boolean AS
$$
BEGIN
  RETURN (
    EXISTS(
      SELECT p.id FROM public.permissions p
      WHERE p.role = 'admin'::text
      AND p.id = uid
    )
  );
END
$$ LANGUAGE plpgsql IMMUTABLE;

-- Find a superadmin in the permissions table with the current id
CREATE OR REPLACE function is_superadmin(uid uuid)
  RETURNS boolean AS
$$
BEGIN
  RETURN (
    EXISTS(
      SELECT p.id FROM public.permissions p
      WHERE p.role = 'superadmin'::text
      AND p.id = uid
    )
  );
END
$$ LANGUAGE plpgsql IMMUTABLE;
