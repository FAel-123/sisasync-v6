// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://llqsrdvhoqrratinvilc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscXNyZHZob3FycmF0aW52aWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDE0MTIsImV4cCI6MjA4MjU3NzQxMn0.ZKkZAOiDp2hMrhZ5s9g4_w1w2bIthun0v9_sRnB-rbQ'

export const supabase = createClient(supabaseUrl, supabaseKey)