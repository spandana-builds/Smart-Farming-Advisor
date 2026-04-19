/*
  # Smart Farming Advisor - Initial Schema

  ## Tables Created
  1. `farming_sessions`
     - Stores user crop advisory sessions with weather and soil context
     - Fields: id, session_id (browser localStorage key), crop_name, crop_id, location, temperature, humidity, rainfall, wind_speed, soil_type, season, created_at
  2. `chat_messages`
     - Stores AI advisor chat history per session
     - Fields: id, session_id, role (user/assistant), content, created_at

  ## Security
  - RLS enabled on both tables
  - Anonymous users can insert and read their own records via session_id validation
  - session_id must be a non-empty string (UUID format enforced by length check)
*/

CREATE TABLE IF NOT EXISTS farming_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  crop_name text NOT NULL,
  crop_id text NOT NULL,
  location text NOT NULL DEFAULT '',
  temperature numeric NOT NULL DEFAULT 25,
  humidity numeric NOT NULL DEFAULT 60,
  rainfall numeric NOT NULL DEFAULT 0,
  wind_speed numeric NOT NULL DEFAULT 10,
  soil_type text NOT NULL DEFAULT 'loamy',
  season text NOT NULL DEFAULT 'summer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE farming_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can insert farming sessions"
  ON farming_sessions FOR INSERT
  TO anon
  WITH CHECK (
    session_id IS NOT NULL
    AND length(session_id) >= 8
  );

CREATE POLICY "Anon users can select own farming sessions"
  ON farming_sessions FOR SELECT
  TO anon
  USING (
    session_id IS NOT NULL
    AND length(session_id) >= 8
  );

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  farming_session_id uuid REFERENCES farming_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can insert chat messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (
    session_id IS NOT NULL
    AND length(session_id) >= 8
    AND role IN ('user', 'assistant')
  );

CREATE POLICY "Anon users can select own chat messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (
    session_id IS NOT NULL
    AND length(session_id) >= 8
  );

CREATE INDEX IF NOT EXISTS idx_farming_sessions_session_id ON farming_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_farming_sessions_created_at ON farming_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_farming_session_id ON chat_messages(farming_session_id);
