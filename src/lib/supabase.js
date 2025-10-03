import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nrjmprckblqizzdvqjba.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yam1wcmNrYmxxaXp6ZHZxamJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTczOTQsImV4cCI6MjA3MzI3MzM5NH0.iaYd4n9E2viKogWePXIqFXNRhQZCkL5tWC4TWmQUnVQ"   // Dashboard → Project Settings → API → anon key
export const supabase = createClient(supabaseUrl, supabaseKey)
