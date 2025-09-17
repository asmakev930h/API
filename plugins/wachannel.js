// wachannel.js  (updated & stringified)
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const router = express.Router();
router.get('/api/wachannel', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.set('Content-Type', 'application/json').send(
      JSON.stringify({
        creator: 'BLUE DEMON',
        status: 400,
        success: false,
        message: 'Please provide a WhatsApp channel URL using the url query parameter.'
      }, null, 2)
    );
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
      }
    });

    const $ = cheerio.load(html);

    const name        = $('h3._9vd5._9t2_').text().trim();
    const followers   = $('h5._9vd5._9scy').text().trim();
    const description = $('h4._9vd5._9scb').text().trim();
    const image       = $('img._9vx6').attr('src') || null;

    const result = {
      creator: 'BLUE DEMON',
      status: 200,
      success: true,
      data: { name, followers, description, image }
    };

    res.set('Content-Type', 'application/json').send(JSON.stringify(result, null, 2));
  } catch (error) {
    res.set('Content-Type', 'application/json').send(
      JSON.stringify({
        creator: 'BLUE DEMON',
        status: 500,
        success: false,
        message: 'Failed to fetch WhatsApp channel data.',
        error: error.message
      }, null, 2)
    );
  }
});

module.exports = router;
