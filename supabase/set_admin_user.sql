
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'ckaninimulandi@gmail.com';


SELECT 
  email,
  role,
  first_name,
  last_name
FROM user_profiles 
WHERE email = 'ckaninimulandi@gmail.com';
