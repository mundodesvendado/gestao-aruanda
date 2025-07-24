@@ .. @@
 -- Enable RLS on all tables
 ALTER TABLE temples ENABLE ROW LEVEL SECURITY;
 ALTER TABLE users ENABLE ROW LEVEL SECURITY;
 ALTER TABLE mediums ENABLE ROW LEVEL SECURITY;
 ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
 ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
 ALTER TABLE events ENABLE ROW LEVEL SECURITY;
 ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
 ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
+ALTER TABLE smtp_config ENABLE ROW LEVEL SECURITY;

 -- Policies for temples table
 CREATE POLICY "Master admin can manage all temples"
@@ -200,6 +201,11 @@ CREATE POLICY "Temple admins can manage subscriptions"
   ON subscriptions
   FOR ALL
   TO authenticated
   USING (temple_id IN (SELECT temple_id FROM users WHERE id = auth.uid() AND role IN ('temple_admin', 'master_admin')));

+-- Policies for smtp_config table
+CREATE POLICY "Master admin can manage SMTP config"
+  ON smtp_config
+  FOR ALL
+  TO authenticated
+  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'master_admin'));
+
 -- Create updated_at trigger function
 CREATE OR REPLACE FUNCTION update_updated_at_column()
 RETURNS TRIGGER AS $$