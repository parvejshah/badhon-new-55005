-- Create donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  hall TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  last_donation_date DATE,
  donation_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  medical_eligible BOOLEAN NOT NULL DEFAULT true,
  availability_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blood_requests table
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_group_needed TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  hospital TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  urgency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  handled_by_volunteer_id UUID,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donation_date DATE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggested_donors table
CREATE TABLE public.suggested_donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  contacted BOOLEAN NOT NULL DEFAULT false,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(request_id, donor_id)
);

-- Enable RLS
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_donors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donors
CREATE POLICY "Anyone can view donors"
  ON public.donors FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create donors"
  ON public.donors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Donors can update own profile"
  ON public.donors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update all donors"
  ON public.donors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blood_requests
CREATE POLICY "Anyone can view blood requests"
  ON public.blood_requests FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create requests"
  ON public.blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update requests"
  ON public.blood_requests FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for donations
CREATE POLICY "Anyone can view donations"
  ON public.donations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create donations"
  ON public.donations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for suggested_donors
CREATE POLICY "Anyone can view suggested donors"
  ON public.suggested_donors FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage suggested donors"
  ON public.suggested_donors FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_donors_blood_group ON public.donors(blood_group);
CREATE INDEX idx_donors_status ON public.donors(status);
CREATE INDEX idx_donors_user_id ON public.donors(user_id);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status);
CREATE INDEX idx_blood_requests_blood_group ON public.blood_requests(blood_group_needed);
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_request_id ON public.donations(request_id);
CREATE INDEX idx_suggested_donors_request_id ON public.suggested_donors(request_id);

-- Create triggers for updated_at
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at
  BEFORE UPDATE ON public.blood_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();