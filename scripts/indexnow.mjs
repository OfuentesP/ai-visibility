// Submits all site URLs to IndexNow (Bing + partners).
// Usage: node scripts/indexnow.mjs
// Run after any deploy that adds or changes pages.

const KEY = '7f3b9c2d1e4a8f05b6c3d7e2a4f1b9e0'
const HOST = 'ai-visibility.cl'

const urls = [
  'https://ai-visibility.cl/',
  'https://ai-visibility.cl/auditar/',
  'https://ai-visibility.cl/glosario/',
  'https://ai-visibility.cl/glosario/share-of-model/',
  'https://ai-visibility.cl/glosario/geo/',
  'https://ai-visibility.cl/glosario/alucinacion-ia/',
  'https://ai-visibility.cl/glosario/rag/',
  'https://ai-visibility.cl/glosario/auditoria-arquetipos/',
  'https://ai-visibility.cl/glosario/llm/',
  'https://ai-visibility.cl/glosario/aeo/',
  'https://ai-visibility.cl/glosario/seo/',
  'https://ai-visibility.cl/auditar/saas/',
  'https://ai-visibility.cl/auditar/retail/',
  'https://ai-visibility.cl/auditar/salud/',
]

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

console.log(`IndexNow → ${res.status} ${res.statusText}`)
if (res.status !== 200 && res.status !== 202) {
  const text = await res.text()
  console.error(text)
  process.exit(1)
}
