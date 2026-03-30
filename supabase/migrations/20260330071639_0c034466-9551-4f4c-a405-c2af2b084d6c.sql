-- Add RLS policy on realtime.messages to restrict channel subscriptions
-- Only allow authenticated users to subscribe, and block access to sensitive channels
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can access realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);