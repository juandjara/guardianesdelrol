DROP POLICY IF EXISTS users_policy
  ON public.users;

-- Users Policy:
-- * only superadmin can read/write all rows
-- * any other use can only read/write their own row
CREATE POLICY users_policy
  ON public.users
  AS PERMISSIVE
  FOR ALL
  USING (auth.uid() = id OR is_superadmin(auth.uid()));
