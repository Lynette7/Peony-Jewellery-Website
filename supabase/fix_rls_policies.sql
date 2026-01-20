
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Ensure users can view their own profile (this should already exist, but let's make sure)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Create a better admin policy that doesn't have circular dependency
-- Admins can view all profiles, but we check using a function
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT
  USING (
    -- Users can always view their own profile
    auth.uid() = id OR
    -- Admins can view any profile (checked via function to avoid circular dependency)
    public.is_user_admin(auth.uid())
  );

-- Update the admin update policy similarly
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR
    public.is_user_admin(auth.uid())
  );
