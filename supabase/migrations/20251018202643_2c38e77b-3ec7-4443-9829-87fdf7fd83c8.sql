-- Create enum for invitation status
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');

-- Create friend_invitations table
CREATE TABLE public.friend_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_email TEXT NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status invitation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create friend_connections table
CREATE TABLE public.friend_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2),
  CONSTRAINT no_self_friendship CHECK (user_id_1 != user_id_2)
);

-- Enable RLS
ALTER TABLE public.friend_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friend_invitations
CREATE POLICY "Users can view invitations they sent or received"
  ON public.friend_invitations
  FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can create invitations"
  ON public.friend_invitations
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update invitations they received"
  ON public.friend_invitations
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- RLS Policies for friend_connections
CREATE POLICY "Users can view their own connections"
  ON public.friend_connections
  FOR SELECT
  USING (
    auth.uid() = user_id_1 OR 
    auth.uid() = user_id_2
  );

CREATE POLICY "Users can create connections"
  ON public.friend_connections
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id_1 OR 
    auth.uid() = user_id_2
  );

CREATE POLICY "Users can delete their own connections"
  ON public.friend_connections
  FOR DELETE
  USING (
    auth.uid() = user_id_1 OR 
    auth.uid() = user_id_2
  );

-- Add trigger for updated_at
CREATE TRIGGER update_friend_invitations_updated_at
  BEFORE UPDATE ON public.friend_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user profile by email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  RETURN user_uuid;
END;
$$;