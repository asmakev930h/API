/*  twitter.js  –  Playwright-free, always-stringified JSON  */
const express = require('express');
const https   = require('https');
const cheerio = require('cheerio');

const router = express.Router();

/* ---------- helpers ---------- */
const TWITTER_REGEX =
/^https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i;

function fetchHtml(url) {
  // URL must already be URL-encoded once
  const body =
    `id=${encodeURIComponent(url)}` +
    '&locale=en' +
    '&tt=2d26dcba5447a5f49c39fecfdd093a1a' +
    '&ts=1756819158' +
    '&source=form';

  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(
      {
        hostname: 'ssstwitter.com',
        path: '/',
        method: 'POST',
        headers: {
          'HX-Request': 'true',
          'HX-Target': 'target',
          'HX-Current-URL': 'https://ssstwitter.com/',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      res => {
        res.on('data', chunk => (data += chunk));
        res.on('end',  ()   => resolve(data));
      }
    );
    req.on('error', reject);
    req.end(body);
  });
}
/* ---------- route ---------- */
router.get('/api/twitterdl', async (req, res) => {
  const link = req.query.url;

  if (!link || !TWITTER_REGEX.test(link)) {
    return res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: 'BLUE DEMON',
          status: 400,
          success: false,
          message: 'Please provide a valid Twitter / X video URL.'
        },
        null,
        2
      )
    );
  }

  try {
    const html = await fetchHtml(link);
    const $    = cheerio.load(html);

    const downloads = {
      HD:  null,
      SD:  null,
      MP3: null
    };

    $('.download-btn').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.includes('720x1280')) downloads.HD  = $(el).attr('href');
      if (txt.includes('320x568'))  downloads.SD  = $(el).attr('href');
    });

    const mp3Route = $('#mp3_convert').attr('hx-post');
    if (mp3Route) downloads.MP3 = `https://ssstwitter.com${mp3Route}`;

    if (!downloads.HD && !downloads.SD) {
      return res.set("Content-Type", "application/json").send(
        JSON.stringify(
          {
            creator: 'BLUE DEMON',
            status: 404,
            success: false,
            message: 'No download links found.'
          },
          null,
          2
        )
      );
    }

    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: 'BLUE DEMON',
          status: 200,
          success: true,
          input_url: link,
          download_links: downloads
        },
        null,
        2
      )
    );

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.set("Content-Type", "application/json").send(
      JSON.stringify(
        {
          creator: 'BLUE DEMON',
          status: 500,
          success: false,
          message: 'Failed to fetch video links.',
          error: err.message
        },
        null,
        2
      )
    );
  }
});

module.exports = router;
