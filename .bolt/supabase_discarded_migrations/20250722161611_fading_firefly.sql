@@ .. @@
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

+-- SMTP Configuration table
+CREATE TABLE IF NOT EXISTS smtp_config (
+  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
+  host text NOT NULL,
+  port integer DEFAULT 587,
+  username text NOT NULL,
+  password text NOT NULL,
+  secure boolean DEFAULT false,
+  from_email text NOT NULL,
+  created_at timestamptz DEFAULT now(),
+  updated_at timestamptz DEFAULT now()
+);
+
+-- Enable RLS on smtp_config
+ALTER TABLE smtp_config ENABLE ROW LEVEL SECURITY;
+
+-- Only master admins can manage SMTP config
+CREATE POLICY "Master admin can manage SMTP config"
+  ON smtp_config
+  FOR ALL
+  TO authenticated
+  USING (EXISTS (
+    SELECT 1 FROM users 
+    WHERE users.id = auth.uid() 
+    AND users.role = 'master_admin'
+  ));
+
 -- Temples table
 CREATE TABLE IF NOT EXISTS temples (
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),