DROP VIEW users_with_permissions;
CREATE VIEW users_with_permissions AS 
  SELECT u.*, p.role FROM public.users u 
  LEFT JOIN public.permissions p
  ON u.id = p.id;