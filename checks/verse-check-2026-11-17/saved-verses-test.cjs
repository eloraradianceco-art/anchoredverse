const { chromium, devices } = require('playwright')
const http = require('http'), fs = require('fs'), path = require('path')
const dist = '/home/claude/anchoredverse/dist'
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = http.createServer((q, r) => { let p = path.join(dist, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html'); r.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r) })
;(async () => {
  await new Promise((ok) => srv.listen(4899, ok))
  const b = await chromium.launch(); const out = { errors: [] }
  for (const [name, dev] of [['phone', devices['iPhone 14']], ['ipad', devices['iPad Pro 11']]]) {
    const ctx = await b.newContext({ ...dev }); const page = await ctx.newPage()
    page.on('pageerror', (e) => out.errors.push(name + ': ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') out.errors.push(name + ' console: ' + m.text().slice(0, 160)) })
    await ctx.addInitScript(() => {
      if (!localStorage.getItem('av_a2hs_seen')) localStorage.setItem('av_a2hs_seen', '1')
      if (!localStorage.getItem('__seeded')) { localStorage.setItem('__seeded', '1'); localStorage.setItem('av_view', 'list'); localStorage.setItem('av_favorites', JSON.stringify([
        { key: 'repentant::Joel 2:13', emotionId: 'repentant', emotionName: 'Repentant', ref: 'Joel 2:13', text: 'old text with the Lord', translation: 'ESV', reflection: 'r' },
        { key: 'grieving::Psalm 30:5', emotionId: 'grieving', emotionName: 'Grieving', ref: 'Psalm 30:5', text: 'Weeping may endure for a night, but joy comes in the morning.', translation: 'NKJV', reflection: 'r' },
        { key: 'content::Psalm 23:1', emotionId: 'content', emotionName: 'Content', ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', translation: 'NKJV', reflection: 'r' },
        { key: 'gone::Nowhere 1:1', emotionId: 'gone', emotionName: 'Gone', ref: 'Nowhere 1:1', text: 'kept as is', translation: 'NIV' },
      ])) }
    })
    await page.goto('http://localhost:4899/'); await page.waitForTimeout(1200)
    const favs = await page.evaluate(() => JSON.parse(localStorage.getItem('av_favorites')))
    out[name] = { saved: favs.map((f) => [f.key, f.ref, f.text.slice(0, 60)]), savedRowsShown: await page.locator('.av-saved-row').count(), savedRefs: await page.locator('.av-saved-ref').allTextContents() }
    // open the Repentant feeling and find the Joel label in the verse list
    const btn = page.getByText('Repentant', { exact: true }).first()
    if (await btn.count()) { await btn.click(); await page.waitForTimeout(600); out[name].bodyHasJoelA = (await page.locator('body').innerText()).includes('Joel 2:13a') || null; out[name].firstRef = await page.locator('.av-ref').first().innerText().catch(() => null) }
    await page.screenshot({ path: `/home/claude/verse-check/smoke-${name}.png` })
    await ctx.close()
  }
  await b.close(); srv.close(); console.log(JSON.stringify(out, null, 1))
})()
