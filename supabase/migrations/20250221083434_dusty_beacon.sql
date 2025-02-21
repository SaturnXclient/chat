/*
  # Add New Features

  1. New Tables
    - `user_achievements`
      - Track user accomplishments and badges
    - `user_stats`
      - Store user activity statistics
    - `encryption_logs`
      - Log encryption activities
    - `user_settings`
      - Store user preferences
    - `shared_keys`
      - Manage key sharing between users
    - `user_activity`
      - Track user engagement

  2. Security
    - Enable RLS on all new tables
    - Add policies for data access control
    - Add audit logging
*/

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  achievement_type text NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User Stats
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  messages_sent bigint DEFAULT 0,
  messages_received bigint DEFAULT 0,
  total_encryptions bigint DEFAULT 0,
  total_decryptions bigint DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  streak_days integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Encryption Logs
CREATE TABLE IF NOT EXISTS encryption_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  operation_type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE encryption_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own encryption logs"
  ON encryption_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  theme text DEFAULT 'cyber',
  notification_preferences jsonb DEFAULT '{}'::jsonb,
  privacy_settings jsonb DEFAULT '{}'::jsonb,
  ui_preferences jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Shared Keys
CREATE TABLE IF NOT EXISTS shared_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id),
  receiver_id uuid REFERENCES profiles(id),
  encrypted_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE shared_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their shared keys"
  ON shared_keys FOR ALL
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- User Activity
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  activity_type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add new columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'offline';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 0;

-- Functions
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_encryption_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO encryption_logs (user_id, operation_type, metadata)
  VALUES (auth.uid(), TG_ARGV[0], json_build_object('table', TG_TABLE_NAME));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER create_user_stats
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER log_message_encryption
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION log_encryption_activity('message_encryption');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_logs_user_id ON encryption_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id_timestamp ON user_activity(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_shared_keys_participants ON shared_keys(sender_id, receiver_id);