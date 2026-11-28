// Anchored Verse: check-ins (web and app) and the daily reminder (App Store app, with a stand-in for the phone).
// Run: npm run build && node tests/app.cjs dist
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/npm-tools/node_modules/playwright')
const http = require('http'), fs = require('fs'), path = require('path')
const DIST = path.resolve(process.argv[2] || 'dist'), OUT = process.argv[3]
const T = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' }
let fails = 0, n = 0
const check = (name, ok, extra) => { n++; if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || !extra ? '' : '  → ' + extra)) }
const server = http.createServer((q, r) => { let f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html'); r.setHeader('Content-Type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r) })
server.listen(0, async () => {
  const base = 'http://localhost:' + server.address().port + '/'
  const browser = await chromium.launch()
  const open = async ({ app = false, denied = false, seed, width = 390 } = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true })
    await ctx.addInitScript(([app, denied, seed]) => {
      try { if (seed && !localStorage.getItem('av_seeded')) { localStorage.setItem('av_checkins', JSON.stringify(seed)); localStorage.setItem('av_seeded', '1') } localStorage.setItem('av_a2hs_seen', app ? '' : '1'); if (app) localStorage.removeItem('av_a2hs_seen') } catch (e) {}
      if (app) {
        window.__AV_TEST_NATIVE__ = true
        const st = { enabled: false, time: '07:30', denied: false }; window.__calls = []
        window.__AV_TEST_REMINDERS__ = {
          getState: async () => ({ ...st }),
          save: async (x) => { window.__calls.push(['save', x]); if (x.enabled && denied) throw new Error('denied'); Object.assign(st, x); return { ...st, denied: false } },
          test: async () => { window.__calls.push(['test']) },
        }
      }
    }, [app, denied, seed])
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
    await page.goto(base); await page.waitForTimeout(1600)
    return { ctx, page, errs, text: () => page.locator('body').innerText(), wide: () => page.evaluate(() => document.documentElement.scrollWidth - innerWidth), shot: async (name) => { if (OUT) await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true }) } }
  }
  const ymd = (off) => { const d = new Date(); d.setDate(d.getDate() - off); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
  try {
    // 1. Website: no check-ins yet, no reminder, the Home Screen link is there
    let v = await open(); let t = await v.text()
    check('website: nothing about check-ins or reminders before the first visit', !/Your check-ins/.test(t) && !/Daily check-in reminder/.test(t) && /Add to Home Screen/.test(t) && /More apps/.test(t))
    await v.page.getByText('Anxious', { exact: true }).first().click({ force: true }); await v.page.waitForTimeout(900)
    const ref = await v.page.locator('.av-ref').innerText()
    await v.page.getByRole('button', { name: /All feelings/ }).click(); await v.page.waitForTimeout(500); t = await v.text()
    check('opening a feeling writes one check-in with today, the feeling and its verse', /Your check-ins/.test(t) && /Today/.test(t) && (await v.page.locator('.av-checkin').count()) === 1 && (await v.page.locator('.av-checkin').innerText()).includes(ref.split('\n')[0].replace(/BSB$/, '').trim()), ref)
    await v.page.getByText('Anxious', { exact: true }).first().click({ force: true }); await v.page.waitForTimeout(700); await v.page.getByRole('button', { name: /All feelings/ }).click(); await v.page.waitForTimeout(400)
    check('the same feeling on the same day stays one check-in', (await v.page.locator('.av-checkin').count()) === 1)
    check('website: no page errors, nothing off the side', v.errs.length === 0 && (await v.wide()) <= 0, v.errs.join(' | '))
    const stored = await v.page.evaluate(() => JSON.parse(localStorage.getItem('av_checkins')))
    check('check-ins are kept on the device as day + feeling + reference only', stored.length === 1 && Object.keys(stored[0]).sort().join() === 'd,e,ref')
    await v.ctx.close()

    // 2. A week of history: the seven-day strip, the full list, return to a verse, erase
    const seed = [{ d: ymd(0), e: 'grateful', ref: 'Psalm 107:1' }, { d: ymd(1), e: 'anxious', ref: 'Philippians 4:6-7' }, { d: ymd(1), e: 'weary', ref: 'Matthew 11:28' }, { d: ymd(3), e: 'lonely', ref: 'Psalm 68:6' }, { d: ymd(5), e: 'hopeful', ref: 'Romans 15:13' }, { d: ymd(9), e: 'angry', ref: 'James 1:19-20' }]
    v = await open({ seed }); t = await v.text()
    check('history: seven-day strip shows 4 active days, four latest rows, a link to all six', (await v.page.locator('.av-day').count()) === 7 && (await v.page.locator('.av-day-dots i:not(.none)').count()) === 5 && (await v.page.locator('main .av-checkin').count()) === 4 && /See all 6 check-ins/.test(t) && /Yesterday/.test(t))
    await v.shot('1-checkins')
    await v.page.getByRole('button', { name: /See all 6/ }).click(); await v.page.waitForTimeout(400)
    check('history sheet lists every check-in', (await v.page.locator('[role=dialog] .av-checkin').count()) === 6)
    await v.page.locator('[role=dialog] .av-checkin').nth(1).click(); await v.page.waitForTimeout(800); t = await v.text()
    check('tapping a check-in returns to that feeling', /All feelings/.test(t) && /Anxious/.test(t), t.slice(0, 80))
    await v.page.getByRole('button', { name: /All feelings/ }).click(); await v.page.waitForTimeout(400)
    check('returning to a past check-in writes no new one for another day', (await v.page.evaluate(() => JSON.parse(localStorage.getItem('av_checkins')).length)) === 6)
    await v.page.getByRole('button', { name: /See all 6/ }).click(); await v.page.waitForTimeout(300)
    await v.page.getByRole('button', { name: /Erase my check-ins/ }).click(); await v.page.waitForTimeout(200)
    check('erasing asks for a second tap', (await v.page.evaluate(() => JSON.parse(localStorage.getItem('av_checkins')).length)) === 6 && /Tap again to erase/.test(await v.text()))
    await v.page.getByRole('button', { name: /Tap again to erase/ }).click(); await v.page.waitForTimeout(400)
    check('second tap erases them all', (await v.page.evaluate(() => JSON.parse(localStorage.getItem('av_checkins')).length)) === 0 && !/Your check-ins/.test(await v.text()))
    await v.ctx.close()

    // 3. App Store app: reminder row, no Home Screen prompt, no link to the website's storefront
    v = await open({ app: true }); await v.page.waitForTimeout(1500); t = await v.text()
    check('app: reminder row shows Off; no Home Screen prompt or link; no More apps link', /Daily check-in reminder/.test(t) && /Turn on/.test(t) && !/Keep it one tap away/.test(t) && !/Add to Home Screen/.test(t) && !/More apps/.test(t) && /Privacy/.test(t))
    await v.page.locator('.av-remind').click(); await v.page.waitForTimeout(300)
    await v.page.locator('input[type=time]').fill('06:15'); await v.page.waitForTimeout(200)
    check('app: changing the time before turning it on schedules nothing', (await v.page.evaluate(() => window.__calls.length)) === 0 && /Remind me at 6:15 AM/.test(await v.text()))
    await v.shot('2-reminder-sheet')
    await v.page.getByRole('button', { name: /Remind me at 6:15 AM/ }).click(); await v.page.waitForTimeout(400); t = await v.text()
    check('app: turning it on saves the chosen time', JSON.stringify(await v.page.evaluate(() => window.__calls)) === JSON.stringify([['save', { enabled: true, time: '06:15' }]]) && /Turn the reminder off/.test(t) && /Send a test now/.test(t))
    await v.page.getByRole('button', { name: /Send a test now/ }).click(); await v.page.waitForTimeout(300)
    check('app: test notification is sent and confirmed', (await v.page.evaluate(() => window.__calls.at(-1)[0])) === 'test' && /Sent\. It arrives/.test(await v.text()))
    await v.page.locator('input[type=time]').fill('21:00'); await v.page.waitForTimeout(400)
    check('app: changing the time while on re-schedules at once', JSON.stringify(await v.page.evaluate(() => window.__calls.at(-1))) === JSON.stringify(['save', { enabled: true, time: '21:00' }]))
    await v.page.getByRole('button', { name: 'Close' }).click(); await v.page.waitForTimeout(300)
    check('app: the row now reads On with the time', /On, every day at 9:00 PM/.test(await v.text()))
    check('app: no page errors, nothing off the side', v.errs.length === 0 && (await v.wide()) <= 0, v.errs.join(' | '))
    await v.shot('3-app-home')
    await v.ctx.close()

    // 4. App: notifications refused in iOS Settings
    v = await open({ app: true, denied: true }); await v.page.waitForTimeout(1200)
    await v.page.locator('.av-remind').click(); await v.page.waitForTimeout(300)
    await v.page.getByRole('button', { name: /Remind me at/ }).click(); await v.page.waitForTimeout(400); t = await v.text()
    check('app: refused notifications explain where to turn them on, and the reminder stays off', /Notifications are turned off for Anchored Verse/.test(t) && /Remind me at/.test(t))
    await v.ctx.close()

    // 5. Small iPhone in the app
    v = await open({ app: true, seed, width: 320 }); await v.page.waitForTimeout(1200)
    check('app, small iPhone: nothing runs off the side', (await v.wide()) <= 0, String(await v.wide()))
    await v.ctx.close()
  } catch (e) { fails++; console.log('FAIL test crashed  → ' + e.message.split('\n')[0]) }
  await browser.close(); server.close()
  console.log(`\n${fails} failed of ${n}`); process.exit(fails ? 1 : 0)
})
