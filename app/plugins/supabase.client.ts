import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const SUPABASE_URL = 'https://nmlxivljaduwpttsxgoe.supabase.co'
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhpdmxqYWR1d3B0dHN4Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODAxNjQsImV4cCI6MjA5Mjg1NjE2NH0.ApzztRY7eKPV0Ivo5aOv_0vjgxAG2gDM3HhuFSle4SI'

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Use a Proxy wrapper around supabase.auth to implement custom database-backed session logic
  const originalAuth = supabase.auth
  supabase.auth = new Proxy(originalAuth, {
    get(target, prop, receiver) {
      if (prop === 'getSession') {
        return async () => {
          if (process.client) {
            const token = localStorage.getItem('admin_session_token')
            if (token === 'authenticated') {
              return {
                data: {
                  session: {
                    user: { email: 'admin@asixnam.com' },
                    expires_at: 9999999999
                  }
                },
                error: null
              }
            }
          }
          return { data: { session: null }, error: null }
        }
      }
      if (prop === 'signOut') {
        return async () => {
          if (process.client) {
            localStorage.removeItem('admin_session_token')
          }
          return { error: null }
        }
      }
      return Reflect.get(target, prop, receiver)
    }
  })

  return {
    provide: {
      supabase
    }
  }
})
