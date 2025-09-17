const express = require('express');
const { chromium } = require('playwright');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

function similarity(a, b) {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  let matches = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++;
  }
  return matches / Math.max(s1.length, s2.length);
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

router.get('/api/episode', async (req, res) => {
  const animeQuery = req.query.anime;
  const episodeQuery = parseInt(req.query.ep);

  if (!animeQuery || isNaN(episodeQuery)) {
    return res.status(400).json({ error: 'anime and ep query parameters are required' });
  }

  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    await page.goto('https://animepahe.ru/anime', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.tab-content .tab-pane');
    await autoScroll(page);

    const results = await page.evaluate(() => {
      const allAnime = [];
      const panes = document.querySelectorAll('.tab-content .tab-pane');
      panes.forEach(pane => {
        const items = pane.querySelectorAll('.col-12.col-md-6 a');
        items.forEach(a => {
          const title = a.getAttribute('title');
          const link = a.getAttribute('href');
          if (title && link) allAnime.push({ title, link });
        });
      });
      return allAnime;
    });

    let bestMatch = null;
    let bestScore = 0;
    for (const anime of results) {
      const score = similarity(animeQuery, anime.title);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = anime;
      }
    }

    if (!bestMatch || bestScore < 0.3) {
      await browser.close();
      return res.status(404).json({ error: 'No matching anime found.' });
    }

    const animePageUrl = `https://animepahe.ru${bestMatch.link}`;
    await page.goto(animePageUrl, { waitUntil: 'domcontentloaded' });

    const animeId = await page.evaluate(() => {
      const meta = document.querySelector('meta[property="og:url"]');
      return meta ? meta.content.split('/').pop() : null;
    });

    if (!animeId) throw new Error('Failed to extract anime ID');

    let found = null;
    for (let pageNum = 1; pageNum <= 50; pageNum++) {
      const data = await page.evaluate(async (animeId, pageNum) => {
        try {
          const apiUrl = `https://animepahe.ru/api?m=release&id=${animeId}&page=${pageNum}&sort=episode_asc`;
          const res = await fetch(apiUrl);
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      }, animeId, pageNum);

      if (!data || !data.data) continue;

      const match = data.data.find(ep => ep.episode == episodeQuery || ep.number == episodeQuery);
      if (match) {
        found = {
          episode: match.episode,
          snapshot: match.snapshot.replace(/\\\//g, '/'),
          session: match.session
        };
        break;
      }
    }

    if (!found) {
      await browser.close();
      return res.status(404).json({ error: `Episode ${episodeQuery} not found.` });
    }

    let catboxUrl = found.snapshot;
    try {
      const imageResponse = await axios.get(found.snapshot, { responseType: 'arraybuffer' });
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', Buffer.from(imageResponse.data), {
        filename: 'snapshot.jpg',
        contentType: 'image/jpeg'
      });

      const uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: {
          ...form.getHeaders()
        }
      });

      if (uploadResponse.data.startsWith('https://files.catbox.moe/')) {
        catboxUrl = uploadResponse.data;
      } else {
        console.error('Catbox upload failed:', uploadResponse.data);
      }
    } catch (uploadError) {
      console.error('Error uploading to Catbox:', uploadError.message);
    }

    const playUrl = `https://animepahe.ru/play/${animeId}/${found.session}`;
    const playPage = await context.newPage();
    await playPage.goto(playUrl, { waitUntil: 'domcontentloaded' });
    await playPage.waitForTimeout(5000);

    const links = await playPage.evaluate(() => {
      const result = { sub: {}, dub: {} };
      const streamButtons = document.querySelectorAll('#resolutionMenu button[data-src]');
      streamButtons.forEach(button => {
        const quality = button.getAttribute('data-resolution') + 'p';
        const audio = button.getAttribute('data-audio');
        const url = button.getAttribute('data-src');
        if (audio === 'jpn') result.sub[quality] = url;
        else if (audio === 'eng') result.dub[quality] = url;
      });

      const downloadLinks = document.querySelectorAll('#pickDownload a[href*="pahe.win"]');
      downloadLinks.forEach(a => {
        const text = a.innerText.trim().toLowerCase();
        const href = a.href;
        const isDub = text.includes('eng');

        if (text.includes('360')) {
          if (isDub) result.dub['360p_download'] = href;
          else result.sub['360p_download'] = href;
        } else if (text.includes('480')) {
          if (isDub) result.dub['480p_download'] = href;
          else result.sub['480p_download'] = href;
        } else if (text.includes('720')) {
          if (isDub) result.dub['720p_download'] = href;
          else result.sub['720p_download'] = href;
        } else if (text.includes('1080')) {
          if (isDub) result.dub['1080p_download'] = href;
          else result.sub['1080p_download'] = href;
        }
      });

      return result;
    });

    await playPage.close();
    await browser.close();

    return res.json({
      title: bestMatch.title,
      episode: found.episode,
      snapshot: catboxUrl,
      playUrl,
      links
    });

  } catch (err) {
    await browser.close();
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;