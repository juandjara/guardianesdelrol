DROP VIEW users_with_permissions;
CREATE VIEW users_with_permissions AS 
  SELECT
    u.id, u.email, u.display_name, u.challengeable, bio, last_sign_in_at, avatar_type, 
    p.role FROM public.users u 
  LEFT JOIN public.permissions p
  ON u.id = p.id;