const fs = require('fs')
const path = require('path')

const JUNK_PATTERNS = [
  /^Discover More About/i,
  /^Fun Fact/i,
  /^St\.?\s+\w+ Prayer/i,
  /Enjoy additional prayers/i,
  /click here/i,
  /^In His Footsteps:/i,
  /^Prayer:/i,
  /^Novena for/i,
  /^Saint \w+.*pray for/i,
  /^St\.?\s+\w+.*pray for/i,
  /^Amen\.?\s*$/i,
  /^Has a song ever moved you/i,
  /^How does one qualify/i,
  /^There is much we still wish/i,
  /^We celebrate two feast/i,
  /^Please consider contacting/i,
  /^Try to see your community/i,
  /^Welcome any newcomers/i,
  /^Put your whole heart/i,
  /^What does Jesus want/i,
  /^Have you ever felt/i,
  /\bApocryphal Date\b/i,
  /\bApocryphal date\b/i,
  /^In art, Joseph/i,
  /^Joseph is also patron/i,
  /^Many places and churches/i,
  /^Joseph is considered/i,
  /^Joseph is the patron/i,
  /^According to the Catholic Encyclopedia/i,
]

function cleanBio(bio) {
  if (!bio) return bio
  const lines = bio.split('\n')
  const cleaned = lines.filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    return !JUNK_PATTERNS.some((p) => p.test(trimmed))
  })
  return cleaned.join('\n')
}

const src = path.join(__dirname, '..', 'saints_scraped.json')
const dest = path.join(__dirname, '..', 'public', 'saints.json')
const raw = fs.readFileSync(src, 'utf-8')
const data = JSON.parse(raw)

let changed = 0
for (const saint of data) {
  const original = saint.full_bio
  const cleaned = cleanBio(original)
  if (cleaned !== original) {
    saint.full_bio = cleaned
    changed++
  }
}

fs.writeFileSync(src, JSON.stringify(data, null, 2), 'utf-8')
fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf-8')
console.log(`Cleaned ${changed} bios. Written to saints_scraped.json and public/saints.json`)
