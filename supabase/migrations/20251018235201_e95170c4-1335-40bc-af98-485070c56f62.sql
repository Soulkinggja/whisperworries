-- Add attachment_url column to conversation_messages table
ALTER TABLE conversation_messages 
ADD COLUMN attachment_url text;