-- Create table for pass verification history
CREATE TABLE public.pass_verification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pass_id TEXT NOT NULL,
  pass_number TEXT,
  person_name TEXT,
  person_type TEXT CHECK (person_type IN ('estudante', 'professor', 'funcionario')),
  verification_status TEXT CHECK (verification_status IN ('valid', 'expired', 'invalid', 'error')) NOT NULL,
  verification_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  location_name TEXT,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_pass_verification_logs_pass_id ON public.pass_verification_logs(pass_id);
CREATE INDEX idx_pass_verification_logs_verified_at ON public.pass_verification_logs(verified_at DESC);
CREATE INDEX idx_pass_verification_logs_verification_code ON public.pass_verification_logs(verification_code);

-- Enable Row Level Security
ALTER TABLE public.pass_verification_logs ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for logging verifications from public page)
CREATE POLICY "Allow public inserts for verification logs"
ON public.pass_verification_logs
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users (admins/secretaries) to view all logs
CREATE POLICY "Authenticated users can view verification logs"
ON public.pass_verification_logs
FOR SELECT
TO authenticated
USING (true);

-- Add comment to table
COMMENT ON TABLE public.pass_verification_logs IS 'Stores history of pass QR code verifications';