-- Add gender column to profiles table
ALTER TABLE public.profiles
ADD COLUMN gender TEXT;

-- Add gender column to journal_entries table for mood tracking context
ALTER TABLE public.journal_entries
ADD COLUMN gender TEXT;