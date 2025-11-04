-- Function to automatically assign donor role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign donor role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'donor');
  RETURN NEW;
END;
$$;

-- Trigger to assign donor role when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Update RLS policies for donors table to restrict availability updates
DROP POLICY IF EXISTS "Donors can update own profile" ON public.donors;
DROP POLICY IF EXISTS "Admins can update all donors" ON public.donors;

-- Donors can only update basic info (not status or availability)
CREATE POLICY "Donors can update own basic info"
  ON public.donors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    -- Ensure these fields are not being modified by donors
    status = (SELECT status FROM public.donors WHERE id = donors.id) AND
    medical_eligible = (SELECT medical_eligible FROM public.donors WHERE id = donors.id) AND
    COALESCE(availability_notes, '') = COALESCE((SELECT availability_notes FROM public.donors WHERE id = donors.id), '')
  );

-- Admins and volunteers can update everything
CREATE POLICY "Admins and volunteers can update all donor fields"
  ON public.donors FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'volunteer')
  );