import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://qzvhlhggjdldfplxvioh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dmhsaGdnamRsZGZwbHh2aW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODAzNDgsImV4cCI6MjA5NzQ1NjM0OH0.zaNCwy2XRSKxnMSEqyy_yhxNkUwVJGWIvHUyaXK_aj4'

const supabase = createClient(supabaseUrl, supabaseKey)

const saints = JSON.parse(readFileSync('public/saints.json', 'utf-8'))

const BATCH = 200
let done = 0

for (let i = 0; i < saints.length; i += BATCH) {
  const batch = saints.slice(i, i + BATCH)
  const { error } = await supabase.from('saints').insert(batch.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type || 'saint',
    feast_day: s.feast_day || null,
    patronage: s.patronage || [],
    short_bio: s.short_bio || null,
    full_bio: s.full_bio || null,
    symbols: s.symbols || [],
    image_url: s.image_url || null,
    death_year: s.death_year ?? null,
    origin_country: s.origin_country || null,
  })), { onConflict: 'id' })

  if (error) {
    console.error('Error at batch', i, error)
    process.exit(1)
  }

  done += batch.length
  console.log(`Imported ${done}/${saints.length}`)
}

console.log('Done!')
