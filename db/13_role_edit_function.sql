DROP FUNCTION edit_role(id text, role text);
DROP FUNCTION edit_role(uid text, new_role text);

CREATE OR REPLACE FUNCTION edit_role(uuid uuid, new_role text)
RETURNS text as $$
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
$$ LANGUAGE plpgsql;