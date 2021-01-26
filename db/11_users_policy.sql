DROP POLICY IF EXISTS users_policy
  ON public.users;

-- Users Policy:
-- * only superadmin can write all rows
-- * any other use can only write their own row
-- * only logged-in users can read user data
CREATE POLICY users_policy
  ON public.users
  AS PERMISSIVE
  FOR ALL
  USING auth.role() = ANY (ARRAY['superadmin', 'admin', 'authenticated']))
  WITH CHECK (auth.uid() = id OR auth.role() == 'superadmin');
