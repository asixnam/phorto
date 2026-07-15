import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const SUPABASE_URL = 'https://nmlxivljaduwpttsxgoe.supabase.co'
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhpdmxqYWR1d3B0dHN4Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODAxNjQsImV4cCI6MjA5Mjg1NjE2NH0.ApzztRY7eKPV0Ivo5aOv_0vjgxAG2gDM3HhuFSle4SI'

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  return {
    provide: {
      supabase
    }
  }
})
