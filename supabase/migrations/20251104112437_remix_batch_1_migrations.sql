
-- Migration: 20251104093457

-- Migration: 20251103203404

-- Migration: 20251103195827

-- Migration: 20251103194745
-- Create sheets table to store metadata
CREATE TABLE public.sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_name TEXT NOT NULL,
  hall_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  total_rows INTEGER DEFAULT 0 NOT NULL
);

-- Create sheet_data table to store individual donor records
CREATE TABLE public.sheet_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id UUID REFERENCES public.sheets(id) ON DELETE CASCADE NOT NULL,
  serial_no TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  department TEXT NOT NULL,
  donation_count TEXT DEFAULT '1' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sheet_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a certificate generation tool)
-- Anyone can view sheets
CREATE POLICY "Anyone can view sheets"
ON public.sheets
FOR SELECT
USING (true);

-- Anyone can insert sheets
CREATE POLICY "Anyone can insert sheets"
ON public.sheets
FOR INSERT
WITH CHECK (true);

-- Anyone can update sheets
CREATE POLICY "Anyone can update sheets"
ON public.sheets
FOR UPDATE
USING (true);

-- Anyone can delete sheets
CREATE POLICY "Anyone can delete sheets"
ON public.sheets
FOR DELETE
USING (true);

-- Anyone can view sheet data
CREATE POLICY "Anyone can view sheet_data"
ON public.sheet_data
FOR SELECT
USING (true);

-- Anyone can insert sheet data
CREATE POLICY "Anyone can insert sheet_data"
ON public.sheet_data
FOR INSERT
WITH CHECK (true);

-- Anyone can update sheet data
CREATE POLICY "Anyone can update sheet_data"
ON public.sheet_data
FOR UPDATE
USING (true);

-- Anyone can delete sheet data
CREATE POLICY "Anyone can delete sheet_data"
ON public.sheet_data
FOR DELETE
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_sheets_updated_at
BEFORE UPDATE ON public.sheets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sheet_data_updated_at
BEFORE UPDATE ON public.sheet_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_sheet_data_sheet_id ON public.sheet_data(sheet_id);
CREATE INDEX idx_sheets_created_at ON public.sheets(created_at DESC);
CREATE INDEX idx_sheet_data_blood_group ON public.sheet_data(blood_group);



-- Migration: 20251103205511
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for sheets table
DROP POLICY IF EXISTS "Anyone can view sheets" ON public.sheets;
DROP POLICY IF EXISTS "Anyone can insert sheets" ON public.sheets;
DROP POLICY IF EXISTS "Anyone can update sheets" ON public.sheets;
DROP POLICY IF EXISTS "Anyone can delete sheets" ON public.sheets;

CREATE POLICY "Admins can manage sheets"
ON public.sheets FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for sheet_data table
DROP POLICY IF EXISTS "Anyone can view sheet_data" ON public.sheet_data;
DROP POLICY IF EXISTS "Anyone can insert sheet_data" ON public.sheet_data;
DROP POLICY IF EXISTS "Anyone can update sheet_data" ON public.sheet_data;
DROP POLICY IF EXISTS "Anyone can delete sheet_data" ON public.sheet_data;

CREATE POLICY "Admins can manage sheet_data"
ON public.sheet_data FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for profiles (users can view their own)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- RLS policies for user_roles (users can view their own roles)
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251104082531
-- Update RLS policies to allow any authenticated user (not just admins)

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admins can manage sheets" ON public.sheets;
DROP POLICY IF EXISTS "Admins can manage sheet_data" ON public.sheet_data;

-- Create new policies for any authenticated user
CREATE POLICY "Authenticated users can manage sheets"
ON public.sheets
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sheet_data"
ON public.sheet_data
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

