/*  ytmp4.js  –  Express router for SSvid.net  */
const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();
const WORKER  = 'https://ssvid.net/youtube-to-mp4';

const YT_REGEX =
/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;

/* ---------- route ---------- */
router.get('/api/ytmp4', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !YT_REGEX.test(videoUrl))
    return res
      .status(400)
      .json({
        creator: 'BLUE DEMON',
        status: 400,
        success: false,
        message: 'Please provide a valid YouTube URL.'
      });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    });
    const page = await ctx.newPage();

    /* ---- stealth ---- */
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    });
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    /* ---- load & retry ---- */
    await page.goto(WORKER, { waitUntil: 'domcontentloaded' });
    let attempts = 0;
    while (attempts < 3) {
      try {
        await page.waitForSelector('#search__input', { timeout: 10000 });
        break;
      } catch {
        attempts++;
        await page.reload({ waitUntil: 'domcontentloaded' });
      }
    }
    if (attempts === 3) throw new Error('#search__input never appeared');

    /* 1. search video */
    await page.fill('#search__input', videoUrl);
    await page.press('#search__input', 'Enter');
    await page.waitForSelector('a[href="#mp4"].active', { state: 'visible', timeout: 7000 });

    /* 2. metadata */
    const title     = (await page.locator('p.vtitle').textContent()).trim();
    const thumbnail = await page.locator('img[src*="ytimg.com"]').getAttribute('src');

    /* 3. qualities */
    const WANTED = ['MP4 - 1080p', 'MP4 - 720p', 'MP4 - 360p'];
    const rows   = await page.locator('tbody tr').all();
    const pool   = {};

    for (const r of rows) {
      const qual = (await r.locator('td').nth(0).textContent()).trim();
      if (WANTED.includes(qual)) {
        pool[qual] = {
          size   : (await r.locator('td').nth(1).textContent()).trim(),
          button : r.locator('button.btn-primary.btn-orange')
        };
      }
    }

    /* 4. convert each & grab link */
    const download_links = [];
    for (const [qual, data] of Object.entries(pool)) {
      await data.button.click();
      const dlBtn = await page.waitForSelector(
        'a[aria-label="Download file"][href^="https://dl"], a[aria-label="Download file"][href^="http"]',
        { state: 'visible', timeout: 30000 }
      );
      const href = await dlBtn.getAttribute('href');

      download_links.push({
        pixel : qual.replace('MP4 - ', ''),
        size  : data.size,
        link  : href
      });

      /* close modal */
      await page.locator('button.close[data-dismiss="modal"]').click();
      await page.waitForSelector('a[href="#mp4"].active', { state: 'visible', timeout: 7000 });
    }

    await browser.close();

    if (download_links.length === 0)
      return res.status(404).json({
        creator: 'BLUE DEMON',
        status: 404,
        success: false,
        message: 'No download links found.'
      });

    /* 5. final JSON */
    res.json({
      creator: 'BLUE DEMON',
      status: 200,
      success: true,
      title,
      thumbnail,
      download_links
    });

  } catch (err) {
    if (browser) await browser.close();
    console.error('❌ Error:', err.message);
    res.status(500).json({
      creator: 'BLUE DEMON',
      status: 500,
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

module.exports = router;
