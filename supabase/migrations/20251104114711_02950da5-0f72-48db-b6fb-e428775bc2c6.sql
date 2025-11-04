-- Add volunteer and donor roles to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'volunteer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'donor';