/*  tiktok2.js  –  TikTokio API via HTTPS + Cheerio  */
const express = require('express');
const https   = require('https');
const cheerio = require('cheerio');

const router = express.Router();

/* -------------------------------------------------
   Helpers
-------------------------------------------------- */
const TIKTOK_REGEX =
/^https?:\/\/(?:www\.|m\.)?(?:tiktok\.com|vt\.tiktok\.com)\/.*$/i;

async function callTikTokio(rawUrl) {
  const body = new URLSearchParams({
    prefix: 'dtGslxrcdcG9raW8uY29t',
    vid:    rawUrl
  }).toString();

  const html = await new Promise((resolve, reject) => {
    let chunks = '';
    const req = https.request(
      {
        hostname : 'tiktokio.com',
        path     : '/api/v1/tk-htmx',
        method   : 'POST',
        headers  : {
          'HX-Request'      : 'true',
          'HX-Trigger'      : 'search-btn',
          'HX-Target'       : 'tiktok-parse-result',
          'HX-Current-URL'  : 'https://tiktokio.com/',
          'Content-Type'    : 'application/x-www-form-urlencoded',
          'User-Agent'      : 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
          'Referer'         : 'https://tiktokio.com/',
          'Content-Length'  : Buffer.byteLength(body)
        }
      },
      res => res.on('data', c => (chunks += c)).on('end', () => resolve(chunks))
    );
    req.on('error', reject).end(body);
  });

  const $ = cheerio.load(html);

  return {
    thumbnail : $('img[alt]').first().attr('src'),
    title     : $('#tk-search-h2').text().trim(),
    links     : {
      noWatermark   : $('.tk-down-link a:contains("Download without watermark")').not(':contains("HD")').attr('href') || null,
      noWatermarkHD : $('.tk-down-link a:contains("Download without watermark (HD)")').attr('href') || null,
      withWatermark : $('.tk-down-link a:contains("Download watermark")').attr('href') || null,
      mp3           : $('.tk-down-link a:contains("Download Mp3")').attr('href') || null
    }
  };
}

/* -------------------------------------------------
   Route
-------------------------------------------------- */
router.get('/api/tkdl2', async (req, res) => {
  const link = req.query.url;

  if (!link || !TIKTOK_REGEX.test(link)) {
    return res
      .set('Content-Type', 'application/json')
      .send(
        JSON.stringify(
          {
            creator: 'BLUE DEMON',
            status: 400,
            success: false,
            message: 'Please provide a valid TikTok URL.'
          },
          null,
          2
        )
      );
  }

  try {
    const data = await callTikTokio(link);

    // No links → 404
    if (!Object.values(data.links).some(Boolean)) {
      return res
        .set('Content-Type', 'application/json')
        .send(
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

    res
      .set('Content-Type', 'application/json')
      .send(
        JSON.stringify(
          {
            creator: 'BLUE DEMON',
            status: 200,
            success: true,
            input_url: link,
            thumbnail: data.thumbnail || 'Not found',
            title:     data.title     || 'Not found',
            download_links: data.links
          },
          null,
          2
        )
      );
  } catch (err) {
    console.error('❌ Error:', err.message);
    res
      .set('Content-Type', 'application/json')
      .send(
        JSON.stringify(
          {
            creator: 'BLUE DEMON',
            status: 500,
            success: false,
            message: 'An error occurred while fetching the download link.',
            error: err.message
          },
          null,
          2
        )
      );
  }
});

module.exports = router;
