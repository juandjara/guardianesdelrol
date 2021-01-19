DROP POLICY IF EXISTS permissions_policy
  ON public.permissions;

-- Permissions Policy:
-- * everyone can read
-- * only superadmin can write
CREATE POLICY permissions_policy
  ON public.permissions
  AS PERMISSIVE
  FOR ALL
  USING (TRUE)
  WITH CHECK (is_superadmin(auth.uid()));
