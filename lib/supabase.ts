import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqqidmtmjhmjtvkjocby.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcWlkbXRtamhtanR2a2pvY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDA3MDAsImV4cCI6MjA5NDY3NjcwMH0.xW-3sWRkdkgNbNQWGUF03ctQ08oCbtOQhL7DDSwgGSk'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)