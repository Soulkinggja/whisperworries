-- Add voice preference column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN voice_preference text DEFAULT NULL;