import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nmlxivljaduwpttsxgoe.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbHhpdmxqYWR1d3B0dHN4Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODAxNjQsImV4cCI6MjA5Mjg1NjE2NH0.ApzztRY7eKPV0Ivo5aOv_0vjgxAG2gDM3HhuFSle4SI'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function main() {
  console.log("Listing buckets...")
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets()
  if (bucketsErr) {
    console.error("Error listing buckets:", bucketsErr)
  } else {
    console.log("Buckets:", buckets)
  }
  
  console.log("Trying to get bucket 'uploads'...")
  const { data: bucket, error: bucketErr } = await supabase.storage.getBucket('uploads')
  if (bucketErr) {
    console.log("Bucket 'uploads' doesn't exist or is inaccessible:", bucketErr.message)
    console.log("Attempting to create public bucket 'uploads'...")
    const { data: newBucket, error: createErr } = await supabase.storage.createBucket('uploads', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })
    if (createErr) {
      console.error("Error creating bucket:", createErr)
    } else {
      console.log("Created bucket:", newBucket)
    }
  } else {
    console.log("Bucket 'uploads' details:", bucket)
  }
}

main().catch(console.error)
