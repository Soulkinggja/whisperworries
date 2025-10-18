-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create storage bucket for conversation attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('conversation-attachments', 'conversation-attachments', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for conversation attachments
CREATE POLICY "Conversation attachments are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'conversation-attachments');

CREATE POLICY "Users can upload conversation attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'conversation-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update profiles table with additional fields
ALTER TABLE profiles 
ADD COLUMN display_name text,
ADD COLUMN avatar_url text,
ADD COLUMN theme text DEFAULT 'system',
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Add RLS policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();