/*  instagram.js  –  FastDl.app fetch, always-stringified JSON  */
const express = require('express');
const https   = require('https');

const router = express.Router();

/* ---------- helpers ---------- */
const INSTAGRAM_REGEX =
/^https?:\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:p|reel|tv|stories)\/[\w-]+\/?(?:\?.*)?$/i;

async function callFastDl(rawUrl) {
  // FastDl expects a JSON payload
  const payload = JSON.stringify({
    url: rawUrl,
    ts: Date.now(),
    _ts: 1756733026042,
    _tsc: 0,
    _s: '212bceeb1a01e10c65b79e3198384484137b8457f6f81109a1af609bd77e2534'
  });

  const body = await new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(
      {
        hostname: 'fastdl.app',
        path: '/api/convert',
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
          'Referer': 'https://fastdl.app/en',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      res => {
        res.on('data', c => (data += c));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
    req.end(payload);
  });

  return JSON.parse(body);
}
/* ---------- route ---------- */
router.get('/api/instadl', async (req, res) => {
  const link = req.query.url;

  if (!link || !INSTAGRAM_REGEX.test(link)) {
    return res.set('Content-Type', 'application/json').send(
      JSON.stringify(
        {
          creator: 'BLUE DEMON',
          status: 400,
          success: false,
          message: 'Please provide a valid Instagram URL.'
        },
        null,
        2
      )
    );
  }

  try {
    const json = await callFastDl(link);

    const media   = json.url?.[0] || {};
    const thumb   = json.thumb || '';
    const title   = json.meta?.title || '';
    const url     = media.url || '';
    const type    = media.type || ''; // video / image
    const ts      = json.timestamp || null;

    if (!url) {
      return res.set('Content-Type', 'application/json').send(
        JSON.stringify(
          {
            creator: 'BLUE DEMON',
            status: 404,
            success: false,
            message: 'No downloadable media found.'
          },
          null,
          2
        )
      );
    }

    res.set('Content-Type', 'application/json').send(
      JSON.stringify(
        {
          creator: 'BLUE DEMON',
          status: 200,
          success: true,
          input_url: link,
          thumbnail: thumb,
          title,
          type,
          download_url: url,
          timestamp: ts
        },
        null,
        2
      )
    );

  } catch (err) {
    console.error('❌ Error:', err.message);
    res.set('Content-Type', 'application/json').send(
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
